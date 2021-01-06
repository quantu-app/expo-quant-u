import { Async } from "@aicacia/async_component-react";
import { XorShiftRng } from "@aicacia/rand";
import { Title, Surface } from "react-native-paper";
import { getCategory } from "../../../course-lib";
import { Quiz as QuizClass } from "../../../course-lib/quiz";
import { JSError } from "../../JSError";
import { Layout } from "../../Layout";
import { Loading } from "../../Loading";
import { ParamList, QUIZ_SCREEN } from "../../Navigation";
import { Quiz as QuizComponent } from "../../Quiz";

export function Quiz(props: ParamList[typeof QUIZ_SCREEN]) {
  const quiz = getCategory(props.category).courseMap[props.course].chapterMap[
    props.chapter
  ].unitMap[props.unit].quizMap[props.quiz];

  return (
    <Layout>
      <Surface>
        <Title>{quiz.name}</Title>
        <Async
          promise={QuizClass.fromJSON(quiz as any)}
          onSuccess={(quiz) => (
            <QuizComponent quiz={quiz} rng={XorShiftRng.fromSeed(Date.now())} />
          )}
          onPending={() => <Loading />}
          onError={(error) => <JSError error={error} />}
        />
      </Surface>
    </Layout>
  );
}
