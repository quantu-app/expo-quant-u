import React, { useEffect } from "react";
import { IQuiz } from "../../../course-lib";
import { ParamList, START_CHALLENGE_QUIZ_SCREEN } from "../../navigationConfig";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { getLesson } from "../../../course-lib/categories";
import { viewLesson } from "../../state/tracking";
import { StartChallengeQuiz } from "./StartChallengeQuiz";

export function StartChallengeQuizLoading(
  props: ParamList[typeof START_CHALLENGE_QUIZ_SCREEN]
) {
  useEffect(
    () =>
      viewLesson(
        props.category,
        props.course,
        props.chapter,
        props.unit,
        props.lesson,
        "quiz"
      ),
    []
  );

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
        <StartChallengeQuiz
          quiz={quiz}
          seed={props.seed}
          id={props.id}
          routeParams={props}
        />
      )}
    />
  );
}
