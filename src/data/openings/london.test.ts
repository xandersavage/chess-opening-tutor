import { describe, expect, it } from "vitest";
import { createGameSnapshot, createMoveInputFromUci, tryMove } from "@/domain/chess/chess-service";
import {
  findNodeInOpening,
  getOpeningModule,
  getStartingNode,
} from "@/domain/curriculum/curriculum-selectors";
import { evaluateTutorMove } from "@/domain/tutor/tutor-engine";
import { starterCurriculum } from "./curriculum";

describe("London System curriculum", () => {
  it("covers the required London lesson families and beginner concepts", () => {
    const londonModule = getOpeningModule(starterCurriculum, "london");
    const variationIds = londonModule.variations.map((variation) => variation.id);
    const mistakeTags = new Set(
      londonModule.nodes.flatMap((node) =>
        node.mistakes.map((mistake) => mistake.tag),
      ),
    );
    const lessonText = londonModule.nodes
      .map((node) => `${node.prompt} ${node.explanation}`)
      .join(" ");

    expect(londonModule.nodes.length).toBeGreaterThanOrEqual(10);
    expect(variationIds).toEqual([
      "london-core-setup",
      "london-kings-indian-setup",
      "london-c5-pressure",
      "london-symmetric-bf5",
    ]);
    expect(mistakeTags.size).toBeGreaterThanOrEqual(5);
    expect(lessonText).toContain("Bf4");
    expect(lessonText).toContain("e3");
    expect(lessonText).toContain("Bd3");
    expect(lessonText).toContain("Nbd2");
    expect(lessonText).toContain("c3");
    expect(lessonText).toContain("Castling");
    expect(lessonText).toContain("Ne5");
  });

  it("walks through the complete guided core London setup", () => {
    let node = getStartingNode(starterCurriculum, "london");
    let snapshot = createGameSnapshot(node.fen);
    const visitedNodeIds: string[] = [];
    let lessonComplete = false;

    while (!lessonComplete) {
      visitedNodeIds.push(node.id);

      const expectedMove = node.expectedMoves[0];
      const moveResult = tryMove(snapshot, createMoveInputFromUci(expectedMove.uci));

      expect(moveResult.ok).toBe(true);

      if (!moveResult.ok) {
        throw new Error("Expected curriculum move to be legal");
      }

      const evaluation = evaluateTutorMove({
        move: moveResult.move,
        node,
      });

      expect(evaluation.feedbackKind).toBe("correct");
      expect(evaluation.retry).toBe(false);

      if (evaluation.opponentReply) {
        const replyResult = tryMove(
          moveResult.snapshot,
          createMoveInputFromUci(evaluation.opponentReply.uci),
        );

        expect(replyResult.ok).toBe(true);

        if (!replyResult.ok) {
          throw new Error("Expected curriculum opponent reply to be legal");
        }

        snapshot = replyResult.snapshot;
      } else {
        snapshot = moveResult.snapshot;
      }

      lessonComplete = evaluation.lessonComplete;

      if (evaluation.nextNodeId) {
        const nextNode = findNodeInOpening(
          starterCurriculum,
          "london",
          evaluation.nextNodeId,
        );

        expect(nextNode).not.toBeNull();

        if (!nextNode) {
          throw new Error(`Missing next node ${evaluation.nextNodeId}`);
        }

        expect(snapshot.fen).toBe(nextNode.fen);
        node = nextNode;
      }
    }

    expect(visitedNodeIds).toEqual([
      "london-core-001",
      "london-core-002",
      "london-core-003",
      "london-core-004",
      "london-core-005",
      "london-core-006",
      "london-core-007",
      "london-core-008",
      "london-core-009",
      "london-core-010",
    ]);
  });
});
