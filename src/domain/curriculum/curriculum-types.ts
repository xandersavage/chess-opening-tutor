import type { Color } from "chess.js";
import type { BoardOrientation } from "@/domain/chess/chess-service";

export type OpeningId = "london" | "caro-kann";
export type CurriculumVersion = 1;

export type Curriculum = {
  version: CurriculumVersion;
  modules: OpeningModule[];
};

export type OpeningModule = {
  id: OpeningId;
  title: string;
  trainingSide: BoardOrientation;
  description: string;
  variations: Variation[];
  nodes: CurriculumNode[];
};

export type Variation = {
  id: string;
  title: string;
  beginnerSummary: string;
  startingNodeId: string;
  conceptTags: string[];
};

export type CurriculumNode = {
  id: string;
  variationId: string;
  fen: string;
  sideToMove: Color;
  userSide: Color;
  prompt: string;
  expectedMoves: CurriculumMove[];
  acceptableMoves: CurriculumMove[];
  mistakes: MistakePattern[];
  hints: string[];
  explanation: string;
  conceptTags: string[];
  next: BranchRule[];
};

export type CurriculumMove = {
  san: string;
  uci: string;
  message?: string;
  nextNodeId?: string;
};

export type MistakePattern = {
  san?: string;
  uci?: string;
  tag: string;
  message: string;
  recoveryHint: string;
};

export type BranchRule = {
  move: {
    san: string;
    uci: string;
  };
  opponentReply?: {
    san: string;
    uci: string;
  };
  nodeId: string;
};

export type CurriculumValidationResult = {
  valid: boolean;
  errors: string[];
};

