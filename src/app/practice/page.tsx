const boardSquares = Array.from({ length: 64 }, (_, index) => {
  const rank = Math.floor(index / 8);
  const file = index % 8;
  return {
    id: `${rank}-${file}`,
    tone: (rank + file) % 2 === 0 ? "light" : "dark",
  };
});

export default function PracticePage() {
  return (
    <main className="page">
      <section className="practice-layout" aria-label="Practice workspace">
        <div className="practice-panel">
          <div className="practice-toolbar">
            <h1>Practice</h1>
            <span className="practice-meta">Module 1 scaffold</span>
          </div>
          <div className="board-placeholder" role="img" aria-label="Chessboard placeholder">
            {boardSquares.map((square) => (
              <span
                aria-hidden="true"
                className={`board-square ${square.tone}`}
                key={square.id}
              />
            ))}
          </div>
        </div>

        <aside className="tutor-panel" aria-labelledby="tutor-title">
          <h2 id="tutor-title">Tutor</h2>
          <p>
            The next module replaces this placeholder with a legal-move board
            powered by chess.js.
          </p>
          <ul className="status-list">
            <li>
              <strong>Opening</strong>
              <span>Not selected</span>
            </li>
            <li>
              <strong>Mode</strong>
              <span>Guided lesson</span>
            </li>
            <li>
              <strong>Progress</strong>
              <span>Local</span>
            </li>
          </ul>
        </aside>
      </section>
    </main>
  );
}

