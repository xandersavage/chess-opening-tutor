import type { Curriculum } from "@/domain/curriculum/curriculum-types";
import { caroKannModule } from "./caro-kann";
import { londonModule } from "./london";

export const starterCurriculum: Curriculum = {
  version: 1,
  modules: [londonModule, caroKannModule],
};
