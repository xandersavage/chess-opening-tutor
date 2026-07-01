import {
  defaultTutorStyleId,
  isTutorStyleId,
  type TutorStyleId,
} from "./tutor-style";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

const tutorStyleStorageKey = "chess-opening-tutor.tutor-style.v1";

export function loadTutorStyleId(
  storage: StorageLike | null = getBrowserStorage(),
): TutorStyleId {
  if (!storage) {
    return defaultTutorStyleId;
  }

  const storedValue = storage.getItem(tutorStyleStorageKey);

  return isTutorStyleId(storedValue) ? storedValue : defaultTutorStyleId;
}

export function saveTutorStyleId(
  styleId: TutorStyleId,
  storage: StorageLike | null = getBrowserStorage(),
) {
  storage?.setItem(tutorStyleStorageKey, styleId);
}

function getBrowserStorage(): StorageLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}
