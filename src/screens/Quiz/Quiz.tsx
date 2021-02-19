import React from "react";
import { XorShiftRng } from "@aicacia/rand";
import { Text, Card, Divider } from "@ui-kitten/components";
import { Async } from "@aicacia/async_component-react";
import { IQuiz } from "../../../course-lib";
import { Quiz as QuizClass } from "../../../course-lib/quiz";
import { ParamList, QUIZ_SCREEN } from "../../navigationConfig";
import { FixedQuiz } from "../../Quiz";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { getLesson } from "../../../course-lib/categories";
import { selectUser, setSignInUpOpen } from "../../state/auth";
import { useMapStateToProps } from "../../state";
import { createGuard } from "../../createGaurd";

function InternalQuiz(props: ParamList[typeof QUIZ_SCREEN]) {
  return (
    <Async
      promise={getLesson<IQuiz>(
        props.category,
        props.course,
        props.chapter,
        props.unit,
        props.lesson
      )}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
      onSuccess={(quiz) => (
        <Card disabled>
          <Text category="h1">{quiz.name}</Text>
          <Divider />
          <FixedQuiz
            quiz={QuizClass.fromQuizData(quiz as IQuiz)}
            rng={XorShiftRng.fromSeed(props.seed)}
          />
        </Card>
      )}
    />
  );
}

export const Quiz = createGuard(InternalQuiz, async (props) => {
  const user = useMapStateToProps(selectUser),
    quiz = await getLesson<IQuiz>(
      props.category,
      props.course,
      props.chapter,
      props.unit,
      props.lesson
    );

  if (!user.extra.online || quiz.isFree === false) {
    setSignInUpOpen(true);
    throw new Error("No Access");
  }
});
