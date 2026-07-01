import { describe, expect, it } from "vitest";
import { starterCurriculum } from "@/data/openings/curriculum";
import {
  assertValidCurriculum,
  validateCurriculum,
} from "./curriculum-validation";

describe("curriculum validation", () => {
  it("accepts the starter curriculum", () => {
    expect(validateCurriculum(starterCurriculum)).toEqual({
      valid: true,
      errors: [],
    });
  });

  it("throws with a useful error summary when curriculum is invalid", () => {
    const invalid = structuredClone(starterCurriculum);
    invalid.modules[0].nodes[0].fen = "not-a-fen";

    expect(() => assertValidCurriculum(invalid)).toThrow(
      "Curriculum validation failed",
    );
  });

  it("rejects duplicate node ids", () => {
    const invalid = structuredClone(starterCurriculum);
    invalid.modules[0].nodes[1].id = invalid.modules[0].nodes[0].id;

    expect(validateCurriculum(invalid).errors).toContain(
      "Duplicate node id: london-core-001.",
    );
  });

  it("rejects missing branch target nodes", () => {
    const invalid = structuredClone(starterCurriculum);
    invalid.modules[0].nodes[0].next[0].nodeId = "missing-node";

    expect(validateCurriculum(invalid).errors).toContain(
      "Node london-core-001 branch target missing-node does not exist.",
    );
  });

  it("rejects branch targets outside the current opening module", () => {
    const invalid = structuredClone(starterCurriculum);
    invalid.modules[0].nodes[0].next[0].nodeId = "caro-core-001";

    expect(validateCurriculum(invalid).errors).toContain(
      "Node london-core-001 branch target caro-core-001 is outside its opening module.",
    );
  });

  it("rejects illegal expected moves", () => {
    const invalid = structuredClone(starterCurriculum);
    invalid.modules[1].nodes[0].expectedMoves[0].uci = "c7c4";
    invalid.modules[1].nodes[0].expectedMoves[0].san = "c4";

    expect(validateCurriculum(invalid).errors).toContain(
      "Node caro-core-001 expected move c7c4 is not legal.",
    );
  });

  it("rejects branch targets whose FEN does not match the move sequence", () => {
    const invalid = structuredClone(starterCurriculum);
    invalid.modules[0].nodes[1].fen = starterCurriculum.modules[0].nodes[0].fen;

    expect(validateCurriculum(invalid).errors).toContain(
      "Node london-core-001 branch to london-core-002 does not match target FEN.",
    );
  });
});
