import Link from "next/link";
import { openingModules } from "@/domain/project-info";

export default function HomePage() {
  return (
    <main className="page">
      <section className="page-heading" aria-labelledby="home-title">
        <h1 id="home-title">Practice openings by making the move.</h1>
        <p>
          A local-first tutor for learning the London System as White and the
          Caro-Kann as Black, built around recall on a real board.
        </p>
        <div className="actions">
          <Link className="button primary" href="/practice">
            Start practice
          </Link>
        </div>
      </section>

      <section className="module-grid" aria-label="Opening modules">
        {openingModules.map((module) => (
          <article className="module-panel" key={module.id}>
            <h2>{module.title}</h2>
            <p>{module.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
