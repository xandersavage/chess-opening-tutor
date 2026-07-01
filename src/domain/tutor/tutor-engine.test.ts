import { describe, expect, it } from "vitest";
import { starterCurriculum } from "@/data/openings/curriculum";
import { getStartingNode } from "@/domain/curriculum/curriculum-selectors";
import { tryMove } from "@/domain/chess/chess-service";
import { evaluateTutorMove, getTutorHint, moveToUci } from "./tutor-engine";

function playMove(fen: string, from: string, to: string) {
  const result = tryMove(fen, { from, to });

  if (!result.ok) {
    throw new Error(result.message);
  }

  return result.move;
}

describe("tutor engine", () => {
  it("marks the expected London move as correct and advances through the branch", () => {
    const node = getStartingNode(starterCurriculum, "london");
    const move = playMove(node.fen, "d2", "d4");
    const evaluation = evaluateTutorMove({ move, node });

    expect(evaluation.feedbackKind).toBe("correct");
    expect(evaluation.advance).toBe(true);
    expect(evaluation.retry).toBe(false);
    expect(evaluation.nextNodeId).toBe("london-core-002");
    expect(evaluation.opponentReply).toEqual({
      san: "d5",
      uci: "d7d5",
    });
    expect(evaluation.progressDelta).toEqual({
      attempts: 1,
      correct: 1,
      masteryDelta: 2,
      misses: 0,
      shouldReview: false,
    });
  });

  it("uses a smaller mastery bump when the user needed a hint", () => {
    const node = getStartingNode(starterCurriculum, "caro-kann");
    const move = playMove(node.fen, "c7", "c6");
    const evaluation = evaluateTutorMove({ hintCount: 1, move, node });

    expect(evaluation.feedbackKind).toBe("correct");
    expect(evaluation.progressDelta.masteryDelta).toBe(1);
    expect(evaluation.nextNodeId).toBe("caro-core-002");
    expect(evaluation.opponentReply?.san).toBe("d4");
  });

  it("recognizes known mistakes and asks the learner to retry", () => {
    const node = getStartingNode(starterCurriculum, "london");
    const move = playMove(node.fen, "e2", "e4");
    const evaluation = evaluateTutorMove({ move, node });

    expect(evaluation.feedbackKind).toBe("known-mistake");
    expect(evaluation.mistakeTag).toBe("leaves-london-repertoire");
    expect(evaluation.advance).toBe(false);
    expect(evaluation.retry).toBe(true);
    expect(evaluation.progressDelta.shouldReview).toBe(true);
    expect(evaluation.message).toContain("leaves the London System");
  });

  it("treats acceptable alternatives as playable but not the lesson target", () => {
    const node = getStartingNode(starterCurriculum, "london");
    const move = playMove(node.fen, "g1", "f3");
    const evaluation = evaluateTutorMove({ move, node });

    expect(evaluation.feedbackKind).toBe("acceptable");
    expect(evaluation.advance).toBe(false);
    expect(evaluation.retry).toBe(true);
    expect(evaluation.expectedMoveSan).toBe("d4");
    expect(evaluation.progressDelta.masteryDelta).toBe(0);
  });

  it("gives principle-based feedback for unknown legal moves", () => {
    const node = getStartingNode(starterCurriculum, "london");
    const move = playMove(node.fen, "c2", "c4");
    const evaluation = evaluateTutorMove({ move, node });

    expect(evaluation.feedbackKind).toBe("unknown-legal");
    expect(evaluation.advance).toBe(false);
    expect(evaluation.retry).toBe(true);
    expect(evaluation.expectedMoveSan).toBe("d4");
    expect(evaluation.progressDelta.misses).toBe(1);
  });

  it("returns progressive hints and stops at the final hint", () => {
    const node = getStartingNode(starterCurriculum, "london");

    expect(getTutorHint(node, 0)).toMatchObject({
      index: 0,
      isFinalHint: false,
      nextHintCount: 1,
    });
    expect(getTutorHint(node, 99)).toMatchObject({
      index: 2,
      isFinalHint: true,
      message: "Play d4.",
      nextHintCount: 3,
    });
  });

  it("normalizes chess.js moves to UCI for curriculum matching", () => {
    const node = getStartingNode(starterCurriculum, "caro-kann");
    const move = playMove(node.fen, "c7", "c6");

    expect(move.san).toBe("c6");
    expect(moveToUci(move)).toBe("c7c6");
  });
});
