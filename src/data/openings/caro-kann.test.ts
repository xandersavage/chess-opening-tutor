import { describe, expect, it } from "vitest";
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
import { evaluateTutorMove } from "@/domain/tutor/tutor-engine";
import { starterCurriculum } from "./curriculum";

describe("Caro-Kann curriculum", () => {
  it("covers the required Caro-Kann lesson families and beginner concepts", () => {
    const caroModule = getOpeningModule(starterCurriculum, "caro-kann");
    const variationIds = caroModule.variations.map((variation) => variation.id);
    const mistakeTags = new Set(
      caroModule.nodes.flatMap((node) =>
        node.mistakes.map((mistake) => mistake.tag),
      ),
    );
    const lessonText = caroModule.nodes
      .map((node) => `${node.prompt} ${node.explanation}`)
      .join(" ");

    expect(caroModule.trainingSide).toBe("black");
    expect(caroModule.nodes.length).toBeGreaterThanOrEqual(12);
    expect(variationIds).toEqual([
      "caro-kann-core",
      "caro-kann-advance",
      "caro-kann-exchange",
      "caro-kann-classical-nc3",
      "caro-kann-modern-nd2",
      "caro-kann-fantasy",
      "caro-kann-panov",
    ]);
    expect(mistakeTags.size).toBeGreaterThanOrEqual(6);
    expect(lessonText).toContain("...c6");
    expect(lessonText).toContain("...d5");
    expect(lessonText).toContain("...Bf5");
    expect(lessonText).toContain("...e6");
    expect(lessonText).toContain("...c5");
    expect(lessonText).toContain("development");
  });

  it("walks through the guided core Caro-Kann path into the Advance", () => {
    let node = getStartingNode(starterCurriculum, "caro-kann");
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
          "caro-kann",
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
      "caro-core-001",
      "caro-core-002",
      "caro-advance-001",
      "caro-advance-002",
      "caro-advance-003",
    ]);
  });

  it("catches playing ...e6 before ...Bf5 in the Advance Variation", () => {
    const advanceNode = findNodeInOpening(
      starterCurriculum,
      "caro-kann",
      "caro-advance-001",
    );

    expect(advanceNode).not.toBeNull();

    if (!advanceNode) {
      throw new Error("Expected Advance Variation node to exist");
    }

    const moveResult = tryMove(advanceNode.fen, createMoveInputFromUci("e7e6"));

    expect(moveResult.ok).toBe(true);

    if (!moveResult.ok) {
      throw new Error("Expected ...e6 to be legal");
    }

    const evaluation = evaluateTutorMove({
      move: moveResult.move,
      node: advanceNode,
    });

    expect(evaluation.feedbackKind).toBe("known-mistake");
    expect(evaluation.mistakeTag).toBe("locks-bishop-in-advance");
    expect(evaluation.message).toContain("traps your light-square bishop");
    expect(evaluation.retry).toBe(true);
  });
});
