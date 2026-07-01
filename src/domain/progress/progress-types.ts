import type { OpeningId } from "@/domain/curriculum/curriculum-types";
import type { TutorProgressDelta } from "@/domain/tutor/tutor-types";

export type ProgressVersion = 1;

export type ProgressRecord = {
  nodeId: string;
  openingId: OpeningId;
  attempts: number;
  correct: number;
  misses: number;
  hintUses: number;
  correctFirstTry: number;
  masteryScore: number;
  nextReviewAt: string;
  lastAttemptAt: string;
};

export type ProgressState = {
  version: ProgressVersion;
  records: Record<string, ProgressRecord>;
};

export type ProgressAttempt = {
  nodeId: string;
  openingId: OpeningId;
  hintCount: number;
  progressDelta: TutorProgressDelta;
  attemptedAt: string;
};

export type ProgressSummary = {
  attempts: number;
  correct: number;
  misses: number;
  hintUses: number;
  dueCount: number;
  masteredCount: number;
  trackedCount: number;
};
