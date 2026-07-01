import { INITIAL_FEN } from "@/domain/chess/chess-service";
import type { OpeningModule } from "@/domain/curriculum/curriculum-types";

export const londonModule: OpeningModule = {
  id: "london",
  title: "London System",
  trainingSide: "white",
  description:
    "A beginner-friendly White repertoire built around d4, Nf3, Bf4, e3, Bd3, c3, castling, and a clear Ne5 plan.",
  variations: [
    {
      id: "london-core-setup",
      title: "Core London Setup",
      beginnerSummary:
        "Build the London shape against ...d5 and ...Nf6, then centralize with Ne5.",
      startingNodeId: "london-core-001",
      conceptTags: ["core-setup", "bishop-before-pawn-chain", "ne5-plan"],
    },
    {
      id: "london-kings-indian-setup",
      title: "King's Indian Setup",
      beginnerSummary:
        "Against ...g6, develop Bf4 and e3 while Black prepares a fianchetto.",
      startingNodeId: "london-kid-001",
      conceptTags: ["kings-indian-setup", "fianchetto"],
    },
    {
      id: "london-c5-pressure",
      title: "Early ...c5 Pressure",
      beginnerSummary:
        "When Black challenges d4 early with ...c5, use c3 to keep the London center stable.",
      startingNodeId: "london-c5-001",
      conceptTags: ["early-c5", "center-support"],
    },
    {
      id: "london-symmetric-bf5",
      title: "Symmetric ...Bf5",
      beginnerSummary:
        "When Black mirrors your bishop with ...Bf5, prepare Bd3 to challenge it.",
      startingNodeId: "london-bf5-001",
      conceptTags: ["symmetric-bf5", "bishop-trade"],
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
          message: "e4 is legal, but it leaves the London System repertoire.",
          recoveryHint: "Use d4 when you want a London structure.",
        },
      ],
      hints: [
        "The London starts by claiming the center with the queen pawn.",
        "Move the pawn in front of your queen two squares.",
        "Play d4.",
      ],
      explanation:
        "d4 gives White central space and prepares a stable setup where the dark-square bishop can develop to Bf4.",
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
            "Good. Nf3 supports d4 and prepares smooth London development.",
          nextNodeId: "london-core-003",
        },
      ],
      acceptableMoves: [
        {
          san: "Bf4",
          uci: "c1f4",
          message:
            "Bf4 is a common London move order too, but this core lesson develops Nf3 first.",
        },
      ],
      mistakes: [
        {
          san: "c4",
          uci: "c2c4",
          tag: "changes-to-queens-gambit",
          message:
            "c4 is playable, but it changes the game into Queen's Gambit territory.",
          recoveryHint: "Keep the London shape simple with Nf3.",
        },
        {
          san: "Nc3",
          uci: "b1c3",
          tag: "blocks-c-pawn-plan",
          message:
            "Nc3 is legal, but beginner London setups often keep the c-pawn free for c3.",
          recoveryHint: "Use Nf3 before deciding where the queenside knight belongs.",
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
      next: [
        {
          move: {
            san: "Nf3",
            uci: "g1f3",
          },
          opponentReply: {
            san: "Nf6",
            uci: "g8f6",
          },
          nodeId: "london-core-003",
        },
      ],
    },
    {
      id: "london-core-003",
      variationId: "london-core-setup",
      fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3",
      sideToMove: "w",
      userSide: "w",
      prompt: "Bring out the London bishop before closing the pawn chain.",
      expectedMoves: [
        {
          san: "Bf4",
          uci: "c1f4",
          message:
            "Good. Bf4 activates the dark-square bishop before e3 closes the diagonal.",
          nextNodeId: "london-core-004",
        },
      ],
      acceptableMoves: [
        {
          san: "c3",
          uci: "c2c3",
          message:
            "c3 is part of many London setups, but the bishop should come out first in this lesson.",
        },
      ],
      mistakes: [
        {
          san: "e3",
          uci: "e2e3",
          tag: "traps-bishop-behind-pawn-chain",
          message:
            "e3 is a London move, but playing it before Bf4 locks your bishop inside.",
          recoveryHint: "Develop Bf4 first, then play e3.",
        },
      ],
      hints: [
        "Move the dark-square bishop before playing e3.",
        "The bishop belongs outside the pawn chain.",
        "Play Bf4.",
      ],
      explanation:
        "Bf4 is the signature London move: the bishop becomes active before e3 creates the d4-e3 pawn chain.",
      conceptTags: ["bf4", "bishop-before-pawn-chain"],
      next: [
        {
          move: {
            san: "Bf4",
            uci: "c1f4",
          },
          opponentReply: {
            san: "e6",
            uci: "e7e6",
          },
          nodeId: "london-core-004",
        },
      ],
    },
    {
      id: "london-core-004",
      variationId: "london-core-setup",
      fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R w KQkq - 0 4",
      sideToMove: "w",
      userSide: "w",
      prompt: "Build the London pawn chain now that the bishop is active.",
      expectedMoves: [
        {
          san: "e3",
          uci: "e2e3",
          message:
            "Good. e3 supports d4 and opens a path for the light-square bishop.",
          nextNodeId: "london-core-005",
        },
      ],
      acceptableMoves: [
        {
          san: "c3",
          uci: "c2c3",
          message:
            "c3 is useful soon, but e3 comes first here so the bishop on f1 can develop.",
        },
      ],
      mistakes: [
        {
          san: "Bg5",
          uci: "f4g5",
          tag: "moves-bishop-twice",
          message:
            "Bg5 is legal, but moving the same bishop again slows down your setup.",
          recoveryHint: "Use e3 to build the structure and release the other bishop.",
        },
      ],
      hints: [
        "Support your d4 pawn.",
        "Open the diagonal for your f1 bishop.",
        "Play e3.",
      ],
      explanation:
        "e3 gives d4 solid support and prepares Bd3, the usual attacking bishop development in the London.",
      conceptTags: ["e3", "pawn-chain", "prepare-bd3"],
      next: [
        {
          move: {
            san: "e3",
            uci: "e2e3",
          },
          opponentReply: {
            san: "Be7",
            uci: "f8e7",
          },
          nodeId: "london-core-005",
        },
      ],
    },
    {
      id: "london-core-005",
      variationId: "london-core-setup",
      fen: "rnbqk2r/ppp1bppp/4pn2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 1 5",
      sideToMove: "w",
      userSide: "w",
      prompt: "Develop the light-square bishop to its active London square.",
      expectedMoves: [
        {
          san: "Bd3",
          uci: "f1d3",
          message:
            "Good. Bd3 points at h7 and gives White a simple attacking idea.",
          nextNodeId: "london-core-006",
        },
      ],
      acceptableMoves: [
        {
          san: "Nbd2",
          uci: "b1d2",
          message:
            "Nbd2 belongs in the setup, but this lesson develops Bd3 first.",
        },
      ],
      mistakes: [
        {
          san: "Be2",
          uci: "f1e2",
          tag: "passive-light-bishop",
          message:
            "Be2 is safe, but it is more passive than the London bishop on Bd3.",
          recoveryHint: "Use Bd3 to aim at Black's kingside.",
        },
      ],
      hints: [
        "Develop the bishop that started on f1.",
        "Aim it at Black's h7 square.",
        "Play Bd3.",
      ],
      explanation:
        "Bd3 develops quickly and points at h7, which is why London attacking plans often combine Bd3 with Ne5.",
      conceptTags: ["bd3", "kingside-pressure"],
      next: [
        {
          move: {
            san: "Bd3",
            uci: "f1d3",
          },
          opponentReply: {
            san: "O-O",
            uci: "e8g8",
          },
          nodeId: "london-core-006",
        },
      ],
    },
    {
      id: "london-core-006",
      variationId: "london-core-setup",
      fen: "rnbq1rk1/ppp1bppp/4pn2/3p4/3P1B2/3BPN2/PPP2PPP/RN1QK2R w KQ - 3 6",
      sideToMove: "w",
      userSide: "w",
      prompt: "Develop the queenside knight without blocking the c-pawn.",
      expectedMoves: [
        {
          san: "Nbd2",
          uci: "b1d2",
          message:
            "Good. Nbd2 supports e4 ideas and keeps c3 available.",
          nextNodeId: "london-core-007",
        },
      ],
      acceptableMoves: [
        {
          san: "O-O",
          uci: "e1g1",
          message:
            "Castling is useful and coming soon, but this lesson fits in Nbd2 first.",
        },
      ],
      mistakes: [
        {
          san: "Nc3",
          uci: "b1c3",
          tag: "blocks-c-pawn-plan",
          message:
            "Nc3 develops a piece, but it blocks the c-pawn plan that makes this London setup sturdy.",
          recoveryHint: "Prefer Nbd2, then support the center with c3.",
        },
      ],
      hints: [
        "The queenside knight should not block your c-pawn.",
        "Move the b1 knight to d2.",
        "Play Nbd2.",
      ],
      explanation:
        "Nbd2 develops the knight, supports central play, and leaves c3 free to reinforce d4.",
      conceptTags: ["nbd2", "keep-c-pawn-free"],
      next: [
        {
          move: {
            san: "Nbd2",
            uci: "b1d2",
          },
          opponentReply: {
            san: "c5",
            uci: "c7c5",
          },
          nodeId: "london-core-007",
        },
      ],
    },
    {
      id: "london-core-007",
      variationId: "london-core-setup",
      fen: "rnbq1rk1/pp2bppp/4pn2/2pp4/3P1B2/3BPN2/PPPN1PPP/R2QK2R w KQ - 0 7",
      sideToMove: "w",
      userSide: "w",
      prompt: "Black attacks your center with ...c5. Keep d4 protected.",
      expectedMoves: [
        {
          san: "c3",
          uci: "c2c3",
          message:
            "Good. c3 reinforces d4 and gives the London center a stable base.",
          nextNodeId: "london-core-008",
        },
      ],
      acceptableMoves: [
        {
          san: "O-O",
          uci: "e1g1",
          message:
            "Castling is sensible, but this position is training the c3 center support.",
        },
      ],
      mistakes: [
        {
          san: "dxc5",
          uci: "d4c5",
          tag: "releases-center-too-soon",
          message:
            "dxc5 is legal, but it releases your strong d4 center too early.",
          recoveryHint: "Use c3 to support d4 before deciding whether to capture.",
        },
      ],
      hints: [
        "Black has put pressure on d4.",
        "Use the c-pawn to support your center.",
        "Play c3.",
      ],
      explanation:
        "c3 is a key London move because it supports d4 and makes Black's ...c5 pressure less annoying.",
      conceptTags: ["c3", "center-support", "early-c5"],
      next: [
        {
          move: {
            san: "c3",
            uci: "c2c3",
          },
          opponentReply: {
            san: "Nc6",
            uci: "b8c6",
          },
          nodeId: "london-core-008",
        },
      ],
    },
    {
      id: "london-core-008",
      variationId: "london-core-setup",
      fen: "r1bq1rk1/pp2bppp/2n1pn2/2pp4/3P1B2/2PBPN2/PP1N1PPP/R2QK2R w KQ - 1 8",
      sideToMove: "w",
      userSide: "w",
      prompt: "Finish development by making your king safe.",
      expectedMoves: [
        {
          san: "O-O",
          uci: "e1g1",
          message:
            "Good. Castling completes the safe London setup and connects the rook.",
          nextNodeId: "london-core-009",
        },
      ],
      acceptableMoves: [
        {
          san: "h3",
          uci: "h2h3",
          message:
            "h3 can be useful later, but castling is the priority in this lesson.",
        },
      ],
      mistakes: [
        {
          san: "Qe2",
          uci: "d1e2",
          tag: "delays-king-safety",
          message:
            "Qe2 is legal, but it delays castling while Black is developed.",
          recoveryHint: "Castle before adding slower queen moves.",
        },
      ],
      hints: [
        "Your pieces are developed enough to secure the king.",
        "Move the king two squares toward the rook.",
        "Castle kingside with O-O.",
      ],
      explanation:
        "Castling keeps the king safe and lets White start thinking about Ne5 and kingside pressure.",
      conceptTags: ["castling", "king-safety"],
      next: [
        {
          move: {
            san: "O-O",
            uci: "e1g1",
          },
          opponentReply: {
            san: "b6",
            uci: "b7b6",
          },
          nodeId: "london-core-009",
        },
      ],
    },
    {
      id: "london-core-009",
      variationId: "london-core-setup",
      fen: "r1bq1rk1/p3bppp/1pn1pn2/2pp4/3P1B2/2PBPN2/PP1N1PPP/R2Q1RK1 w - - 0 9",
      sideToMove: "w",
      userSide: "w",
      prompt: "Use the London outpost to centralize your knight.",
      expectedMoves: [
        {
          san: "Ne5",
          uci: "f3e5",
          message:
            "Good. Ne5 plants a knight in the center and increases kingside pressure.",
          nextNodeId: "london-core-010",
        },
      ],
      acceptableMoves: [
        {
          san: "Re1",
          uci: "f1e1",
          message:
            "Re1 is playable, but this lesson is showing the direct Ne5 plan.",
        },
      ],
      mistakes: [
        {
          san: "b4",
          uci: "b2b4",
          tag: "overextends-queenside",
          message:
            "b4 grabs space, but it starts a queenside plan before your central idea is ready.",
          recoveryHint: "Use Ne5 to activate the pieces you developed.",
        },
      ],
      hints: [
        "Look for a central square supported by d4 and f3.",
        "Move the knight from f3 into the center.",
        "Play Ne5.",
      ],
      explanation:
        "Ne5 is a classic London plan: the knight lands in the center while Bd3 and Bf4 aim toward the kingside.",
      conceptTags: ["ne5", "central-outpost", "kingside-pressure"],
      next: [
        {
          move: {
            san: "Ne5",
            uci: "f3e5",
          },
          opponentReply: {
            san: "Bb7",
            uci: "c8b7",
          },
          nodeId: "london-core-010",
        },
      ],
    },
    {
      id: "london-core-010",
      variationId: "london-core-setup",
      fen: "r2q1rk1/pb2bppp/1pn1pn2/2ppN3/3P1B2/2PBP3/PP1N1PPP/R2Q1RK1 w - - 2 10",
      sideToMove: "w",
      userSide: "w",
      prompt: "Add queen support to the Ne5 kingside plan.",
      expectedMoves: [
        {
          san: "Qf3",
          uci: "d1f3",
          message:
            "Good. Qf3 supports the knight and points more pieces toward Black's king.",
        },
      ],
      acceptableMoves: [
        {
          san: "Re1",
          uci: "f1e1",
          message:
            "Re1 is playable, but Qf3 is the attacking follow-up this lesson is training.",
        },
      ],
      mistakes: [
        {
          san: "f4",
          uci: "f2f4",
          tag: "weakens-king-too-early",
          message:
            "f4 is legal, but it weakens your own king before your pieces are coordinated.",
          recoveryHint: "Use Qf3 first to support Ne5 with another piece.",
        },
      ],
      hints: [
        "Support the knight on e5.",
        "Bring the queen toward the kingside without blocking your bishops.",
        "Play Qf3.",
      ],
      explanation:
        "Qf3 adds support to Ne5 and gives White a simple attacking picture without needing advanced tactics yet.",
      conceptTags: ["qf3", "support-ne5", "attacking-plan"],
      next: [],
    },
    {
      id: "london-kid-001",
      variationId: "london-kings-indian-setup",
      fen: "rnbqkb1r/pppppp1p/5np1/8/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 3",
      sideToMove: "w",
      userSide: "w",
      prompt: "Black is setting up ...g6. Develop the London bishop actively.",
      expectedMoves: [
        {
          san: "Bf4",
          uci: "c1f4",
          message:
            "Good. Bf4 keeps your normal London development against the King's Indian setup.",
          nextNodeId: "london-kid-002",
        },
      ],
      acceptableMoves: [
        {
          san: "g3",
          uci: "g2g3",
          message:
            "g3 is playable, but this lesson keeps the London bishop on Bf4.",
        },
      ],
      mistakes: [
        {
          san: "e3",
          uci: "e2e3",
          tag: "traps-bishop-behind-pawn-chain",
          message:
            "e3 before Bf4 again shuts in the bishop you want outside the chain.",
          recoveryHint: "Play Bf4 before e3, even against ...g6.",
        },
      ],
      hints: [
        "Use the same London bishop idea against ...g6.",
        "Get the dark-square bishop outside the pawn chain.",
        "Play Bf4.",
      ],
      explanation:
        "Against a King's Indian setup, Bf4 develops normally and keeps White from becoming too passive.",
      conceptTags: ["kings-indian-setup", "bf4"],
      next: [
        {
          move: {
            san: "Bf4",
            uci: "c1f4",
          },
          opponentReply: {
            san: "Bg7",
            uci: "f8g7",
          },
          nodeId: "london-kid-002",
        },
      ],
    },
    {
      id: "london-kid-002",
      variationId: "london-kings-indian-setup",
      fen: "rnbqk2r/ppppppbp/5np1/8/3P1B2/5N2/PPP1PPPP/RN1QKB1R w KQkq - 2 4",
      sideToMove: "w",
      userSide: "w",
      prompt: "Now build the pawn chain behind your active bishop.",
      expectedMoves: [
        {
          san: "e3",
          uci: "e2e3",
          message:
            "Good. e3 supports d4 and prepares Bd3 against Black's fianchetto.",
        },
      ],
      acceptableMoves: [
        {
          san: "c3",
          uci: "c2c3",
          message:
            "c3 is useful, but e3 first opens your light-square bishop.",
        },
      ],
      mistakes: [
        {
          san: "h3",
          uci: "h2h3",
          tag: "slow-wing-move",
          message:
            "h3 is slow here because your central structure is not finished.",
          recoveryHint: "Play e3 and continue development.",
        },
      ],
      hints: [
        "Your bishop is already active on f4.",
        "Support d4 and open the f1 bishop.",
        "Play e3.",
      ],
      explanation:
        "e3 keeps the London structure consistent while preparing Bd3 and castling.",
      conceptTags: ["e3", "kings-indian-setup"],
      next: [],
    },
    {
      id: "london-c5-001",
      variationId: "london-c5-pressure",
      fen: "rnbqkb1r/pp1ppppp/5n2/2p5/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 3",
      sideToMove: "w",
      userSide: "w",
      prompt: "Black challenges d4 early with ...c5. Stabilize the center.",
      expectedMoves: [
        {
          san: "c3",
          uci: "c2c3",
          message:
            "Good. c3 reinforces d4 before Black can make the center uncomfortable.",
          nextNodeId: "london-c5-002",
        },
      ],
      acceptableMoves: [
        {
          san: "e3",
          uci: "e2e3",
          message:
            "e3 is natural, but c3 is the direct answer to early ...c5 pressure.",
        },
      ],
      mistakes: [
        {
          san: "dxc5",
          uci: "d4c5",
          tag: "releases-center-too-soon",
          message:
            "dxc5 is legal, but it gives up the stable d4 pawn too soon.",
          recoveryHint: "Use c3 to keep your center intact.",
        },
      ],
      hints: [
        "Your d4 pawn is being challenged.",
        "Support it with the c-pawn.",
        "Play c3.",
      ],
      explanation:
        "Early ...c5 is easier to meet when c3 supports d4 and keeps the London center solid.",
      conceptTags: ["early-c5", "c3", "center-support"],
      next: [
        {
          move: {
            san: "c3",
            uci: "c2c3",
          },
          opponentReply: {
            san: "e6",
            uci: "e7e6",
          },
          nodeId: "london-c5-002",
        },
      ],
    },
    {
      id: "london-c5-002",
      variationId: "london-c5-pressure",
      fen: "rnbqkb1r/pp1p1ppp/4pn2/2p5/3P4/2P2N2/PP2PPPP/RNBQKB1R w KQkq - 0 4",
      sideToMove: "w",
      userSide: "w",
      prompt: "With the center supported, return to the London bishop plan.",
      expectedMoves: [
        {
          san: "Bf4",
          uci: "c1f4",
          message:
            "Good. Bf4 resumes normal London development after answering ...c5.",
        },
      ],
      acceptableMoves: [
        {
          san: "e3",
          uci: "e2e3",
          message:
            "e3 is playable, but this lesson still wants the bishop outside first.",
        },
      ],
      mistakes: [
        {
          san: "g3",
          uci: "g2g3",
          tag: "changes-setup-plan",
          message:
            "g3 changes your setup and delays the normal London bishop.",
          recoveryHint: "Play Bf4 and keep the plan simple.",
        },
      ],
      hints: [
        "Now the d4 pawn has c3 support.",
        "Bring out the signature London bishop.",
        "Play Bf4.",
      ],
      explanation:
        "Bf4 returns you to the normal London development scheme after dealing with early ...c5.",
      conceptTags: ["bf4", "early-c5"],
      next: [],
    },
    {
      id: "london-bf5-001",
      variationId: "london-symmetric-bf5",
      fen: "rn1qkb1r/ppp1pppp/5n2/3p1b2/3P1B2/5N2/PPP1PPPP/RN1QKB1R w KQkq - 4 4",
      sideToMove: "w",
      userSide: "w",
      prompt: "Black mirrors your bishop with ...Bf5. Build normally first.",
      expectedMoves: [
        {
          san: "e3",
          uci: "e2e3",
          message:
            "Good. e3 supports d4 and prepares Bd3 to challenge Black's bishop.",
          nextNodeId: "london-bf5-002",
        },
      ],
      acceptableMoves: [
        {
          san: "c3",
          uci: "c2c3",
          message:
            "c3 is useful, but e3 prepares the important Bd3 response.",
        },
      ],
      mistakes: [
        {
          san: "c4",
          uci: "c2c4",
          tag: "changes-to-queens-gambit",
          message:
            "c4 changes the pawn structure before you address Black's active bishop.",
          recoveryHint: "Play e3, then use Bd3 to ask the bishop a question.",
        },
      ],
      hints: [
        "Support d4 and open your light-square bishop.",
        "You want Bd3 next.",
        "Play e3.",
      ],
      explanation:
        "Against symmetric ...Bf5, e3 is still useful because it prepares Bd3, which can trade or chase Black's bishop.",
      conceptTags: ["symmetric-bf5", "e3", "prepare-bd3"],
      next: [
        {
          move: {
            san: "e3",
            uci: "e2e3",
          },
          opponentReply: {
            san: "e6",
            uci: "e7e6",
          },
          nodeId: "london-bf5-002",
        },
      ],
    },
    {
      id: "london-bf5-002",
      variationId: "london-symmetric-bf5",
      fen: "rn1qkb1r/ppp2ppp/4pn2/3p1b2/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 0 5",
      sideToMove: "w",
      userSide: "w",
      prompt: "Challenge Black's mirrored bishop with your active bishop.",
      expectedMoves: [
        {
          san: "Bd3",
          uci: "f1d3",
          message:
            "Good. Bd3 asks Black's bishop to trade or move, reducing its activity.",
        },
      ],
      acceptableMoves: [
        {
          san: "Nbd2",
          uci: "b1d2",
          message:
            "Nbd2 is a normal London move, but Bd3 directly addresses the ...Bf5 bishop.",
        },
      ],
      mistakes: [
        {
          san: "Be2",
          uci: "f1e2",
          tag: "passive-light-bishop",
          message:
            "Be2 lets Black keep the active ...Bf5 bishop without a question.",
          recoveryHint: "Use Bd3 to challenge that bishop.",
        },
      ],
      hints: [
        "Use your light-square bishop actively.",
        "Move it to the square that attacks Black's bishop line.",
        "Play Bd3.",
      ],
      explanation:
        "Bd3 is the simple beginner answer to symmetric ...Bf5: it develops and challenges Black's active bishop.",
      conceptTags: ["symmetric-bf5", "bd3", "bishop-trade"],
      next: [],
    },
  ],
};
