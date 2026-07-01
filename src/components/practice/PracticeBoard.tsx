"use client";

import { useEffect, useMemo, useState } from "react";
import { Chessboard, type ChessboardOptions } from "react-chessboard";
import { starterCurriculum } from "@/data/openings/curriculum";
import {
  createMoveInputFromUci,
  createGameSnapshot,
  getLegalTargets,
  tryMove,
  type BoardOrientation,
  type GameSnapshot,
} from "@/domain/chess/chess-service";
import {
  findNodeInOpening,
  findNodeLocation,
  getStartingNode,
} from "@/domain/curriculum/curriculum-selectors";
import type { OpeningId } from "@/domain/curriculum/curriculum-types";
import {
  formatHintMessage,
  formatTutorMoveMessage,
  getModeChangeMessage,
  getPositionPrompt,
  getPracticeMode,
  practiceModes,
  selectOpponentReplyForMode,
  type PracticeModeId,
} from "@/domain/practice/practice-modes";
import {
  applyProgressAttempt,
  createEmptyProgressState,
  getProgressSummary,
  getReviewQueue,
} from "@/domain/progress/progress-scheduler";
import {
  clearStoredProgress,
  loadProgressState,
  saveProgressState,
} from "@/domain/progress/progress-storage";
import type { ProgressRecord } from "@/domain/progress/progress-types";
import {
  evaluateTutorMove,
  getTutorHint,
} from "@/domain/tutor/tutor-engine";
import {
  defaultTutorStyleId,
  formatTutorStyleMessage,
  getTutorStyle,
  tutorStyles,
  type TutorStyleId,
} from "@/domain/tutor/tutor-style";
import {
  loadTutorStyleId,
  saveTutorStyleId,
} from "@/domain/tutor/tutor-style-storage";
import type {
  TutorFeedbackTone,
  TutorMoveEvaluation,
} from "@/domain/tutor/tutor-types";

type OpeningChoice = {
  id: OpeningId;
  label: string;
  orientation: BoardOrientation;
  description: string;
};

const openingChoices: OpeningChoice[] = [
  {
    id: "london",
    label: "London System",
    orientation: "white",
    description: "Train from White's side.",
  },
  {
    id: "caro-kann",
    label: "Caro-Kann",
    orientation: "black",
    description: "Train from Black's side.",
  },
];

const initialOpeningId: OpeningId = "london";
const initialLessonNode = getStartingNode(starterCurriculum, initialOpeningId);
const initialSnapshot = createGameSnapshot(initialLessonNode.fen);

function getOpeningLabel(openingId: OpeningId) {
  return (
    openingChoices.find((choice) => choice.id === openingId)?.label ?? openingId
  );
}

