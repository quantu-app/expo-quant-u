import React from "react";
import { XorShiftRng } from "@aicacia/rand";
import { Text, Card, Divider } from "@ui-kitten/components";
import { Async } from "@aicacia/async_component-react";
import { IQuiz } from "../../../course-lib";
import { Quiz as QuizClass } from "../../../course-lib/quiz";
import { ParamList, QUIZ_SCREEN } from "../../navigationConfig";
import { Quiz as QuizComponent } from "../../Quiz";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { getLesson } from "../../../course-lib/categories";

export function Quiz(props: ParamList[typeof QUIZ_SCREEN]) {
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
          <QuizComponent
            {...props}
            quiz={QuizClass.fromQuizData(quiz as IQuiz)}
            rng={XorShiftRng.fromSeed(props.seed)}
          />
        </Card>
      )}
    />
  );
}
