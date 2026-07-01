# Release Checklist

This checklist is for validating the local-first V1 chess opening tutor before a merge or deployment.

## Automated Verification

Run the complete suite:

```bash
npm run verify
```

Equivalent individual commands:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Expected result:

- TypeScript succeeds with no errors.
- ESLint succeeds with no errors.
- Vitest succeeds, including the release smoke flow.
- Next.js production build succeeds.

## Local Run

Start the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/practice
```

If port `3000` is busy, run:

```bash
npm run dev -- --port 3100
```

## Manual Smoke Test

London System:

- Select `London System`.
- Select `Guided`.
- Play `d2` to `d4`.
- Confirm the tutor marks the move correct and replies `d5`.
- Reset and play `e2` to `e4`.
- Confirm the tutor explains the repertoire mistake and the position appears in review.

Caro-Kann:

- Select `Caro-Kann`.
- Confirm the board is oriented from Black's side.
- Select `Assisted`.
- Play `c7` to `c6`.
- Confirm the tutor marks the move correct and replies `d4`.
- Reset and play `c7` to `c5`.
- Confirm the tutor catches the Sicilian mistake.

Tutor controls:

- Use `Hint` repeatedly and confirm hints progress from concept to explicit move.
- Use `Reveal` and confirm it shows the target move plus explanation.
- Use `Retry` and confirm the current opening resets cleanly.
- Switch tutor styles and refresh; confirm the selected style persists locally.
- Switch practice modes and confirm the board state does not reset.

Progress and review:

- Make at least one mistake.
- Confirm the missed position appears in the review queue.
- Click `Review` and confirm the board loads that position.
- Refresh the browser and confirm progress remains.
- Use `Clear progress` and confirm the queue resets.

Keyboard and accessibility:

- Use the keyboard move form to enter a legal move.
- Tab through opening, mode, tutor style, hint, retry, reveal, review, and move controls.
- Confirm focus is visible on each control.
- Confirm color is not the only signal: tutor text and labels also identify success or warning states.
- Test at mobile width and confirm the board remains playable.
- Enable reduced motion at the OS/browser level and confirm board animation is minimized.

## Optional Free Hosting

V1 does not require hosting, accounts, a backend, or paid services. If you want a public demo later:

1. Push `main` to GitHub.
2. Import the repository into Vercel.
3. Use the default Next.js settings:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output: managed by Next.js
4. Do not add databases, auth, AI API keys, or paid services for V1.
5. After deployment, rerun the manual smoke test on the hosted URL.

## V1 Release Criteria

- London System practice works as White.
- Caro-Kann practice works as Black.
- Legal and illegal moves behave correctly.
- Tutor feedback covers correct moves, known mistakes, unknown legal moves, hints, reveal, and retries.
- Missed positions return in review.
- Local progress and tutor style survive refresh.
- The interface remains usable on desktop and mobile.
- The project remains free and local-first.
