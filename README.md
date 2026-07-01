# chess-opening-tutor

Interactive opening tutor for learning the London System as White and the Caro-Kann as Black.

This repository contains a local-first Next.js app plus planning docs. Implementation proceeds module by module using feature branches and pull requests.

## What The App Does

- Lets a beginner practice opening moves on a real chessboard.
- Teaches the London System for White and the Caro-Kann for Black.
- Provides guided, drill, assisted, and review practice modes.
- Tracks progress locally in the browser, with no account or backend.
- Resurfaces missed positions in a review queue.
- Supports selectable tutor styles.

## Development

Requirements:

- Node.js 20.9 or newer
- npm

Install dependencies.

```bash
npm install
```

Run the app.

```bash
npm run dev
```

Open the app at `http://localhost:3000`, then use the Practice page.

Run the full local verification suite.

```bash
npm run verify
```

Run checks individually.

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Release Verification

Use [docs/RELEASE.md](docs/RELEASE.md) before merging release-oriented changes. It covers the automated checks, manual smoke test, accessibility pass, and optional free hosting path.

## Docs

- [Product context](PRODUCT.md)
- [Product requirements](docs/PRD.md)
- [Roadmap](docs/ROADMAP.md)
- [Release checklist](docs/RELEASE.md)
