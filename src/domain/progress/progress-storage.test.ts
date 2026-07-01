import { describe, expect, it } from "vitest";
import {
  applyProgressAttempt,
  createEmptyProgressState,
} from "./progress-scheduler";
import {
  clearStoredProgress,
  loadProgressState,
  saveProgressState,
} from "./progress-storage";

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("progress storage", () => {
  it("saves and loads local progress state", () => {
    const storage = new MemoryStorage();
    const state = applyProgressAttempt(createEmptyProgressState(), {
      attemptedAt: "2026-07-01T10:00:00.000Z",
      hintCount: 0,
      nodeId: "london-core-001",
      openingId: "london",
      progressDelta: {
        attempts: 1,
        correct: 1,
        masteryDelta: 2,
        misses: 0,
        shouldReview: false,
      },
    });

    saveProgressState(state, storage);

    expect(loadProgressState(storage)).toEqual(state);
  });

  it("falls back to an empty state when stored data is invalid", () => {
    const storage = new MemoryStorage();

    storage.setItem("chess-opening-tutor.progress.v1", "{broken");

    expect(loadProgressState(storage)).toEqual(createEmptyProgressState());
  });

  it("clears stored progress", () => {
    const storage = new MemoryStorage();

    saveProgressState(createEmptyProgressState(), storage);
    clearStoredProgress(storage);

    expect(loadProgressState(storage)).toEqual(createEmptyProgressState());
  });
});
