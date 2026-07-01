import { describe, expect, it } from "vitest";
import {
  applyProgressAttempt,
  createEmptyProgressState,
  getProgressSummary,
  getReviewQueue,
} from "./progress-scheduler";

const attemptedAt = "2026-07-01T10:00:00.000Z";

function correctAttempt(hintCount = 0) {
  return {
    attemptedAt,
    hintCount,
    nodeId: hintCount > 0 ? "london-core-002" : "london-core-001",
    openingId: "london" as const,
    progressDelta: {
      attempts: 1,
      correct: 1,
      masteryDelta: hintCount > 0 ? 1 : 2,
      misses: 0,
      shouldReview: false,
    },
  };
}

function wrongAttempt() {
  return {
    attemptedAt,
    hintCount: 0,
    nodeId: "caro-core-001",
    openingId: "caro-kann" as const,
    progressDelta: {
      attempts: 1,
      correct: 0,
      masteryDelta: -1,
      misses: 1,
      shouldReview: true,
    },
  };
}

describe("progress scheduler", () => {
  it("puts missed positions into the review queue soon", () => {
    const state = applyProgressAttempt(createEmptyProgressState(), wrongAttempt());

    expect(getReviewQueue(state, "2026-07-01T09:59:00.000Z")).toHaveLength(0);
    expect(getReviewQueue(state, "2026-07-01T10:00:00.000Z")).toEqual([
      expect.objectContaining({
        misses: 1,
        nodeId: "caro-core-001",
        openingId: "caro-kann",
      }),
    ]);
  });

  it("schedules clean correct answers farther out than hinted correct answers", () => {
    const cleanState = applyProgressAttempt(
      createEmptyProgressState(),
      correctAttempt(),
    );
    const hintedState = applyProgressAttempt(
      createEmptyProgressState(),
      correctAttempt(1),
    );

    const cleanReviewAt = cleanState.records["london-core-001"].nextReviewAt;
    const hintedReviewAt = hintedState.records["london-core-002"].nextReviewAt;

    expect(new Date(cleanReviewAt).getTime()).toBeGreaterThan(
      new Date(hintedReviewAt).getTime(),
    );
  });

  it("counts hint usage and gives hinted correct answers less mastery", () => {
    const state = applyProgressAttempt(createEmptyProgressState(), correctAttempt(2));
    const record = state.records["london-core-002"];

    expect(record.hintUses).toBe(1);
    expect(record.masteryScore).toBe(1);
    expect(record.correctFirstTry).toBe(0);
  });

  it("records clean first-try answers only before any prior attempts", () => {
    const firstState = applyProgressAttempt(
      createEmptyProgressState(),
      correctAttempt(),
    );
    const secondState = applyProgressAttempt(firstState, correctAttempt());

    expect(secondState.records["london-core-001"].correctFirstTry).toBe(1);
    expect(secondState.records["london-core-001"].correct).toBe(2);
  });

  it("summarizes tracked progress and due reviews", () => {
    const state = applyProgressAttempt(
      applyProgressAttempt(createEmptyProgressState(), wrongAttempt()),
      correctAttempt(1),
    );
    const summary = getProgressSummary(state, "2026-07-01T10:00:00.000Z");

    expect(summary).toMatchObject({
      attempts: 2,
      correct: 1,
      dueCount: 1,
      hintUses: 1,
      misses: 1,
      trackedCount: 2,
    });
  });
});
