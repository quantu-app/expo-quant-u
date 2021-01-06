import { none, Option, some } from "@aicacia/core";
import { Rng } from "@aicacia/rand";
import { List, Record, RecordOf } from "immutable";
import { useMemo, useState } from "react";
import { View } from "react-native";
import type {
  Question as QuestionClass,
  Quiz as QuizClass,
} from "../../course-lib";
import { Question } from "./Question";
import { IQuestionResult, QuestionResult } from "./QuestionResult";
import { Results } from "./Results";
import { Status } from "./Status";

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
      results = questions.map(() => QuestionResult()),
      current = none<number>();

    if (questions.size) {
      current.replace(0);
    }

    setState(
      QuizState()
        .set("questions", questions)
        .set("results", results)
        .set("current", current)
    );
  }

  useMemo(onReset, [props.quiz, props.rng]);

  function updateCurrent(
    updater: (result: RecordOf<IQuestionResult>) => RecordOf<IQuestionResult>
  ) {
    state.current.map((index) =>
      setState(
        state.update("results", (results) => results.update(index, updater))
      )
    );
  }

  function onSelectQuestion(index: number) {
    console.log(index);
    if (index >= 0 && index < state.questions.size) {
      setState(state.set("current", some(index)));
    }
  }

  function onNext() {
    const current = state.current.unwrapOr(0);

    if (current + 1 >= state.questions.size) {
      setState(state.set("done", true));
    } else {
      setState(
        state.set(
          "current",
          state.current.map((index) => index + 1)
        )
      );
    }
  }

  return (
    <View>
      <Status
        current={state.current.unwrapOr(0)}
        state={state}
        onSelectQuestion={onSelectQuestion}
      />
      {state.done ? (
        <Results state={state} quiz={props.quiz} onReset={onReset} />
      ) : (
        state.current
          .flatMap((index) =>
            Option.from(state.questions.get(index)).map((question) => (
              <Question
                key={index}
                result={state.results.get(index) as RecordOf<IQuestionResult>}
                question={question}
                onNext={onNext}
                update={updateCurrent}
              />
            ))
          )
          .unwrapOr(null as any)
      )}
    </View>
  );
}
