import type {
  ProgressAttempt,
  ProgressRecord,
  ProgressState,
  ProgressSummary,
} from "./progress-types";

const progressVersion = 1;
const maxMasteryScore = 10;
const masteredThreshold = 7;
const minuteMs = 60 * 1000;
const dayMs = 24 * 60 * minuteMs;

export function createEmptyProgressState(): ProgressState {
  return {
    records: {},
    version: progressVersion,
  };
}

export function applyProgressAttempt(
  state: ProgressState,
  attempt: ProgressAttempt,
): ProgressState {
  const existing = state.records[attempt.nodeId];
  const attempts = (existing?.attempts ?? 0) + attempt.progressDelta.attempts;
  const correct = (existing?.correct ?? 0) + attempt.progressDelta.correct;
  const misses = (existing?.misses ?? 0) + attempt.progressDelta.misses;
  const hintUses = (existing?.hintUses ?? 0) + (attempt.hintCount > 0 ? 1 : 0);
  const masteryScore = clampMastery(
    (existing?.masteryScore ?? 0) + attempt.progressDelta.masteryDelta,
  );

  const record: ProgressRecord = {
    attempts,
    correct,
    correctFirstTry:
      (existing?.correctFirstTry ?? 0) +
      (isCleanFirstTry(existing, attempt) ? 1 : 0),
    hintUses,
    lastAttemptAt: attempt.attemptedAt,
    masteryScore,
    misses,
    nextReviewAt: scheduleNextReview(existing, attempt, masteryScore),
    nodeId: attempt.nodeId,
    openingId: attempt.openingId,
  };

  return {
    records: {
      ...state.records,
      [attempt.nodeId]: record,
    },
    version: progressVersion,
  };
}

export function getReviewQueue(
  state: ProgressState,
  nowIso: string,
  limit = Number.POSITIVE_INFINITY,
): ProgressRecord[] {
  const now = new Date(nowIso).getTime();

  return Object.values(state.records)
    .filter((record) => new Date(record.nextReviewAt).getTime() <= now)
    .sort((first, second) => {
      const reviewTime =
        new Date(first.nextReviewAt).getTime() -
        new Date(second.nextReviewAt).getTime();

      if (reviewTime !== 0) {
        return reviewTime;
      }

      return second.misses - first.misses;
    })
    .slice(0, limit);
}

export function getProgressSummary(
  state: ProgressState,
  nowIso: string,
): ProgressSummary {
  const records = Object.values(state.records);

  return records.reduce<ProgressSummary>(
    (summary, record) => {
      summary.attempts += record.attempts;
      summary.correct += record.correct;
      summary.misses += record.misses;
      summary.hintUses += record.hintUses;
      summary.trackedCount += 1;

      if (record.masteryScore >= masteredThreshold) {
        summary.masteredCount += 1;
      }

      if (new Date(record.nextReviewAt).getTime() <= new Date(nowIso).getTime()) {
        summary.dueCount += 1;
      }

      return summary;
    },
    {
      attempts: 0,
      correct: 0,
      dueCount: 0,
      hintUses: 0,
      masteredCount: 0,
      misses: 0,
      trackedCount: 0,
    },
  );
}

function scheduleNextReview(
  existing: ProgressRecord | undefined,
  attempt: ProgressAttempt,
  masteryScore: number,
) {
  if (
    attempt.progressDelta.shouldReview ||
    attempt.progressDelta.misses > 0
  ) {
    return attempt.attemptedAt;
  }

  if (attempt.progressDelta.correct > 0) {
    if (attempt.hintCount > 0) {
      return addTime(attempt.attemptedAt, dayMs);
    }

    if (masteryScore >= masteredThreshold) {
      return addTime(attempt.attemptedAt, 7 * dayMs);
    }

    if (masteryScore >= 3) {
      return addTime(attempt.attemptedAt, 3 * dayMs);
    }

    return addTime(attempt.attemptedAt, 3 * dayMs);
  }

  return existing?.nextReviewAt ?? addTime(attempt.attemptedAt, dayMs);
}

function isCleanFirstTry(
  existing: ProgressRecord | undefined,
  attempt: ProgressAttempt,
) {
  return (
    !existing &&
    attempt.progressDelta.correct > 0 &&
    attempt.progressDelta.misses === 0 &&
    attempt.hintCount === 0
  );
}

function clampMastery(score: number) {
  return Math.min(maxMasteryScore, Math.max(0, score));
}

function addTime(iso: string, durationMs: number) {
  return new Date(new Date(iso).getTime() + durationMs).toISOString();
}
