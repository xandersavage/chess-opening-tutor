export const projectInfo = {
  name: "Chess Opening Tutor",
  version: "0.1.0",
  v1Scope: "local-first personal practice app",
} as const;

export const openingModules = [
  {
    id: "london",
    title: "London System",
    side: "white",
    summary:
      "Build the familiar d4, Nf3, Bf4, e3 setup and learn how to keep the plan when Black changes move order.",
  },
  {
    id: "caro-kann",
    title: "Caro-Kann",
    side: "black",
    summary:
      "Meet 1.e4 with ...c6 and ...d5, then practice the common White branches without drowning in theory.",
  },
] as const;

