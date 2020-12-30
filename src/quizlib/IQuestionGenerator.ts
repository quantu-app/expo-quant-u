import type { Rng } from "@aicacia/rand";
import type { Question } from "./Question";

export type IQuestionGenerator<T = any> = (rng: Rng) => Question<T>;