export function PracticeBoard() {
  const [snapshot, setSnapshot] = useState<GameSnapshot>(initialSnapshot);
  const [openingId, setOpeningId] = useState<OpeningId>(initialOpeningId);
  const [currentNodeId, setCurrentNodeId] = useState(initialLessonNode.id);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [fromSquare, setFromSquare] = useState("");
  const [toSquare, setToSquare] = useState("");
  const [promotion, setPromotion] = useState("q");
  const [hintCount, setHintCount] = useState(0);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [feedbackTone, setFeedbackTone] = useState<TutorFeedbackTone>("info");
  const [message, setMessage] = useState(initialLessonNode.prompt);
  const [practiceModeId, setPracticeModeId] =
    useState<PracticeModeId>("guided");
  const [tutorStyleId, setTutorStyleId] =
    useState<TutorStyleId>(defaultTutorStyleId);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [progressState, setProgressState] = useState(createEmptyProgressState);
  const [reviewClockIso, setReviewClockIso] = useState(() =>
    new Date().toISOString(),
  );

  const opening = openingChoices.find((choice) => choice.id === openingId) ??
    openingChoices[0];
  const currentNode =
    findNodeInOpening(starterCurriculum, openingId, currentNodeId) ??
    getStartingNode(starterCurriculum, openingId);
  const activeMode = getPracticeMode(practiceModeId);
  const currentPositionPrompt = getPositionPrompt(practiceModeId, currentNode);
  const tutorStyle = getTutorStyle(tutorStyleId);
  const currentProgress = progressState.records[currentNode.id];
  const reviewQueue = useMemo(
    () => getReviewQueue(progressState, reviewClockIso, 4),
    [progressState, reviewClockIso],
  );
  const progressSummary = useMemo(
    () => getProgressSummary(progressState, reviewClockIso),
    [progressState, reviewClockIso],
  );
  const reviewItems = useMemo(
    () =>
      reviewQueue.map((record) => ({
        location: findNodeLocation(starterCurriculum, record.nodeId),
        openingLabel: getOpeningLabel(record.openingId),
        record,
      })),
    [reviewQueue],
  );

  const legalTargets = useMemo(
    () => (selectedSquare ? getLegalTargets(snapshot.fen, selectedSquare) : []),
    [selectedSquare, snapshot.fen],
  );

  const squareStyles = useMemo<NonNullable<ChessboardOptions["squareStyles"]>>(
    () => {
      const styles: NonNullable<ChessboardOptions["squareStyles"]> = {};

      if (selectedSquare) {
        styles[selectedSquare] = {
          boxShadow: "inset 0 0 0 3px var(--focus)",
        };
      }

      for (const square of legalTargets) {
        styles[square] = {
          boxShadow: "inset 0 0 0 3px var(--accent)",
        };
      }

      return styles;
    },
    [legalTargets, selectedSquare],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setProgressState(loadProgressState());
      setTutorStyleId(loadTutorStyleId());
      setReviewClockIso(new Date().toISOString());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    const timeoutId = window.setTimeout(syncReducedMotion, 0);

    mediaQuery.addEventListener("change", syncReducedMotion);

    return () => {
      window.clearTimeout(timeoutId);
      mediaQuery.removeEventListener("change", syncReducedMotion);
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setReviewClockIso(new Date().toISOString());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  function recordProgressAttempt(
    evaluation: TutorMoveEvaluation,
    usedHintCount: number,
  ) {
    const attemptedAt = new Date().toISOString();

    setReviewClockIso(attemptedAt);
    setProgressState((currentState) => {
      const nextState = applyProgressAttempt(currentState, {
        attemptedAt,
        hintCount: usedHintCount,
        nodeId: currentNode.id,
        openingId,
        progressDelta: evaluation.progressDelta,
      });

      saveProgressState(nextState);

      return nextState;
    });
  }

  function applyMove(from: string, to: string, promotionPiece = "q") {
    if (lessonComplete) {
      setFeedbackTone("info");
      setMessage(
        formatTutorStyleMessage(
          tutorStyleId,
          "This lesson line is complete. Reset the lesson to practice it again.",
          "info",
        ),
      );
      return false;
    }

    const result = tryMove(snapshot, {
      from,
      to,
      promotion: promotionPiece,
    });

    if (!result.ok) {
      setFeedbackTone("warning");
      setMessage(formatTutorStyleMessage(tutorStyleId, result.message, "warning"));
      return false;
    }

    const usedHintCount = hintCount;
    const evaluation = evaluateTutorMove({
      hintCount: usedHintCount,
      move: result.move,
      node: currentNode,
    });

    recordProgressAttempt(evaluation, usedHintCount);
    setSelectedSquare(null);
    setFromSquare("");
    setToSquare("");
    setHintCount(0);
    setFeedbackTone(evaluation.tone);

    if (!evaluation.advance) {
      setSnapshot(createGameSnapshot(currentNode.fen));
      setMessage(
        formatTutorStyleMessage(
          tutorStyleId,
          formatTutorMoveMessage(practiceModeId, {
            evaluation,
            lessonComplete: false,
            nextNodeLoaded: false,
          }),
          evaluation.tone,
        ),
      );
      return false;
    }

    let nextSnapshot = result.snapshot;
    let opponentReplySan: string | undefined;
    const opponentReply = selectOpponentReplyForMode(practiceModeId, evaluation);

    if (opponentReply) {
      const replyResult = tryMove(
        nextSnapshot,
        createMoveInputFromUci(opponentReply.uci),
      );

      if (replyResult.ok) {
        nextSnapshot = replyResult.snapshot;
        opponentReplySan = opponentReply.san;
      }
    }

    setSnapshot(nextSnapshot);

    if (evaluation.nextNodeId) {
      setCurrentNodeId(evaluation.nextNodeId);
    }

    if (evaluation.lessonComplete) {
      setLessonComplete(true);
    }

    setMessage(
      formatTutorStyleMessage(
        tutorStyleId,
        formatTutorMoveMessage(practiceModeId, {
          evaluation,
          lessonComplete: evaluation.lessonComplete,
          nextNodeLoaded: Boolean(evaluation.nextNodeId),
          opponentReplySan,
        }),
        evaluation.tone,
      ),
    );
    return true;
  }

  function loadReviewPosition(record: ProgressRecord) {
    const location = findNodeLocation(starterCurriculum, record.nodeId);

    if (!location) {
      setFeedbackTone("warning");
      setMessage(
        formatTutorStyleMessage(
          tutorStyleId,
          "That review position is no longer in the curriculum.",
          "warning",
        ),
      );
      return;
    }

    setOpeningId(location.openingId);
    setPracticeModeId("review");
    setSnapshot(createGameSnapshot(location.node.fen));
    setCurrentNodeId(location.node.id);
    setSelectedSquare(null);
    setFromSquare("");
    setToSquare("");
    setHintCount(0);
    setLessonComplete(false);
    setFeedbackTone("info");
    setMessage(
      formatTutorStyleMessage(
        tutorStyleId,
        `Review loaded. ${location.node.prompt}`,
        "info",
      ),
    );
  }

  function clearProgress() {
    clearStoredProgress();
    setProgressState(createEmptyProgressState());
    setReviewClockIso(new Date().toISOString());
    setFeedbackTone("info");
    setMessage(
      formatTutorStyleMessage(
        tutorStyleId,
        "Local progress cleared. Your next move starts a fresh record.",
        "info",
      ),
    );
  }

  function resetLesson(nextOpeningId = openingId) {
    const startingNode = getStartingNode(starterCurriculum, nextOpeningId);

    setSnapshot(createGameSnapshot(startingNode.fen));
    setCurrentNodeId(startingNode.id);
    setSelectedSquare(null);
    setFromSquare("");
    setToSquare("");
    setHintCount(0);
    setLessonComplete(false);
    setFeedbackTone("info");
    setMessage(formatTutorStyleMessage(tutorStyleId, startingNode.prompt, "info"));
  }

  function handleOpeningChange(nextOpeningId: OpeningId) {
    setOpeningId(nextOpeningId);
    resetLesson(nextOpeningId);
  }

  function handleModeChange(nextModeId: PracticeModeId) {
    setPracticeModeId(nextModeId);
    setSelectedSquare(null);
    setFeedbackTone("info");
    setMessage(
      formatTutorStyleMessage(
        tutorStyleId,
        getModeChangeMessage(nextModeId, progressSummary.dueCount),
        "info",
      ),
    );
  }

  function handleTutorStyleChange(nextStyleId: TutorStyleId) {
    setTutorStyleId(nextStyleId);
    saveTutorStyleId(nextStyleId);
    setFeedbackTone("info");
    setMessage(
      formatTutorStyleMessage(
        nextStyleId,
        `${getTutorStyle(nextStyleId).label} selected.`,
        "info",
      ),
    );
  }

  function showHint() {
    if (lessonComplete) {
      setFeedbackTone("info");
      setMessage(
        formatTutorStyleMessage(
          tutorStyleId,
          "This lesson line is complete. Reset the lesson to practice it again.",
          "info",
        ),
      );
      return;
    }

    const hint = getTutorHint(currentNode, hintCount);

    setHintCount(hint.nextHintCount);
    setFeedbackTone("info");
    setMessage(
      formatTutorStyleMessage(
        tutorStyleId,
        formatHintMessage(practiceModeId, hint),
        "info",
      ),
    );
  }

  function revealMove() {
    if (lessonComplete) {
      setFeedbackTone("info");
      setMessage(
        formatTutorStyleMessage(
          tutorStyleId,
          "This lesson line is complete. Reset the lesson to practice it again.",
          "info",
        ),
      );
      return;
    }

    const expectedMove = currentNode.expectedMoves[0];

    setFeedbackTone("info");
    setMessage(
      formatTutorStyleMessage(
        tutorStyleId,
        expectedMove
          ? `Target move: ${expectedMove.san}. ${currentNode.explanation}`
          : "No target move is set for this position.",
        "info",
      ),
    );
  }

  function handleSquareClick(square: string) {
    if (!selectedSquare) {
      if (getLegalTargets(snapshot.fen, square).length === 0) {
        setFeedbackTone("warning");
        setMessage(
          formatTutorStyleMessage(
            tutorStyleId,
            `No legal moves from ${square}.`,
            "warning",
          ),
        );
        return;
      }

      setSelectedSquare(square);
      setFromSquare(square);
      setFeedbackTone("info");
      setMessage(
        formatTutorStyleMessage(
          tutorStyleId,
          `Selected ${square}. Choose a target square.`,
          "info",
        ),
      );
      return;
    }

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setFeedbackTone("info");
      setMessage(
        formatTutorStyleMessage(tutorStyleId, `Cleared ${square}.`, "info"),
      );
      return;
    }

    const accepted = applyMove(selectedSquare, square);

    if (!accepted) {
      if (getLegalTargets(snapshot.fen, square).length > 0) {
        setSelectedSquare(square);
        setFromSquare(square);
      }
    }
  }

  const boardOptions: ChessboardOptions = {
    id: "practice-board",
    position: snapshot.fen,
    boardOrientation: opening.orientation,
    showNotation: true,
    animationDurationInMs: prefersReducedMotion ? 0 : 140,
    squareStyles,
    lightSquareStyle: { backgroundColor: "oklch(0.87 0.035 95)" },
    darkSquareStyle: { backgroundColor: "oklch(0.48 0.075 150)" },
    boardStyle: {
      borderRadius: "var(--radius)",
      overflow: "hidden",
      border: "1px solid var(--line)",
    },
    onPieceDrop: ({ sourceSquare, targetSquare }) => {
      if (!targetSquare) {
        setFeedbackTone("info");
        setMessage("Move cancelled.");
        return false;
      }

      return applyMove(sourceSquare, targetSquare);
    },
    onSquareClick: ({ square }) => handleSquareClick(square),
  };

  return (
    <section className="practice-layout" aria-label="Practice workspace">
      <div className="practice-panel">
        <div className="practice-toolbar">
          <div>
            <h1>Practice</h1>
            <p className="practice-meta">
              {opening.label} / {activeMode.label}, {opening.description}
            </p>
          </div>

          <div className="toolbar-actions">
            <div className="mode-tabs" aria-label="Practice mode">
              {practiceModes.map((mode) => (
                <button
                  aria-pressed={practiceModeId === mode.id}
                  className={
                    practiceModeId === mode.id
                      ? "mode-tab active"
                      : "mode-tab"
                  }
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  type="button"
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <label className="field-label" htmlFor="opening-choice">
              Opening
            </label>
            <select
              className="select-control"
              id="opening-choice"
              onChange={(event) =>
                handleOpeningChange(event.target.value as OpeningId)}
              value={openingId}
            >
              {openingChoices.map((choice) => (
                <option key={choice.id} value={choice.id}>
                  {choice.label}
                </option>
              ))}
            </select>
            <label className="field-label" htmlFor="tutor-style-choice">
              Tutor
            </label>
            <select
              className="select-control"
              id="tutor-style-choice"
              onChange={(event) =>
                handleTutorStyleChange(event.target.value as TutorStyleId)}
              value={tutorStyleId}
            >
              {tutorStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.label}
                </option>
              ))}
            </select>
            <button className="button" onClick={() => resetLesson()} type="button">
              Reset lesson
            </button>
          </div>
        </div>

        <div className="board-frame" aria-label="Chessboard" role="group">
          <Chessboard options={boardOptions} />
        </div>

        <div className="progress-strip" aria-label="Progress summary">
          <div>
            <strong>{progressSummary.attempts}</strong>
            <span>Attempts</span>
          </div>
          <div>
            <strong>{progressSummary.correct}</strong>
            <span>Correct</span>
          </div>
          <div>
            <strong>{progressSummary.dueCount}</strong>
            <span>Due</span>
          </div>
          <div>
            <strong>
              {currentProgress ? `${currentProgress.masteryScore}/10` : "-"}
            </strong>
            <span>Mastery</span>
          </div>
        </div>
      </div>

      <aside className="tutor-panel" aria-labelledby="board-status-title">
        <h2 id="board-status-title">Tutor</h2>
        <p className={`tutor-feedback ${feedbackTone}`} aria-live="polite">
          {message}
        </p>

        <section className="lesson-card" aria-labelledby="lesson-prompt-title">
          <h3 id="lesson-prompt-title">Current position</h3>
          <p>{currentPositionPrompt}</p>
          <div className="tutor-actions">
            <button className="button" onClick={showHint} type="button">
              Hint
            </button>
            <button className="button" onClick={() => resetLesson()} type="button">
              Retry
            </button>
            <button className="button" onClick={revealMove} type="button">
              Reveal
            </button>
          </div>
        </section>

        <dl className="status-grid">
          <div>
            <dt>Turn</dt>
            <dd>{snapshot.turnLabel}</dd>
          </div>
          <div>
            <dt>Orientation</dt>
            <dd>{opening.orientation === "white" ? "White" : "Black"}</dd>
          </div>
          <div>
            <dt>Move</dt>
            <dd>{snapshot.fullMoveNumber}</dd>
          </div>
          <div>
            <dt>State</dt>
            <dd>{snapshot.statusLabel}</dd>
          </div>
          <div>
            <dt>Lesson</dt>
            <dd>{lessonComplete ? "Complete" : "Active"}</dd>
          </div>
          <div>
            <dt>Hints</dt>
            <dd>{hintCount}</dd>
          </div>
          <div>
            <dt>Mode</dt>
            <dd>{activeMode.label}</dd>
          </div>
          <div>
            <dt>Mastery</dt>
            <dd>
              {currentProgress ? `${currentProgress.masteryScore}/10` : "New"}
            </dd>
          </div>
          <div>
            <dt>Due review</dt>
            <dd>{progressSummary.dueCount}</dd>
          </div>
          <div>
            <dt>Tutor</dt>
            <dd>{tutorStyle.label}</dd>
          </div>
        </dl>

        <section className="review-panel" aria-labelledby="review-queue-title">
          <div className="review-heading">
            <h3 id="review-queue-title">Review queue</h3>
            <div className="review-heading-actions">
              {practiceModeId === "review" && reviewQueue[0] ? (
                <button
                  className="button"
                  onClick={() => loadReviewPosition(reviewQueue[0])}
                  type="button"
                >
                  Start review
                </button>
              ) : null}
              <button
                className="button subtle"
                onClick={clearProgress}
                type="button"
              >
                Clear progress
              </button>
            </div>
          </div>

          {reviewQueue.length === 0 ? (
            <p>No positions due right now.</p>
          ) : (
            <ol className="review-list">
              {reviewItems.map(({ location, openingLabel, record }) => (
                <li className="review-item" key={record.nodeId}>
                  <div>
                    <strong>{openingLabel}</strong>
                    <span>{location?.node.prompt ?? "Position needs attention."}</span>
                    <span>
                      Mastery {record.masteryScore}/10, misses {record.misses}
                    </span>
                  </div>
                  <button
                    className="button"
                    onClick={() => loadReviewPosition(record)}
                    type="button"
                  >
                    Review
                  </button>
                </li>
              ))}
            </ol>
          )}

          <p className="progress-summary">
            {progressSummary.attempts} attempts / {progressSummary.correct} correct /
            {" "}
            {progressSummary.misses} misses / {progressSummary.hintUses} hinted
          </p>
        </section>

        <form
          className="move-form"
          onSubmit={(event) => {
            event.preventDefault();
            applyMove(fromSquare, toSquare, promotion);
          }}
        >
          <h3>Keyboard move</h3>
          <div className="move-fields">
            <label>
              From
              <input
                autoComplete="off"
                inputMode="text"
                maxLength={2}
                onChange={(event) =>
                  setFromSquare(event.target.value.toLowerCase())}
                placeholder="e2"
                value={fromSquare}
              />
            </label>
            <label>
              To
              <input
                autoComplete="off"
                inputMode="text"
                maxLength={2}
                onChange={(event) => setToSquare(event.target.value.toLowerCase())}
                placeholder="e4"
                value={toSquare}
              />
            </label>
            <label>
              Promote
              <select
                onChange={(event) => setPromotion(event.target.value)}
                value={promotion}
              >
                <option value="q">Queen</option>
                <option value="r">Rook</option>
                <option value="b">Bishop</option>
                <option value="n">Knight</option>
              </select>
            </label>
          </div>
          <button className="button primary" type="submit">
            Play move
          </button>
        </form>

        <section className="move-history" aria-labelledby="move-history-title">
          <h3 id="move-history-title">Move history</h3>
          {snapshot.history.length === 0 ? (
            <p>No moves yet.</p>
          ) : (
            <ol>
              {snapshot.history.map((move, index) => (
                <li key={`${move}-${index}`}>{move}</li>
              ))}
            </ol>
          )}
        </section>
      </aside>
    </section>
  );
}
