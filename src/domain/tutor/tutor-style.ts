import type { TutorFeedbackTone } from "./tutor-types";

export type TutorStyleId = "calm" | "serious" | "playful";

export type TutorStyle = {
  id: TutorStyleId;
  label: string;
};

export const defaultTutorStyleId: TutorStyleId = "calm";

export const tutorStyles: TutorStyle[] = [
  {
    id: "calm",
    label: "Calm Coach",
  },
  {
    id: "serious",
    label: "Serious Trainer",
  },
  {
    id: "playful",
    label: "Playful Companion",
  },
];

export function getTutorStyle(styleId: TutorStyleId): TutorStyle {
  return (
    tutorStyles.find((style) => style.id === styleId) ??
    tutorStyles[0]
  );
}

export function isTutorStyleId(value: unknown): value is TutorStyleId {
  return value === "calm" || value === "serious" || value === "playful";
}

export function formatTutorStyleMessage(
  styleId: TutorStyleId,
  message: string,
  tone: TutorFeedbackTone,
) {
  if (styleId === "calm") {
    return message;
  }

  const strippedMessage = stripLeadingTone(message);

  if (styleId === "serious") {
    if (tone === "success") {
      return `Correct. ${strippedMessage}`;
    }

    if (tone === "warning") {
      return `Incorrect. ${strippedMessage}`;
    }

    return `Focus. ${strippedMessage}`;
  }

  if (tone === "success") {
    return `Nice. ${strippedMessage}`;
  }

  if (tone === "warning") {
    return `Almost. ${strippedMessage}`;
  }

  return `Let's try it. ${strippedMessage}`;
}

function stripLeadingTone(message: string) {
  return message
    .replace(/^(Good|Correct|Nice|Almost|Incorrect|Focus)\.?\s*:?\s*/i, "")
    .trim();
}
