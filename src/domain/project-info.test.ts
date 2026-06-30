import { describe, expect, it } from "vitest";
import { openingModules, projectInfo } from "./project-info";

describe("project info", () => {
  it("describes the first two opening modules", () => {
    expect(projectInfo.name).toBe("Chess Opening Tutor");
    expect(openingModules).toHaveLength(2);
    expect(openingModules.map((module) => module.id)).toEqual([
      "london",
      "caro-kann",
    ]);
  });
});

