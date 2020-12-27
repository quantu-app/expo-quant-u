import { XorShiftRng } from "@aicacia/rand";
import { Layout } from "../../Layout";
import { Quiz } from "../../Quiz";
import { additionQuiz } from "../../quizzes/math/basic/additionQuiz";

export function Quizzes() {
  return (
    <Layout>
      <Quiz rng={XorShiftRng.fromSeed(Date.now())} quiz={additionQuiz} />
    </Layout>
  );
}
