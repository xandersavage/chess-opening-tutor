import {
  createEmptyProgressState,
} from "./progress-scheduler";
import type { ProgressRecord, ProgressState } from "./progress-types";

type StorageLike = Pick<Storage, "getItem" | "removeItem" | "setItem">;

const progressStorageKey = "chess-opening-tutor.progress.v1";

export function loadProgressState(
  storage: StorageLike | null = getBrowserStorage(),
): ProgressState {
  if (!storage) {
    return createEmptyProgressState();
  }

  try {
    const rawValue = storage.getItem(progressStorageKey);

    if (!rawValue) {
      return createEmptyProgressState();
    }

    const parsed = JSON.parse(rawValue) as unknown;

    if (!isProgressState(parsed)) {
      return createEmptyProgressState();
    }

    return parsed;
  } catch {
    return createEmptyProgressState();
  }
}

export function saveProgressState(
  state: ProgressState,
  storage: StorageLike | null = getBrowserStorage(),
) {
  storage?.setItem(progressStorageKey, JSON.stringify(state));
}

export function clearStoredProgress(
  storage: StorageLike | null = getBrowserStorage(),
) {
  storage?.removeItem(progressStorageKey);
}

function getBrowserStorage(): StorageLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function isProgressState(value: unknown): value is ProgressState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ProgressState>;

  return candidate.version === 1 && isRecordMap(candidate.records);
}

function isRecordMap(value: unknown): value is Record<string, ProgressRecord> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(isProgressRecord);
}

function isProgressRecord(value: unknown): value is ProgressRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ProgressRecord>;

  return (
    typeof candidate.nodeId === "string" &&
    (candidate.openingId === "london" || candidate.openingId === "caro-kann") &&
    typeof candidate.attempts === "number" &&
    typeof candidate.correct === "number" &&
    typeof candidate.misses === "number" &&
    typeof candidate.hintUses === "number" &&
    typeof candidate.correctFirstTry === "number" &&
    typeof candidate.masteryScore === "number" &&
    typeof candidate.nextReviewAt === "string" &&
    typeof candidate.lastAttemptAt === "string"
  );
}
