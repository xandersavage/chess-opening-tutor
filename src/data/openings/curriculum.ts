import { INITIAL_FEN } from "@/domain/chess/chess-service";
import type { Curriculum } from "@/domain/curriculum/curriculum-types";

export const starterCurriculum: Curriculum = {
  version: 1,
  modules: [
    {
      id: "london",
      title: "London System",
      trainingSide: "white",
      description:
        "A beginner-friendly White repertoire built around d4, Nf3, Bf4, e3, Bd3, c3, and castling.",
      variations: [
        {
          id: "london-core-setup",
          title: "Core London Setup",
          beginnerSummary:
            "Start with d4, develop naturally, and bring the dark-square bishop out before e3.",
          startingNodeId: "london-core-001",
          conceptTags: ["core-setup", "bishop-before-pawn-chain"],
        },
      ],
      nodes: [
        {
          id: "london-core-001",
          variationId: "london-core-setup",
          fen: INITIAL_FEN,
          sideToMove: "w",
          userSide: "w",
          prompt: "Start the London with a central queen-pawn move.",
          expectedMoves: [
            {
              san: "d4",
              uci: "d2d4",
              message:
                "Good. d4 claims central space and starts the London structure.",
              nextNodeId: "london-core-002",
            },
          ],
          acceptableMoves: [
            {
              san: "Nf3",
              uci: "g1f3",
              message:
                "Playable and flexible, but this lesson starts with d4 first.",
            },
          ],
          mistakes: [
            {
              san: "e4",
              uci: "e2e4",
              tag: "leaves-london-repertoire",
              message:
                "e4 is legal, but it leaves the London System repertoire.",
              recoveryHint: "Use d4 when you want a London structure.",
            },
          ],
          hints: [
            "The London starts by claiming the center with the queen pawn.",
            "Move the pawn in front of your queen two squares.",
            "Play d4.",
          ],
          explanation:
            "d4 gives White central space and prepares a stable setup where the dark-square bishop can develop to f4.",
          conceptTags: ["central-space", "queen-pawn-opening"],
          next: [
            {
              move: {
                san: "d4",
                uci: "d2d4",
              },
              opponentReply: {
                san: "d5",
                uci: "d7d5",
              },
              nodeId: "london-core-002",
            },
          ],
        },
        {
          id: "london-core-002",
          variationId: "london-core-setup",
          fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
          sideToMove: "w",
          userSide: "w",
          prompt: "Develop the king knight before building the rest of the setup.",
          expectedMoves: [
            {
              san: "Nf3",
              uci: "g1f3",
              message:
                "Good. Nf3 supports the center and prepares smooth development.",
            },
          ],
          acceptableMoves: [
            {
              san: "Bf4",
              uci: "c1f4",
              message:
                "This is a London move too, but Nf3 is the target for this lesson step.",
            },
          ],
          mistakes: [
            {
              san: "Nc3",
              uci: "b1c3",
              tag: "blocks-c-pawn-plan",
              message:
                "Nc3 is legal, but beginner London setups often keep the c-pawn free for c3.",
              recoveryHint: "Prefer Nf3 before deciding where the queenside knight belongs.",
            },
          ],
          hints: [
            "Develop a knight toward the center.",
            "Use the knight that does not block your c-pawn.",
            "Play Nf3.",
          ],
          explanation:
            "Nf3 develops a piece, supports d4, and keeps the c-pawn available for the common c3 London structure.",
          conceptTags: ["piece-development", "support-d4"],
          next: [],
        },
      ],
    },
    {
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
    },
  ],
};

