import type { CurriculumNode } from "@/domain/curriculum/curriculum-types";
import type {
  TutorHint,
  TutorMoveEvaluation,
} from "@/domain/tutor/tutor-types";

export type PracticeModeId = "guided" | "drill" | "assisted" | "review";

export type PracticeMode = {
  id: PracticeModeId;
  label: string;
  autoPlayOpponentReplies: boolean;
  tutorVerbosity: "full" | "concise" | "assisted" | "review";
};

export type TutorMessageContext = {
  evaluation: TutorMoveEvaluation;
  lessonComplete: boolean;
  nextNodeLoaded: boolean;
  opponentReplySan?: string;
};

export const practiceModes: PracticeMode[] = [
  {
    autoPlayOpponentReplies: true,
    id: "guided",
    label: "Guided",
    tutorVerbosity: "full",
  },
  {
    autoPlayOpponentReplies: true,
    id: "drill",
    label: "Drill",
    tutorVerbosity: "concise",
  },
  {
    autoPlayOpponentReplies: true,
    id: "assisted",
    label: "Assisted",
    tutorVerbosity: "assisted",
  },
  {
    autoPlayOpponentReplies: true,
    id: "review",
    label: "Review",
    tutorVerbosity: "review",
  },
];

export function getPracticeMode(modeId: PracticeModeId): PracticeMode {
  return (
    practiceModes.find((mode) => mode.id === modeId) ?? practiceModes[0]
  );
}

export function selectOpponentReplyForMode(
  modeId: PracticeModeId,
  evaluation: TutorMoveEvaluation,
) {
  return getPracticeMode(modeId).autoPlayOpponentReplies
    ? evaluation.opponentReply
    : undefined;
}

export function getPositionPrompt(
  modeId: PracticeModeId,
  node: CurriculumNode,
) {
  if (modeId === "drill") {
    return "Find the target move.";
  }

  if (modeId === "review") {
    return "Solve this review position.";
  }

  return node.prompt;
}

export function formatHintMessage(
  modeId: PracticeModeId,
  hint: TutorHint,
) {
  const hintNumber = hint.index + 1;

  if (modeId === "drill") {
    return `Cue ${hintNumber}: ${hint.message}`;
  }

  if (modeId === "review") {
    return `Review hint ${hintNumber}: ${hint.message}`;
  }

  if (modeId === "assisted") {
    return `Assisted hint ${hintNumber}: ${hint.message}`;
  }

  return `Hint ${hintNumber}: ${hint.message}`;
}

export function formatTutorMoveMessage(
  modeId: PracticeModeId,
  context: TutorMessageContext,
) {
  const mode = getPracticeMode(modeId);

  if (mode.tutorVerbosity === "concise") {
    return formatConciseMessage(context);
  }

  if (mode.tutorVerbosity === "assisted") {
    return formatAssistedMessage(context);
  }

  if (mode.tutorVerbosity === "review") {
    return formatReviewMessage(context);
  }

  return `${context.evaluation.message}${formatContinuation(context, "I replied")}`;
}

export function getModeChangeMessage(modeId: PracticeModeId, dueCount: number) {
  if (modeId === "review") {
    return dueCount > 0
      ? "Review mode selected. Choose a due position below."
      : "Review mode selected. No positions are due right now.";
  }

  return `${getPracticeMode(modeId).label} mode selected.`;
}

function formatConciseMessage(context: TutorMessageContext) {
  if (context.evaluation.feedbackKind === "correct") {
    return `Correct: ${context.evaluation.moveSan}.${formatContinuation(
      context,
      "Reply",
    )}`;
  }

  if (context.evaluation.feedbackKind === "acceptable") {
    return `${context.evaluation.moveSan} is playable, but not the target move.`;
  }

  const target = context.evaluation.expectedMoveSan
    ? ` Try ${context.evaluation.expectedMoveSan}.`
    : "";

  return `Not this line.${target}`;
}

function formatAssistedMessage(context: TutorMessageContext) {
  if (context.evaluation.feedbackKind === "correct") {
    return `${context.evaluation.message}${formatContinuation(
      context,
      "I chose",
    )}`;
  }

  return context.evaluation.message;
}

function formatReviewMessage(context: TutorMessageContext) {
  if (context.evaluation.feedbackKind === "correct") {
    return `Review correct: ${context.evaluation.moveSan}.${formatContinuation(
      context,
      "Reply",
    )}`;
  }

  if (context.evaluation.feedbackKind === "acceptable") {
    return `${context.evaluation.moveSan} is playable, but this review wants the target move.`;
  }

  const target = context.evaluation.expectedMoveSan
    ? ` Target: ${context.evaluation.expectedMoveSan}.`
    : "";

  return `Review miss recorded.${target}`;
}

function formatContinuation(
  context: TutorMessageContext,
  replyPrefix: string,
) {
  const parts: string[] = [];

  if (context.opponentReplySan) {
    parts.push(`${replyPrefix} ${context.opponentReplySan}.`);
  }

  if (context.nextNodeLoaded) {
    parts.push("Next position loaded.");
  }

  if (context.lessonComplete) {
    parts.push("Lesson line complete.");
  }

  return parts.length > 0 ? ` ${parts.join(" ")}` : "";
}
