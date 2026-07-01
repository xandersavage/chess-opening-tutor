import { describe, expect, it } from "vitest";
import { starterCurriculum } from "@/data/openings/curriculum";
import {
  createGameSnapshot,
  createMoveInputFromUci,
  tryMove,
} from "@/domain/chess/chess-service";
import {
  findNodeInOpening,
  getOpeningModule,
  getStartingNode,
} from "@/domain/curriculum/curriculum-selectors";
import type { OpeningId } from "@/domain/curriculum/curriculum-types";
import {
  formatTutorMoveMessage,
  selectOpponentReplyForMode,
  type PracticeModeId,
} from "@/domain/practice/practice-modes";
import {
  applyProgressAttempt,
  createEmptyProgressState,
  getReviewQueue,
} from "@/domain/progress/progress-scheduler";
import { evaluateTutorMove } from "@/domain/tutor/tutor-engine";
import { formatTutorStyleMessage } from "@/domain/tutor/tutor-style";

const attemptedAt = "2026-07-01T12:00:00.000Z";

describe("release smoke flow", () => {
  it("completes the first London guided step from board move to tutor reply to progress", () => {
    const result = playOpeningStep("london", "guided", "d2", "d4");

    expect(getOpeningModule(starterCurriculum, "london").trainingSide).toBe("white");
    expect(result.evaluation.feedbackKind).toBe("correct");
    expect(result.evaluation.nextNodeId).toBe("london-core-002");
    expect(result.opponentReplySan).toBe("d5");
    expect(result.snapshot.history).toEqual(["d4", "d5"]);
    expect(result.nextNode?.prompt).toContain("king knight");
    expect(result.tutorMessage).toContain("I replied d5.");
    expect(result.progress.records["london-core-001"]).toMatchObject({
      attempts: 1,
      correct: 1,
      masteryScore: 2,
      misses: 0,
    });
    expect(getReviewQueue(result.progress, attemptedAt)).toHaveLength(0);
  });

  it("completes the first Caro-Kann assisted step from Black's side", () => {
    const result = playOpeningStep("caro-kann", "assisted", "c7", "c6");

    expect(getOpeningModule(starterCurriculum, "caro-kann").trainingSide).toBe(
      "black",
    );
    expect(result.evaluation.feedbackKind).toBe("correct");
    expect(result.evaluation.nextNodeId).toBe("caro-core-002");
    expect(result.opponentReplySan).toBe("d4");
    expect(result.snapshot.history).toEqual(["c6", "d4"]);
    expect(result.tutorMessage).toContain("I chose d4.");
    expect(result.progress.records["caro-core-001"]).toMatchObject({
      attempts: 1,
      correct: 1,
      masteryScore: 2,
      misses: 0,
    });
  });

  it("routes a missed London position into immediate review", () => {
    const node = getStartingNode(starterCurriculum, "london");
    const moveResult = tryMove(node.fen, { from: "e2", to: "e4" });

    expect(moveResult.ok).toBe(true);

    if (!moveResult.ok) {
      throw new Error(moveResult.message);
    }

    const evaluation = evaluateTutorMove({
      move: moveResult.move,
      node,
    });
    const progress = applyProgressAttempt(createEmptyProgressState(), {
      attemptedAt,
      hintCount: 0,
      nodeId: node.id,
      openingId: "london",
      progressDelta: evaluation.progressDelta,
    });

    expect(evaluation.feedbackKind).toBe("known-mistake");
    expect(evaluation.advance).toBe(false);
    expect(formatTutorStyleMessage("serious", evaluation.message, evaluation.tone))
      .toContain("Incorrect.");
    expect(getReviewQueue(progress, attemptedAt)).toEqual([
      expect.objectContaining({
        nodeId: "london-core-001",
        openingId: "london",
      }),
    ]);
  });
});

function playOpeningStep(
  openingId: OpeningId,
  modeId: PracticeModeId,
  from: string,
  to: string,
) {
  const node = getStartingNode(starterCurriculum, openingId);
  const initialSnapshot = createGameSnapshot(node.fen);
  const moveResult = tryMove(initialSnapshot, { from, to });

  if (!moveResult.ok) {
    throw new Error(moveResult.message);
  }

  const evaluation = evaluateTutorMove({
    move: moveResult.move,
    node,
  });
  const opponentReply = selectOpponentReplyForMode(modeId, evaluation);
  let snapshot = moveResult.snapshot;
  let opponentReplySan: string | undefined;

  if (opponentReply) {
    const replyResult = tryMove(
      snapshot,
      createMoveInputFromUci(opponentReply.uci),
    );

    if (!replyResult.ok) {
      throw new Error(replyResult.message);
    }

    snapshot = replyResult.snapshot;
    opponentReplySan = opponentReply.san;
  }

  const progress = applyProgressAttempt(createEmptyProgressState(), {
    attemptedAt,
    hintCount: 0,
    nodeId: node.id,
    openingId,
    progressDelta: evaluation.progressDelta,
  });
  const tutorMessage = formatTutorMoveMessage(modeId, {
    evaluation,
    lessonComplete: evaluation.lessonComplete,
    nextNodeLoaded: Boolean(evaluation.nextNodeId),
    opponentReplySan,
  });

  return {
    evaluation,
    nextNode: evaluation.nextNodeId
      ? findNodeInOpening(starterCurriculum, openingId, evaluation.nextNodeId)
      : null,
    opponentReplySan,
    progress,
    snapshot,
    tutorMessage,
  };
}
