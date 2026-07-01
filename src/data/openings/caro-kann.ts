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
        "Meet e4 with ...c6 and ...d5, then learn how White's third move changes the plan.",
      startingNodeId: "caro-core-001",
      conceptTags: ["solid-center", "support-d5"],
    },
    {
      id: "caro-kann-advance",
      title: "Advance Variation",
      beginnerSummary:
        "When White plays e5, develop ...Bf5 before ...e6 and prepare the ...c5 break.",
      startingNodeId: "caro-advance-001",
      conceptTags: ["advance-variation", "bishop-before-e6", "c5-break"],
    },
    {
      id: "caro-kann-exchange",
      title: "Exchange Variation",
      beginnerSummary:
        "After White exchanges on d5, develop naturally and avoid becoming too passive.",
      startingNodeId: "caro-exchange-001",
      conceptTags: ["exchange-variation", "development"],
    },
    {
      id: "caro-kann-classical-nc3",
      title: "Classical With 3.Nc3",
      beginnerSummary:
        "Against 3.Nc3, capture on e4 and develop the bishop actively to f5.",
      startingNodeId: "caro-classical-001",
      conceptTags: ["classical-nc3", "capture-e4", "bf5"],
    },
    {
      id: "caro-kann-modern-nd2",
      title: "Modern With 3.Nd2",
      beginnerSummary:
        "Against 3.Nd2, use the same clear plan: take on e4, then develop ...Bf5.",
      startingNodeId: "caro-modern-001",
      conceptTags: ["modern-nd2", "capture-e4", "bf5"],
    },
    {
      id: "caro-kann-fantasy",
      title: "Fantasy Variation",
      beginnerSummary:
        "Against f3, reduce White's center first, then challenge it with ...e5.",
      startingNodeId: "caro-fantasy-001",
      conceptTags: ["fantasy-variation", "center-challenge"],
    },
    {
      id: "caro-kann-panov",
      title: "Panov-Botvinnik Entry",
      beginnerSummary:
        "Against c4, develop ...Nf6 and build a sound isolated-pawn structure with ...e6.",
      startingNodeId: "caro-panov-001",
      conceptTags: ["panov-botvinnik", "isolated-pawn-structure"],
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
          nextNodeId: "caro-advance-001",
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
      next: [
        {
          move: {
            san: "d5",
            uci: "d7d5",
          },
          opponentReply: {
            san: "e5",
            uci: "e4e5",
          },
          nodeId: "caro-advance-001",
        },
      ],
    },
    {
      id: "caro-advance-001",
      variationId: "caro-kann-advance",
      fen: "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
      sideToMove: "b",
      userSide: "b",
      prompt:
        "White advanced to e5. Develop your good bishop before closing it in.",
      expectedMoves: [
        {
          san: "Bf5",
          uci: "c8f5",
          message:
            "Good. ...Bf5 gets the bishop outside before ...e6 builds the pawn chain.",
          nextNodeId: "caro-advance-002",
        },
      ],
      acceptableMoves: [
        {
          san: "c5",
          uci: "c6c5",
          message:
            "...c5 is a real Advance idea, but this beginner lesson first trains ...Bf5.",
        },
      ],
      mistakes: [
        {
          san: "e6",
          uci: "e7e6",
          tag: "locks-bishop-in-advance",
          message:
            "...e6 is legal, but playing it before ...Bf5 traps your light-square bishop.",
          recoveryHint: "Develop ...Bf5 first, then support the center with ...e6.",
        },
      ],
      hints: [
        "White's e5 pawn gives you time to develop.",
        "Move the light-square bishop before ...e6.",
        "Play ...Bf5.",
      ],
      explanation:
        "In the Advance Variation, ...Bf5 is the clean beginner priority because ...e6 would otherwise lock the bishop behind the pawn chain.",
      conceptTags: ["advance-variation", "bf5", "bishop-before-e6"],
      next: [
        {
          move: {
            san: "Bf5",
            uci: "c8f5",
          },
          opponentReply: {
            san: "Nf3",
            uci: "g1f3",
          },
          nodeId: "caro-advance-002",
        },
      ],
    },
    {
      id: "caro-advance-002",
      variationId: "caro-kann-advance",
      fen: "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 4",
      sideToMove: "b",
      userSide: "b",
      prompt: "Your bishop is active. Now build the Caro-Kann pawn chain.",
      expectedMoves: [
        {
          san: "e6",
          uci: "e7e6",
          message:
            "Good. ...e6 supports d5 now that the bishop is safely outside.",
          nextNodeId: "caro-advance-003",
        },
      ],
      acceptableMoves: [
        {
          san: "Nd7",
          uci: "b8d7",
          message:
            "...Nd7 is playable, but this lesson locks in the center with ...e6 first.",
        },
      ],
      mistakes: [
        {
          san: "h6",
          uci: "h7h6",
          tag: "slow-wing-move",
          message:
            "...h6 is slow while your center still needs support.",
          recoveryHint: "Play ...e6 to protect d5 and prepare development.",
        },
      ],
      hints: [
        "Your bishop is no longer trapped by the e-pawn.",
        "Support the d5 pawn.",
        "Play ...e6.",
      ],
      explanation:
        "...e6 supports d5, opens the f8 bishop's development options, and gives Black the sturdy Caro-Kann shape.",
      conceptTags: ["e6", "support-d5", "development-priority"],
      next: [
        {
          move: {
            san: "e6",
            uci: "e7e6",
          },
          opponentReply: {
            san: "Be2",
            uci: "f1e2",
          },
          nodeId: "caro-advance-003",
        },
      ],
    },
    {
      id: "caro-advance-003",
      variationId: "caro-kann-advance",
      fen: "rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQK2R b KQkq - 1 5",
      sideToMove: "b",
      userSide: "b",
      prompt: "White's center is advanced. Challenge it with the key break.",
      expectedMoves: [
        {
          san: "c5",
          uci: "c6c5",
          message:
            "Good. ...c5 attacks d4 and keeps White's center from becoming too comfortable.",
        },
      ],
      acceptableMoves: [
        {
          san: "Nd7",
          uci: "b8d7",
          message:
            "...Nd7 develops, but this lesson highlights the important ...c5 break.",
        },
      ],
      mistakes: [
        {
          san: "h6",
          uci: "h7h6",
          tag: "ignores-advanced-center",
          message:
            "...h6 ignores White's advanced center and gives White a free developing move.",
          recoveryHint: "Use ...c5 to attack d4.",
        },
      ],
      hints: [
        "White has pawns on d4 and e5.",
        "Use the c-pawn to attack the base of the center.",
        "Play ...c5.",
      ],
      explanation:
        "...c5 is the central break Caro-Kann players must know in the Advance: it challenges d4 and prevents White from simply building up.",
      conceptTags: ["c5-break", "attack-d4", "advance-variation"],
      next: [],
    },
    {
      id: "caro-exchange-001",
      variationId: "caro-kann-exchange",
      fen: "rnbqkbnr/pp2pppp/8/3p4/3P4/3B4/PPP2PPP/RNBQK1NR b KQkq - 1 4",
      sideToMove: "b",
      userSide: "b",
      prompt: "White exchanged on d5 and developed Bd3. Develop naturally.",
      expectedMoves: [
        {
          san: "Nc6",
          uci: "b8c6",
          message:
            "Good. ...Nc6 develops and increases pressure on d4.",
          nextNodeId: "caro-exchange-002",
        },
      ],
      acceptableMoves: [
        {
          san: "Nf6",
          uci: "g8f6",
          message:
            "...Nf6 is also natural, but this lesson starts by developing ...Nc6.",
        },
      ],
      mistakes: [
        {
          san: "e6",
          uci: "e7e6",
          tag: "too-passive-in-exchange",
          message:
            "...e6 is playable, but if you only make small pawn moves White gets easy development.",
          recoveryHint: "Develop a knight with ...Nc6 or ...Nf6.",
        },
      ],
      hints: [
        "The center is symmetrical now.",
        "Develop a knight and touch d4.",
        "Play ...Nc6.",
      ],
      explanation:
        "In the Exchange Variation, Black should develop actively instead of drifting into a passive mirror position.",
      conceptTags: ["exchange-variation", "development", "pressure-d4"],
      next: [
        {
          move: {
            san: "Nc6",
            uci: "b8c6",
          },
          opponentReply: {
            san: "c3",
            uci: "c2c3",
          },
          nodeId: "caro-exchange-002",
        },
      ],
    },
    {
      id: "caro-exchange-002",
      variationId: "caro-kann-exchange",
      fen: "r1bqkbnr/pp2pppp/2n5/3p4/3P4/2PB4/PP3PPP/RNBQK1NR b KQkq - 0 5",
      sideToMove: "b",
      userSide: "b",
      prompt: "Continue development in the Exchange Variation.",
      expectedMoves: [
        {
          san: "Nf6",
          uci: "g8f6",
          message:
            "Good. ...Nf6 develops, supports central control, and prepares kingside castling.",
        },
      ],
      acceptableMoves: [
        {
          san: "e6",
          uci: "e7e6",
          message:
            "...e6 is playable, but piece development comes first in this drill.",
        },
      ],
      mistakes: [
        {
          san: "e5",
          uci: "e7e5",
          tag: "rushes-center-break",
          message:
            "...e5 is ambitious, but it opens the center before your pieces are ready.",
          recoveryHint: "Develop with ...Nf6 before forcing pawn breaks.",
        },
      ],
      hints: [
        "Develop the kingside knight.",
        "Prepare to castle.",
        "Play ...Nf6.",
      ],
      explanation:
        "...Nf6 is a simple development priority: add a piece, control the center, and get closer to castling.",
      conceptTags: ["development-priority", "nf6", "castling"],
      next: [],
    },
    {
      id: "caro-classical-001",
      variationId: "caro-kann-classical-nc3",
      fen: "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
      sideToMove: "b",
      userSide: "b",
      prompt: "White defended e4 with Nc3. Reduce the center.",
      expectedMoves: [
        {
          san: "dxe4",
          uci: "d5e4",
          message:
            "Good. ...dxe4 removes White's e-pawn and clarifies the center.",
          nextNodeId: "caro-classical-002",
        },
      ],
      acceptableMoves: [
        {
          san: "Nf6",
          uci: "g8f6",
          message:
            "...Nf6 is playable in some lines, but the classical beginner plan starts with ...dxe4.",
        },
      ],
      mistakes: [
        {
          san: "e6",
          uci: "e7e6",
          tag: "leaves-tension-unresolved",
          message:
            "...e6 leaves the central tension unresolved and delays your active bishop.",
          recoveryHint: "Capture on e4, then develop ...Bf5.",
        },
      ],
      hints: [
        "White has defended the e4 pawn.",
        "Use your d-pawn to remove it.",
        "Play ...dxe4.",
      ],
      explanation:
        "Against 3.Nc3, ...dxe4 is the clear Caro-Kann plan: remove e4 first, then develop the bishop actively.",
      conceptTags: ["classical-nc3", "capture-e4"],
      next: [
        {
          move: {
            san: "dxe4",
            uci: "d5e4",
          },
          opponentReply: {
            san: "Nxe4",
            uci: "c3e4",
          },
          nodeId: "caro-classical-002",
        },
      ],
    },
    {
      id: "caro-classical-002",
      variationId: "caro-kann-classical-nc3",
      fen: "rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4",
      sideToMove: "b",
      userSide: "b",
      prompt: "White recaptured on e4. Develop the bishop before ...e6.",
      expectedMoves: [
        {
          san: "Bf5",
          uci: "c8f5",
          message:
            "Good. ...Bf5 develops actively and attacks the e4 knight.",
        },
      ],
      acceptableMoves: [
        {
          san: "Nd7",
          uci: "b8d7",
          message:
            "...Nd7 is playable, but this lesson prioritizes the active ...Bf5 bishop.",
        },
      ],
      mistakes: [
        {
          san: "e6",
          uci: "e7e6",
          tag: "blocks-active-bishop",
          message:
            "...e6 is legal, but it blocks the bishop you want on f5.",
          recoveryHint: "Play ...Bf5 before closing the diagonal.",
        },
      ],
      hints: [
        "White's knight on e4 can be bothered.",
        "Use the light-square bishop actively.",
        "Play ...Bf5.",
      ],
      explanation:
        "...Bf5 develops with tempo by attacking the e4 knight, a core idea in the Classical Caro-Kann.",
      conceptTags: ["bf5", "attack-e4-knight", "development-priority"],
      next: [],
    },
    {
      id: "caro-modern-001",
      variationId: "caro-kann-modern-nd2",
      fen: "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPPN1PPP/R1BQKBNR b KQkq - 1 3",
      sideToMove: "b",
      userSide: "b",
      prompt: "White used Nd2 instead of Nc3. Use the same center plan.",
      expectedMoves: [
        {
          san: "dxe4",
          uci: "d5e4",
          message:
            "Good. ...dxe4 removes the e-pawn and keeps the Caro-Kann plan simple.",
          nextNodeId: "caro-modern-002",
        },
      ],
      acceptableMoves: [
        {
          san: "Nf6",
          uci: "g8f6",
          message:
            "...Nf6 is playable, but this lesson shows the clean capture-first plan.",
        },
      ],
      mistakes: [
        {
          san: "e6",
          uci: "e7e6",
          tag: "delays-central-resolution",
          message:
            "...e6 delays the simple capture that defines this beginner line.",
          recoveryHint: "Play ...dxe4, then develop ...Bf5.",
        },
      ],
      hints: [
        "Nd2 still protects e4.",
        "Resolve the central tension the same way.",
        "Play ...dxe4.",
      ],
      explanation:
        "Against 3.Nd2, Black can follow the same beginner plan as against 3.Nc3: capture e4 and develop actively.",
      conceptTags: ["modern-nd2", "capture-e4"],
      next: [
        {
          move: {
            san: "dxe4",
            uci: "d5e4",
          },
          opponentReply: {
            san: "Nxe4",
            uci: "d2e4",
          },
          nodeId: "caro-modern-002",
        },
      ],
    },
    {
      id: "caro-modern-002",
      variationId: "caro-kann-modern-nd2",
      fen: "rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4",
      sideToMove: "b",
      userSide: "b",
      prompt: "White's knight recaptured on e4. Develop with tempo.",
      expectedMoves: [
        {
          san: "Bf5",
          uci: "c8f5",
          message:
            "Good. ...Bf5 develops and asks the knight on e4 where it wants to go.",
        },
      ],
      acceptableMoves: [
        {
          san: "Nd7",
          uci: "b8d7",
          message:
            "...Nd7 is playable, but ...Bf5 is the active beginner priority.",
        },
      ],
      mistakes: [
        {
          san: "e6",
          uci: "e7e6",
          tag: "blocks-active-bishop",
          message:
            "...e6 blocks the bishop before it reaches its best beginner square.",
          recoveryHint: "Develop ...Bf5 first.",
        },
      ],
      hints: [
        "The e4 knight gives you a target.",
        "Develop the bishop with tempo.",
        "Play ...Bf5.",
      ],
      explanation:
        "...Bf5 is the recurring Caro-Kann development priority after Black captures on e4.",
      conceptTags: ["bf5", "development-priority", "modern-nd2"],
      next: [],
    },
    {
      id: "caro-fantasy-001",
      variationId: "caro-kann-fantasy",
      fen: "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/5P2/PPP3PP/RNBQKBNR b KQkq - 0 3",
      sideToMove: "b",
      userSide: "b",
      prompt: "White supports e4 with f3. Remove part of the center.",
      expectedMoves: [
        {
          san: "dxe4",
          uci: "d5e4",
          message:
            "Good. ...dxe4 removes the e-pawn before White's center rolls forward.",
          nextNodeId: "caro-fantasy-002",
        },
      ],
      acceptableMoves: [
        {
          san: "e6",
          uci: "e7e6",
          message:
            "...e6 is playable, but this lesson first reduces White's center.",
        },
      ],
      mistakes: [
        {
          san: "Nf6",
          uci: "g8f6",
          tag: "ignores-fantasy-center",
          message:
            "...Nf6 develops, but White's f3-e4-d4 center needs immediate attention.",
          recoveryHint: "Capture with ...dxe4 first.",
        },
      ],
      hints: [
        "White used f3 to strengthen e4.",
        "Capture the e4 pawn before it advances.",
        "Play ...dxe4.",
      ],
      explanation:
        "The Fantasy Variation gives White a big center, so Black should reduce it quickly before developing slowly.",
      conceptTags: ["fantasy-variation", "capture-e4"],
      next: [
        {
          move: {
            san: "dxe4",
            uci: "d5e4",
          },
          opponentReply: {
            san: "fxe4",
            uci: "f3e4",
          },
          nodeId: "caro-fantasy-002",
        },
      ],
    },
    {
      id: "caro-fantasy-002",
      variationId: "caro-kann-fantasy",
      fen: "rnbqkbnr/pp2pppp/2p5/8/3PP3/8/PPP3PP/RNBQKBNR b KQkq - 0 4",
      sideToMove: "b",
      userSide: "b",
      prompt: "White recaptured and still has a large center. Challenge it.",
      expectedMoves: [
        {
          san: "e5",
          uci: "e7e5",
          message:
            "Good. ...e5 immediately fights White's d4-e4 center.",
        },
      ],
      acceptableMoves: [
        {
          san: "Nf6",
          uci: "g8f6",
          message:
            "...Nf6 is playable, but ...e5 is the direct beginner antidote here.",
        },
      ],
      mistakes: [
        {
          san: "e6",
          uci: "e7e6",
          tag: "too-passive-against-fantasy",
          message:
            "...e6 is solid-looking, but it lets White keep the big center for free.",
          recoveryHint: "Use ...e5 to challenge the center immediately.",
        },
      ],
      hints: [
        "White still has pawns on d4 and e4.",
        "Use your e-pawn to hit the center.",
        "Play ...e5.",
      ],
      explanation:
        "...e5 directly challenges White's center and is the simple plan to remember against the Fantasy.",
      conceptTags: ["e5-break", "fantasy-variation", "center-challenge"],
      next: [],
    },
    {
      id: "caro-panov-001",
      variationId: "caro-kann-panov",
      fen: "rnbqkbnr/pp2pppp/8/3p4/2PP4/8/PP3PPP/RNBQKBNR b KQkq - 0 4",
      sideToMove: "b",
      userSide: "b",
      prompt: "White enters the Panov with c4. Develop before deciding the pawn structure.",
      expectedMoves: [
        {
          san: "Nf6",
          uci: "g8f6",
          message:
            "Good. ...Nf6 develops and pressures the d5/e4 central squares.",
          nextNodeId: "caro-panov-002",
        },
      ],
      acceptableMoves: [
        {
          san: "e6",
          uci: "e7e6",
          message:
            "...e6 is part of the Panov structure, but develop ...Nf6 first in this lesson.",
        },
      ],
      mistakes: [
        {
          san: "dxc4",
          uci: "d5c4",
          tag: "grabs-c4-too-early",
          message:
            "...dxc4 grabs a pawn-looking target but gives White easy development.",
          recoveryHint: "Develop with ...Nf6 before changing the structure.",
        },
      ],
      hints: [
        "White is challenging d5 with c4.",
        "Develop a knight and add central control.",
        "Play ...Nf6.",
      ],
      explanation:
        "The Panov often creates isolated-pawn structures, so Black should develop pieces before making early pawn grabs.",
      conceptTags: ["panov-botvinnik", "nf6", "development-priority"],
      next: [
        {
          move: {
            san: "Nf6",
            uci: "g8f6",
          },
          opponentReply: {
            san: "Nc3",
            uci: "b1c3",
          },
          nodeId: "caro-panov-002",
        },
      ],
    },
    {
      id: "caro-panov-002",
      variationId: "caro-kann-panov",
      fen: "rnbqkb1r/pp2pppp/5n2/3p4/2PP4/2N5/PP3PPP/R1BQKBNR b KQkq - 2 5",
      sideToMove: "b",
      userSide: "b",
      prompt: "White developed Nc3. Build the solid Panov structure.",
      expectedMoves: [
        {
          san: "e6",
          uci: "e7e6",
          message:
            "Good. ...e6 supports d5 and prepares normal development.",
        },
      ],
      acceptableMoves: [
        {
          san: "Nc6",
          uci: "b8c6",
          message:
            "...Nc6 develops too, but this lesson shows the reliable ...e6 structure.",
        },
      ],
      mistakes: [
        {
          san: "dxc4",
          uci: "d5c4",
          tag: "opens-panov-too-soon",
          message:
            "...dxc4 releases the center before Black is ready.",
          recoveryHint: "Use ...e6 to support d5 and continue development.",
        },
      ],
      hints: [
        "Support the d5 pawn.",
        "Prepare the f8 bishop and kingside development.",
        "Play ...e6.",
      ],
      explanation:
        "...e6 gives Black a stable Panov setup: d5 is protected, development is easy, and castling is nearby.",
      conceptTags: ["panov-botvinnik", "e6", "development-priority"],
      next: [],
    },
  ],
};
