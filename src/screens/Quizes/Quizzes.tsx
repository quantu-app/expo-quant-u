import { Layout } from "../../Layout";
import { Quiz as QuizClass } from "../../quizlib";
import { Quiz } from "../../Quiz";
import { XorShiftRng } from "@aicacia/rand";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import additionQuizJSON from "../../../quizzes/math/basic/addition.json";

export function Quizzes() {
  return (
    <Layout>
      <Async
        promise={QuizClass.fromJSON(additionQuizJSON)}
        onSuccess={(quiz) => (
          <Quiz rng={XorShiftRng.fromSeed(Date.now())} quiz={quiz} />
        )}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Layout>
  );
}
