import { describe, expect, it } from "vitest";
import type { CurriculumNode } from "@/domain/curriculum/curriculum-types";
import type { TutorMoveEvaluation } from "@/domain/tutor/tutor-types";
import {
  formatHintMessage,
  formatTutorMoveMessage,
  getModeChangeMessage,
  getPositionPrompt,
  selectOpponentReplyForMode,
} from "./practice-modes";

const correctEvaluation: TutorMoveEvaluation = {
  advance: true,
  expectedMoveSan: "d4",
  feedbackKind: "correct",
  highlights: [],
  lessonComplete: false,
  message: "Good. d4 claims the center for the London setup.",
  moveSan: "d4",
  moveUci: "d2d4",
  nextNodeId: "london-core-002",
  opponentReply: {
    san: "d5",
    uci: "d7d5",
  },
  progressDelta: {
    attempts: 1,
    correct: 1,
    masteryDelta: 2,
    misses: 0,
    shouldReview: false,
  },
  retry: false,
  tone: "success",
};

const mistakeEvaluation: TutorMoveEvaluation = {
  advance: false,
  expectedMoveSan: "d4",
  feedbackKind: "unknown-legal",
  highlights: [],
  lessonComplete: false,
  message: "That move is legal, but it is not part of this lesson plan.",
  moveSan: "c4",
  moveUci: "c2c4",
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

const promptOnlyNode: CurriculumNode = {
  acceptableMoves: [],
  conceptTags: [],
  expectedMoves: [],
  explanation: "",
  fen: "startpos",
  hints: [],
  mistakes: [],
  next: [],
  prompt: "Play d4.",
  sideToMove: "w",
  userSide: "w",
  variationId: "test",
  id: "test-node",
};

describe("practice modes", () => {
  it("keeps guided feedback explanatory", () => {
    expect(
      formatTutorMoveMessage("guided", {
        evaluation: correctEvaluation,
        lessonComplete: false,
        nextNodeLoaded: true,
        opponentReplySan: "d5",
      }),
    ).toBe(
      "Good. d4 claims the center for the London setup. I replied d5. Next position loaded.",
    );
  });

  it("makes drill feedback concise", () => {
    expect(
      formatTutorMoveMessage("drill", {
        evaluation: mistakeEvaluation,
        lessonComplete: false,
        nextNodeLoaded: false,
      }),
    ).toBe("Not this line. Try d4.");
  });

  it("announces assisted opponent replies", () => {
    expect(selectOpponentReplyForMode("assisted", correctEvaluation)).toEqual({
      san: "d5",
      uci: "d7d5",
    });
    expect(
      formatTutorMoveMessage("assisted", {
        evaluation: correctEvaluation,
        lessonComplete: false,
        nextNodeLoaded: true,
        opponentReplySan: "d5",
      }),
    ).toContain("I chose d5.");
  });

  it("uses review-specific wording for due positions", () => {
    expect(
      formatTutorMoveMessage("review", {
        evaluation: mistakeEvaluation,
        lessonComplete: false,
        nextNodeLoaded: false,
      }),
    ).toBe("Review miss recorded. Target: d4.");
  });

  it("changes prompts and hints by mode", () => {
    expect(getPositionPrompt("drill", promptOnlyNode)).toBe("Find the target move.");
    expect(
      formatHintMessage("review", {
        index: 0,
        isFinalHint: false,
        message: "Look at the center.",
        nextHintCount: 1,
      }),
    ).toBe("Review hint 1: Look at the center.");
  });

  it("summarizes review mode from the due count without resetting state", () => {
    expect(getModeChangeMessage("review", 2)).toBe(
      "Review mode selected. Choose a due position below.",
    );
  });
});
