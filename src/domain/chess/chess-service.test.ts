import { describe, expect, it } from "vitest";
import {
  createGameSnapshot,
  getLegalTargets,
  INITIAL_FEN,
  tryMove,
} from "./chess-service";

describe("chess service", () => {
  it("creates an initial game snapshot", () => {
    const snapshot = createGameSnapshot();

    expect(snapshot.fen).toBe(INITIAL_FEN);
    expect(snapshot.turn).toBe("w");
    expect(snapshot.turnLabel).toBe("White");
    expect(snapshot.history).toEqual([]);
  });

  it("accepts legal coordinate moves and records SAN history", () => {
    const result = tryMove(INITIAL_FEN, { from: "e2", to: "e4" });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.move.san).toBe("e4");
      expect(result.snapshot.turn).toBe("b");
      expect(result.snapshot.history).toEqual(["e4"]);
    }
  });

  it("rejects illegal coordinate moves without changing position", () => {
    const result = tryMove(INITIAL_FEN, { from: "e2", to: "e5" });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.fen).toBe(INITIAL_FEN);
      expect(result.message).toContain("Illegal move");
    }
  });

  it("returns legal targets for a selected square", () => {
    expect(getLegalTargets(INITIAL_FEN, "g1")).toEqual(["f3", "h3"]);
  });
});
