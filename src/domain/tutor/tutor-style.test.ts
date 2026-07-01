import { describe, expect, it } from "vitest";
import {
  defaultTutorStyleId,
  formatTutorStyleMessage,
  getTutorStyle,
  isTutorStyleId,
} from "./tutor-style";
import {
  loadTutorStyleId,
  saveTutorStyleId,
} from "./tutor-style-storage";

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("tutor style", () => {
  it("keeps calm coach wording unchanged", () => {
    expect(formatTutorStyleMessage("calm", "Good. Play d4.", "success")).toBe(
      "Good. Play d4.",
    );
  });

  it("makes serious trainer wording direct without changing the chess detail", () => {
    expect(formatTutorStyleMessage("serious", "Good. Play d4.", "success")).toBe(
      "Correct. Play d4.",
    );
  });

  it("makes playful companion wording lighter for mistakes", () => {
    expect(
      formatTutorStyleMessage("playful", "That move is not the target.", "warning"),
    ).toBe("Almost. That move is not the target.");
  });

  it("loads calm coach by default and persists a selected style", () => {
    const storage = new MemoryStorage();

    expect(loadTutorStyleId(storage)).toBe(defaultTutorStyleId);
    saveTutorStyleId("serious", storage);
    expect(loadTutorStyleId(storage)).toBe("serious");
  });

  it("validates known tutor style ids", () => {
    expect(isTutorStyleId("playful")).toBe(true);
    expect(isTutorStyleId("mystery")).toBe(false);
    expect(getTutorStyle("calm").label).toBe("Calm Coach");
  });
});
