"use client";

import { useMemo, useState } from "react";
import { Chessboard, type ChessboardOptions } from "react-chessboard";
import {
  createGameSnapshot,
  getLegalTargets,
  tryMove,
  type BoardOrientation,
  type GameSnapshot,
} from "@/domain/chess/chess-service";

type OpeningChoice = {
  id: "london" | "caro-kann";
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

const initialSnapshot = createGameSnapshot();

export function PracticeBoard() {
  const [snapshot, setSnapshot] = useState<GameSnapshot>(initialSnapshot);
  const [openingId, setOpeningId] = useState<OpeningChoice["id"]>("london");
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [fromSquare, setFromSquare] = useState("");
  const [toSquare, setToSquare] = useState("");
  const [promotion, setPromotion] = useState("q");
  const [message, setMessage] = useState(
    "Board ready. Play a legal move or use the square inputs.",
  );

  const opening = openingChoices.find((choice) => choice.id === openingId) ??
    openingChoices[0];

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

  function applyMove(from: string, to: string, promotionPiece = "q") {
    const result = tryMove(snapshot.fen, {
      from,
      to,
      promotion: promotionPiece,
    });

    if (!result.ok) {
      setMessage(result.message);
      return false;
    }

    setSnapshot(result.snapshot);
    setMessage(`${result.move.san} played. ${result.snapshot.turnLabel} to move.`);
    setSelectedSquare(null);
    setFromSquare("");
    setToSquare("");
    return true;
  }

  function resetBoard() {
    setSnapshot(createGameSnapshot());
    setSelectedSquare(null);
    setFromSquare("");
    setToSquare("");
    setMessage("Board reset to the starting position.");
  }

  function handleSquareClick(square: string) {
    if (!selectedSquare) {
      if (getLegalTargets(snapshot.fen, square).length === 0) {
        setMessage(`No legal moves from ${square}.`);
        return;
      }

      setSelectedSquare(square);
      setFromSquare(square);
      setMessage(`Selected ${square}. Choose a target square.`);
      return;
    }

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setMessage(`Cleared ${square}.`);
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
    animationDurationInMs: 140,
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
              {opening.label}, {opening.description}
            </p>
          </div>

          <div className="toolbar-actions">
            <label className="field-label" htmlFor="opening-choice">
              Opening
            </label>
            <select
              className="select-control"
              id="opening-choice"
              onChange={(event) =>
                setOpeningId(event.target.value as OpeningChoice["id"])}
              value={openingId}
            >
              {openingChoices.map((choice) => (
                <option key={choice.id} value={choice.id}>
                  {choice.label}
                </option>
              ))}
            </select>
            <button className="button" onClick={resetBoard} type="button">
              Reset board
            </button>
          </div>
        </div>

        <div className="board-frame">
          <Chessboard options={boardOptions} />
        </div>
      </div>

      <aside className="tutor-panel" aria-labelledby="board-status-title">
        <h2 id="board-status-title">Board status</h2>
        <p aria-live="polite">{message}</p>

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
        </dl>

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
