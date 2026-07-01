import type { Move } from "chess.js";
import type { BranchRule, CurriculumNode } from "@/domain/curriculum/curriculum-types";

export type TutorFeedbackKind =
  | "acceptable"
  | "correct"
  | "known-mistake"
  | "unknown-legal";

export type TutorFeedbackTone = "info" | "success" | "warning";

export type TutorHighlight = {
  from: string;
  kind: "expected" | "played";
  to: string;
};

export type TutorProgressDelta = {
  attempts: number;
  correct: number;
  masteryDelta: number;
  misses: number;
  shouldReview: boolean;
};

export type TutorMoveEvaluation = {
  advance: boolean;
  expectedMoveSan?: string;
  feedbackKind: TutorFeedbackKind;
  highlights: TutorHighlight[];
  lessonComplete: boolean;
  message: string;
  mistakeTag?: string;
  moveSan: string;
  moveUci: string;
  nextNodeId?: string;
  opponentReply?: BranchRule["opponentReply"];
  progressDelta: TutorProgressDelta;
  retry: boolean;
  tone: TutorFeedbackTone;
};

export type TutorMoveContext = {
  hintCount?: number;
  move: Move;
  node: CurriculumNode;
};

export type TutorHint = {
  index: number;
  isFinalHint: boolean;
  message: string;
  nextHintCount: number;
};
