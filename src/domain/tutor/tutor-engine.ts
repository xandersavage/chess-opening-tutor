import type { Move } from "chess.js";
import type {
  BranchRule,
  CurriculumMove,
  CurriculumNode,
  MistakePattern,
} from "@/domain/curriculum/curriculum-types";
import type {
  TutorHint,
  TutorMoveContext,
  TutorMoveEvaluation,
  TutorProgressDelta,
} from "./tutor-types";

type NormalizedMove = {
  san: string;
  uci: string;
};

export function evaluateTutorMove({
  hintCount = 0,
  move,
  node,
}: TutorMoveContext): TutorMoveEvaluation {
  const normalizedMove = normalizeMove(move);
  const expectedMove = findCurriculumMove(node.expectedMoves, normalizedMove);

  if (expectedMove) {
    return buildCorrectEvaluation(node, normalizedMove, expectedMove, hintCount);
  }

  const acceptableMove = findCurriculumMove(
    node.acceptableMoves,
    normalizedMove,
  );

  if (acceptableMove) {
    return buildAcceptableEvaluation(node, normalizedMove, acceptableMove);
  }

  const knownMistake = findMistake(node.mistakes, normalizedMove);

  if (knownMistake) {
    return buildMistakeEvaluation(node, normalizedMove, knownMistake);
  }

  return buildUnknownLegalEvaluation(node, normalizedMove);
}

export function getTutorHint(node: CurriculumNode, hintCount: number): TutorHint {
  const index = Math.min(Math.max(hintCount, 0), node.hints.length - 1);
  const isFinalHint = index >= node.hints.length - 1;

  return {
    index,
    isFinalHint,
    message: node.hints[index],
    nextHintCount: isFinalHint ? node.hints.length : index + 1,
  };
}

export function moveToUci(move: Pick<Move, "from" | "promotion" | "to">) {
  return `${move.from}${move.to}${move.promotion ?? ""}`;
}

function buildCorrectEvaluation(
  node: CurriculumNode,
  move: NormalizedMove,
  expectedMove: CurriculumMove,
  hintCount: number,
): TutorMoveEvaluation {
  const branch = findBranch(node.next, move);
  const nextNodeId = expectedMove.nextNodeId ?? branch?.nodeId;
  const lessonComplete = !nextNodeId;

  return {
    advance: true,
    expectedMoveSan: expectedMove.san,
    feedbackKind: "correct",
    highlights: [buildPlayedHighlight(move)],
    lessonComplete,
    message:
      expectedMove.message ??
      `Good. ${expectedMove.san} is the target move for this position.`,
    moveSan: move.san,
    moveUci: move.uci,
    nextNodeId,
    opponentReply: branch?.opponentReply,
    progressDelta: {
      attempts: 1,
      correct: 1,
      masteryDelta: hintCount > 0 ? 1 : 2,
      misses: 0,
      shouldReview: false,
    },
    retry: false,
    tone: "success",
  };
}

function buildAcceptableEvaluation(
  node: CurriculumNode,
  move: NormalizedMove,
  acceptableMove: CurriculumMove,
): TutorMoveEvaluation {
  const branch = findBranch(node.next, move);
  const nextNodeId = acceptableMove.nextNodeId ?? branch?.nodeId;
  const advance = Boolean(nextNodeId);

  return {
    advance,
    expectedMoveSan: getPrimaryExpectedMove(node)?.san,
    feedbackKind: "acceptable",
    highlights: [
      buildPlayedHighlight(move),
      ...buildExpectedHighlights(node, move),
    ],
    lessonComplete: false,
    message:
      acceptableMove.message ??
      `${acceptableMove.san} is playable, but this lesson is asking for a different move.`,
    moveSan: move.san,
    moveUci: move.uci,
    nextNodeId,
    opponentReply: branch?.opponentReply,
    progressDelta: buildNeutralProgress(),
    retry: !advance,
    tone: "info",
  };
}

function buildNeutralProgress(): TutorProgressDelta {
  return {
    attempts: 1,
    correct: 0,
    masteryDelta: 0,
    misses: 0,
    shouldReview: false,
  };
}

function buildMistakeEvaluation(
  node: CurriculumNode,
  move: NormalizedMove,
  mistake: MistakePattern,
): TutorMoveEvaluation {
  return {
    advance: false,
    expectedMoveSan: getPrimaryExpectedMove(node)?.san,
    feedbackKind: "known-mistake",
    highlights: [
      buildPlayedHighlight(move),
      ...buildExpectedHighlights(node, move),
    ],
    lessonComplete: false,
    message: `${mistake.message} ${mistake.recoveryHint}`,
    mistakeTag: mistake.tag,
    moveSan: move.san,
    moveUci: move.uci,
    progressDelta: {
      attempts: 1,
      correct: 0,
      masteryDelta: -1,
      misses: 1,
      shouldReview: true,
    },
    retry: true,
    tone: "warning",
  };
}

function buildUnknownLegalEvaluation(
  node: CurriculumNode,
  move: NormalizedMove,
): TutorMoveEvaluation {
  const expectedMove = getPrimaryExpectedMove(node);
  const targetText = expectedMove
    ? ` Try ${expectedMove.san} for this lesson.`
    : "";

  return {
    advance: false,
    expectedMoveSan: expectedMove?.san,
    feedbackKind: "unknown-legal",
    highlights: [
      buildPlayedHighlight(move),
      ...buildExpectedHighlights(node, move),
    ],
    lessonComplete: false,
    message: `That move is legal, but it is not part of this lesson plan.${targetText}`,
    moveSan: move.san,
    moveUci: move.uci,
    progressDelta: {
      attempts: 1,
      correct: 0,
      masteryDelta: -1,
      misses: 1,
      shouldReview: true,
    },
    retry: true,
    tone: "warning",
  };
}

function findCurriculumMove(
  moves: CurriculumMove[],
  move: NormalizedMove,
): CurriculumMove | null {
  return (
    moves.find((candidate) => candidate.uci === move.uci) ??
    moves.find((candidate) => candidate.san === move.san) ??
    null
  );
}

function findMistake(
  mistakes: MistakePattern[],
  move: NormalizedMove,
): MistakePattern | null {
  return (
    mistakes.find((mistake) => mistake.uci === move.uci) ??
    mistakes.find((mistake) => mistake.san === move.san) ??
    null
  );
}

function findBranch(
  branches: BranchRule[],
  move: NormalizedMove,
): BranchRule | null {
  return (
    branches.find((branch) => branch.move.uci === move.uci) ??
    branches.find((branch) => branch.move.san === move.san) ??
    null
  );
}

function getPrimaryExpectedMove(node: CurriculumNode) {
  return node.expectedMoves[0];
}

function normalizeMove(move: Move): NormalizedMove {
  return {
    san: move.san,
    uci: moveToUci(move),
  };
}

function buildPlayedHighlight(move: NormalizedMove) {
  return {
    from: move.uci.slice(0, 2),
    kind: "played" as const,
    to: move.uci.slice(2, 4),
  };
}

function buildExpectedHighlights(
  node: CurriculumNode,
  move: NormalizedMove,
) {
  return node.expectedMoves
    .filter((expectedMove) => expectedMove.uci !== move.uci)
    .map((expectedMove) => ({
      from: expectedMove.uci.slice(0, 2),
      kind: "expected" as const,
      to: expectedMove.uci.slice(2, 4),
    }));
}
