import { Chess, validateFen } from "chess.js";
import type {
  BranchRule,
  Curriculum,
  CurriculumMove,
  CurriculumNode,
  CurriculumValidationResult,
  MistakePattern,
  OpeningModule,
  Variation,
} from "./curriculum-types";

const mistakeTagPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const uciPattern = /^[a-h][1-8][a-h][1-8][qrbn]?$/;

export function validateCurriculum(
  curriculum: Curriculum,
): CurriculumValidationResult {
  const errors: string[] = [];
  const moduleIds = new Set<string>();
  const globalNodeIds = new Set<string>();
  const globalNodeMap = new Map<string, CurriculumNode>();

  if (curriculum.version !== 1) {
    errors.push(`Unsupported curriculum version: ${curriculum.version}.`);
  }

  if (curriculum.modules.length === 0) {
    errors.push("Curriculum must include at least one opening module.");
  }

  for (const openingModule of curriculum.modules) {
    validateModuleShape(openingModule, moduleIds, errors);

    for (const node of openingModule.nodes) {
      if (globalNodeIds.has(node.id)) {
        errors.push(`Duplicate node id: ${node.id}.`);
      }

      globalNodeIds.add(node.id);
      globalNodeMap.set(node.id, node);
    }
  }

  for (const openingModule of curriculum.modules) {
    validateModuleReferences(openingModule, globalNodeMap, errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function assertValidCurriculum(curriculum: Curriculum) {
  const result = validateCurriculum(curriculum);

  if (!result.valid) {
    throw new Error(
      `Curriculum validation failed:\n${result.errors
        .map((error) => `- ${error}`)
        .join("\n")}`,
    );
  }
}

function validateModuleShape(
  openingModule: OpeningModule,
  moduleIds: Set<string>,
  errors: string[],
) {
  if (moduleIds.has(openingModule.id)) {
    errors.push(`Duplicate opening module id: ${openingModule.id}.`);
  }

  moduleIds.add(openingModule.id);

  if (openingModule.variations.length === 0) {
    errors.push(`Module ${openingModule.id} must include at least one variation.`);
  }

  if (openingModule.nodes.length === 0) {
    errors.push(
      `Module ${openingModule.id} must include at least one curriculum node.`,
    );
  }
}

function validateModuleReferences(
  openingModule: OpeningModule,
  globalNodeMap: Map<string, CurriculumNode>,
  errors: string[],
) {
  const variationIds = new Set(
    openingModule.variations.map((variation) => variation.id),
  );
  const moduleNodeMap = new Map(openingModule.nodes.map((node) => [node.id, node]));

  for (const variation of openingModule.variations) {
    validateVariation(openingModule, variation, moduleNodeMap, errors);
  }

  for (const node of openingModule.nodes) {
    validateNode(node, variationIds, moduleNodeMap, globalNodeMap, errors);
  }
}

function validateVariation(
  openingModule: OpeningModule,
  variation: Variation,
  moduleNodeMap: Map<string, CurriculumNode>,
  errors: string[],
) {
  if (!variation.title.trim()) {
    errors.push(
      `Variation ${variation.id} in ${openingModule.id} must have a title.`,
    );
  }

  if (!variation.beginnerSummary.trim()) {
    errors.push(
      `Variation ${variation.id} in ${openingModule.id} must have a beginner summary.`,
    );
  }

  if (!moduleNodeMap.has(variation.startingNodeId)) {
    errors.push(
      `Variation ${variation.id} starts at missing node ${variation.startingNodeId}.`,
    );
  }
}

function validateNode(
  node: CurriculumNode,
  variationIds: Set<string>,
  moduleNodeMap: Map<string, CurriculumNode>,
  globalNodeMap: Map<string, CurriculumNode>,
  errors: string[],
) {
  const fenValidation = validateFen(node.fen);

  if (!variationIds.has(node.variationId)) {
    errors.push(
      `Node ${node.id} references missing variation ${node.variationId}.`,
    );
  }

  if (!fenValidation.ok) {
    errors.push(`Node ${node.id} has invalid FEN: ${fenValidation.error}.`);
    return;
  }

  const chess = new Chess(node.fen);

  if (chess.turn() !== node.sideToMove) {
    errors.push(
      `Node ${node.id} sideToMove ${node.sideToMove} does not match FEN turn ${chess.turn()}.`,
    );
  }

  if (node.userSide !== "w" && node.userSide !== "b") {
    errors.push(`Node ${node.id} has invalid userSide ${node.userSide}.`);
  }

  if (!node.prompt.trim()) {
    errors.push(`Node ${node.id} must include a prompt.`);
  }

  if (node.expectedMoves.length === 0) {
    errors.push(`Node ${node.id} must include at least one expected move.`);
  }

  if (node.hints.length === 0) {
    errors.push(`Node ${node.id} must include at least one hint.`);
  }

  if (!node.explanation.trim()) {
    errors.push(`Node ${node.id} must include an explanation.`);
  }

  validateMoves(
    node,
    "expected",
    node.expectedMoves,
    moduleNodeMap,
    globalNodeMap,
    errors,
  );
  validateMoves(
    node,
    "acceptable",
    node.acceptableMoves,
    moduleNodeMap,
    globalNodeMap,
    errors,
  );

  for (const mistake of node.mistakes) {
    validateMistake(node, mistake, errors);
  }

  for (const branch of node.next) {
    validateBranch(node, branch, moduleNodeMap, globalNodeMap, errors);
  }
}

function validateMoves(
  node: CurriculumNode,
  role: "acceptable" | "expected",
  moves: CurriculumMove[],
  moduleNodeMap: Map<string, CurriculumNode>,
  globalNodeMap: Map<string, CurriculumNode>,
  errors: string[],
) {
  for (const move of moves) {
    const result = applyMove(node.fen, move);

    if (!result.ok) {
      errors.push(`Node ${node.id} ${role} move ${move.uci} is not legal.`);
      continue;
    }

    if (result.san !== move.san) {
      errors.push(
        `Node ${node.id} ${role} move ${move.uci} is legal but SAN ${move.san} does not match ${result.san}.`,
      );
    }

    if (move.nextNodeId) {
      if (!globalNodeMap.has(move.nextNodeId)) {
        errors.push(
          `Node ${node.id} ${role} move ${move.uci} points to missing node ${move.nextNodeId}.`,
        );
      } else if (!moduleNodeMap.has(move.nextNodeId)) {
        errors.push(
          `Node ${node.id} ${role} move ${move.uci} points outside its opening module to ${move.nextNodeId}.`,
        );
      }
    }
  }
}

function validateMistake(
  node: CurriculumNode,
  mistake: MistakePattern,
  errors: string[],
) {
  if (!mistakeTagPattern.test(mistake.tag)) {
    errors.push(`Node ${node.id} mistake tag ${mistake.tag} must be kebab-case.`);
  }

  if (!mistake.san && !mistake.uci) {
    errors.push(`Node ${node.id} mistake ${mistake.tag} needs SAN or UCI.`);
  }

  if (mistake.uci && !uciPattern.test(mistake.uci)) {
    errors.push(`Node ${node.id} mistake ${mistake.tag} has invalid UCI.`);
  }

  if (!mistake.message.trim()) {
    errors.push(`Node ${node.id} mistake ${mistake.tag} needs a message.`);
  }

  if (!mistake.recoveryHint.trim()) {
    errors.push(`Node ${node.id} mistake ${mistake.tag} needs a recovery hint.`);
  }
}

function validateBranch(
  node: CurriculumNode,
  branch: BranchRule,
  moduleNodeMap: Map<string, CurriculumNode>,
  globalNodeMap: Map<string, CurriculumNode>,
  errors: string[],
) {
  const target = moduleNodeMap.get(branch.nodeId);

  if (!globalNodeMap.has(branch.nodeId)) {
    errors.push(`Node ${node.id} branch target ${branch.nodeId} does not exist.`);
    return;
  }

  if (!target) {
    errors.push(
      `Node ${node.id} branch target ${branch.nodeId} is outside its opening module.`,
    );
    return;
  }

  const firstMove = applyMove(node.fen, branch.move);

  if (!firstMove.ok) {
    errors.push(`Node ${node.id} branch move ${branch.move.uci} is not legal.`);
    return;
  }

  if (firstMove.san !== branch.move.san) {
    errors.push(
      `Node ${node.id} branch move ${branch.move.uci} SAN ${branch.move.san} does not match ${firstMove.san}.`,
    );
    return;
  }

  const finalFen = branch.opponentReply
    ? applyReply(firstMove.fen, branch, node.id, errors)
    : firstMove.fen;

  if (finalFen && finalFen !== target.fen) {
    errors.push(
      `Node ${node.id} branch to ${branch.nodeId} does not match target FEN.`,
    );
  }
}

function applyReply(
  fen: string,
  branch: BranchRule,
  sourceNodeId: string,
  errors: string[],
) {
  if (!branch.opponentReply) {
    return fen;
  }

  const reply = applyMove(fen, branch.opponentReply);

  if (!reply.ok) {
    errors.push(
      `Node ${sourceNodeId} branch opponent reply ${branch.opponentReply.uci} is not legal.`,
    );
    return null;
  }

  if (reply.san !== branch.opponentReply.san) {
    errors.push(
      `Node ${sourceNodeId} branch opponent reply ${branch.opponentReply.uci} SAN ${branch.opponentReply.san} does not match ${reply.san}.`,
    );
    return null;
  }

  return reply.fen;
}

function applyMove(fen: string, move: { san: string; uci: string }) {
  if (!uciPattern.test(move.uci)) {
    return { ok: false as const };
  }

  const chess = new Chess(fen);

  try {
    const result = chess.move({
      from: move.uci.slice(0, 2),
      to: move.uci.slice(2, 4),
      promotion: move.uci.slice(4) || undefined,
    });

    return {
      ok: true as const,
      fen: chess.fen(),
      san: result.san,
    };
  } catch {
    return { ok: false as const };
  }
}
