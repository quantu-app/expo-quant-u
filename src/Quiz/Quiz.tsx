import { none, Option } from "@aicacia/core";
import { Rng } from "@aicacia/rand";
import { List, Record, RecordOf } from "immutable";
import { useMemo, useState } from "react";
import { View } from "react-native";
import type {
  Question as QuestionClass,
  Quiz as QuizClass,
} from "../../course-lib";
import { Question } from "./Question";
import { IQuestionResult } from "./QuestionResult";
import { Results } from "./Results";

export interface IQuizProps {
  rng: Rng;
  quiz: QuizClass;
}

export interface IQuizState {
  done: boolean;
  current: Option<number>;
  questions: List<QuestionClass>;
  results: List<RecordOf<IQuestionResult>>;
}

export const QuizState = Record<IQuizState>({
  done: false,
  current: none(),
  questions: List(),
  results: List(),
});

export function Quiz(props: IQuizProps) {
  const [state, setState] = useState(QuizState());

  function onReset() {
    const questions = List(props.quiz.getQuestions(props.rng)),
      current = none<number>();

    if (questions.size) {
      current.replace(0);
    }

    setState(QuizState().set("questions", questions).set("current", current));
  }

  useMemo(onReset, [props.quiz, props.rng]);

  function onNext(result: RecordOf<IQuestionResult>) {
    const current = state.current.unwrapOr(0),
      newState = state.update("results", (results) => results.push(result));

    if (current + 1 >= newState.questions.size) {
      setState(newState.set("done", true));
    } else {
      setState(
        newState.set(
          "current",
          newState.current.map((index) => index + 1)
        )
      );
    }
  }

  return (
    <View>
      {state.done ? (
        <Results state={state} quiz={props.quiz} onReset={onReset} />
      ) : (
        state.current
          .flatMap((index) =>
            Option.from(state.questions.get(index)).map((question) => (
              <Question key={index} question={question} onNext={onNext} />
            ))
          )
          .unwrapOr(null as any)
      )}
    </View>
  );
}
