import {
  Chess,
  DEFAULT_POSITION,
  SQUARES,
  type Color,
  type Move,
  type Square,
} from "chess.js";

export const INITIAL_FEN = DEFAULT_POSITION;

export type BoardOrientation = "white" | "black";

export type GameSnapshot = {
  fen: string;
  fullMoveNumber: number;
  history: string[];
  isCheck: boolean;
  isGameOver: boolean;
  statusLabel: string;
  turn: Color;
  turnLabel: "White" | "Black";
};

export type MoveInput = {
  from: string;
  promotion?: string;
  to: string;
};

export type MoveAttemptResult =
  | {
      ok: true;
      move: Move;
      snapshot: GameSnapshot;
    }
  | {
      ok: false;
      fen: string;
      message: string;
    };

type GameSource = GameSnapshot | string;

const squareSet = new Set<string>(SQUARES);

export function createGameSnapshot(fen = INITIAL_FEN): GameSnapshot {
  const chess = new Chess(fen);
  return createSnapshotFromGame(chess);
}

function createSnapshotFromGame(chess: Chess, history = chess.history()): GameSnapshot {
  const turn = chess.turn();

  return {
    fen: chess.fen(),
    fullMoveNumber: chess.moveNumber(),
    history,
    isCheck: chess.isCheck(),
    isGameOver: chess.isGameOver(),
    statusLabel: getStatusLabel(chess),
    turn,
    turnLabel: turn === "w" ? "White" : "Black",
  };
}

export function tryMove(source: GameSource, input: MoveInput): MoveAttemptResult {
  const fen = typeof source === "string" ? source : source.fen;
  const history = typeof source === "string" ? [] : source.history;
  const from = normalizeSquare(input.from);
  const to = normalizeSquare(input.to);

  if (!from || !to) {
    return {
      ok: false,
      fen,
      message: "Enter valid board squares, for example e2 to e4.",
    };
  }

  const chess = new Chess(fen);

  try {
    const move = chess.move({
      from,
      to,
      promotion: normalizePromotion(input.promotion),
    });

    return {
      ok: true,
      move,
      snapshot: createSnapshotFromGame(chess, [...history, move.san]),
    };
  } catch {
    return {
      ok: false,
      fen,
      message: `Illegal move: ${from} to ${to}.`,
    };
  }
}

export function createMoveInputFromUci(uci: string): MoveInput {
  return {
    from: uci.slice(0, 2),
    promotion: uci.slice(4) || undefined,
    to: uci.slice(2, 4),
  };
}

export function getLegalTargets(fen: string, square: string): string[] {
  const normalizedSquare = normalizeSquare(square);

  if (!normalizedSquare) {
    return [];
  }

  const chess = new Chess(fen);
  return chess
    .moves({ square: normalizedSquare, verbose: true })
    .map((move) => move.to);
}

function getStatusLabel(chess: Chess) {
  if (chess.isCheckmate()) {
    return "Checkmate";
  }

  if (chess.isStalemate()) {
    return "Stalemate";
  }

  if (chess.isDraw()) {
    return "Draw";
  }

  if (chess.isCheck()) {
    return "Check";
  }

  return "In progress";
}

function normalizeSquare(square: string): Square | null {
  const normalized = square.trim().toLowerCase();
  return squareSet.has(normalized) ? (normalized as Square) : null;
}

function normalizePromotion(promotion?: string) {
  const normalized = promotion?.trim().toLowerCase();
  return normalized && ["q", "r", "b", "n"].includes(normalized)
    ? normalized
    : "q";
}
