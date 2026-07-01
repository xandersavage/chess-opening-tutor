import type { OpeningModule } from "@/domain/curriculum/curriculum-types";

export const caroKannModule: OpeningModule = {
  id: "caro-kann",
  title: "Caro-Kann",
  trainingSide: "black",
  description:
    "A solid Black repertoire against 1.e4 built around ...c6, ...d5, active development, and timely central breaks.",
  variations: [
    {
      id: "caro-kann-core",
      title: "Core Caro-Kann Start",
      beginnerSummary:
        "Meet e4 with c6 so Black can support a strong ...d5 center.",
      startingNodeId: "caro-core-001",
      conceptTags: ["solid-center", "support-d5"],
    },
  ],
  nodes: [
    {
      id: "caro-core-001",
      variationId: "caro-kann-core",
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
      sideToMove: "b",
      userSide: "b",
      prompt: "Start the Caro-Kann response to 1.e4.",
      expectedMoves: [
        {
          san: "c6",
          uci: "c7c6",
          message:
            "Good. ...c6 prepares ...d5 while keeping Black's position solid.",
          nextNodeId: "caro-core-002",
        },
      ],
      acceptableMoves: [
        {
          san: "e6",
          uci: "e7e6",
          message:
            "Playable, but that is a French Defense structure rather than the Caro-Kann.",
        },
      ],
      mistakes: [
        {
          san: "c5",
          uci: "c7c5",
          tag: "becomes-sicilian",
          message:
            "...c5 is legal, but it becomes a Sicilian rather than a Caro-Kann.",
          recoveryHint: "Use ...c6 when you want the Caro-Kann.",
        },
      ],
      hints: [
        "The Caro-Kann starts with the c-pawn.",
        "Support a future ...d5 before playing it.",
        "Play ...c6.",
      ],
      explanation:
        "...c6 prepares ...d5, giving Black a sturdy way to challenge White's e4 pawn.",
      conceptTags: ["support-d5", "caro-kann-start"],
      next: [
        {
          move: {
            san: "c6",
            uci: "c7c6",
          },
          opponentReply: {
            san: "d4",
            uci: "d2d4",
          },
          nodeId: "caro-core-002",
        },
      ],
    },
    {
      id: "caro-core-002",
      variationId: "caro-kann-core",
      fen: "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
      sideToMove: "b",
      userSide: "b",
      prompt: "Challenge White's center with the main Caro-Kann pawn break.",
      expectedMoves: [
        {
          san: "d5",
          uci: "d7d5",
          message:
            "Good. ...d5 strikes the center and defines the Caro-Kann structure.",
        },
      ],
      acceptableMoves: [
        {
          san: "g6",
          uci: "g7g6",
          message:
            "Playable in some systems, but this lesson is training the direct ...d5 plan.",
        },
      ],
      mistakes: [
        {
          san: "e6",
          uci: "e7e6",
          tag: "delays-center-challenge",
          message:
            "...e6 is legal, but it delays the main Caro-Kann central challenge.",
          recoveryHint: "After ...c6 and d4, play ...d5.",
        },
      ],
      hints: [
        "White has built a pawn center.",
        "Use the pawn you prepared with ...c6.",
        "Play ...d5.",
      ],
      explanation:
        "...d5 directly attacks White's e4 pawn and creates the central tension every Caro-Kann player must understand.",
      conceptTags: ["central-break", "attack-e4"],
      next: [],
    },
  ],
};
