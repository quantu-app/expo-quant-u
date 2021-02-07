import React from "react";
import { Async } from "@aicacia/async_component-react";
import { IQuiz } from "../../../course-lib";
import { CHALLENGE_QUIZ_SCREEN, ParamList } from "../../navigationConfig";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { getLesson } from "../../../course-lib/categories";
import { ChallengeQuiz } from "./ChallengeQuiz";

export function ChallengeQuizLoading(
  props: ParamList[typeof CHALLENGE_QUIZ_SCREEN]
) {
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
        <ChallengeQuiz quiz={quiz} seed={props.seed} id={props.id} />
      )}
    />
  );
}
