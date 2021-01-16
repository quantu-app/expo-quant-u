import React from "react";
import { Rng } from "@aicacia/rand";
import { List, Record, RecordOf } from "immutable";
import { useMemo, useState } from "react";
import type {
  Question as QuestionClass,
  Quiz as QuizClass,
} from "../../course-lib";
import { Loading } from "../Loading";
import { Question } from "./Question";
import { IQuestionResult, QuestionResult } from "./QuestionResult";
import { Results } from "./Results";
import { Status } from "./Status";

export interface IQuizProps {
  rng: Rng;
  quiz: QuizClass;
}

export interface IQuizState {
  loading: boolean;
  done: boolean;
  current: number;
  questions: List<QuestionClass>;
  results: List<RecordOf<IQuestionResult>>;
}

export const QuizState = Record<IQuizState>({
  loading: false,
  done: false,
  current: -1,
  questions: List(),
  results: List(),
});

export function Quiz(props: IQuizProps) {
  const [state, setState] = useState(QuizState());

  async function onReset() {
    setState(state.set("loading", true));
    const questions = await props.quiz.getQuestions(props.rng);

    if (questions.length) {
      setState(
        QuizState()
          .set("questions", List(questions))
          .set("results", List(questions.map(() => QuestionResult())))
          .set("current", 0)
      );
    } else {
      setState(QuizState());
    }
  }

  useMemo(onReset, [props.quiz, props.rng]);

  function onCheck(result: RecordOf<IQuestionResult>) {
    if (state.current !== -1) {
      let nextState = state.update("results", (results) =>
        results.set(state.current, result)
      );

      if (props.quiz.getAutoNext()) {
        const current = getNextQuestionIndex(nextState);
        nextState = nextState
          .set("done", current === -1)
          .set("current", current);
      }

      setState(nextState);
    }
  }

  function onSelectQuestion(index: number) {
    if (index >= 0 && index < state.questions.size) {
      setState(state.set("current", index));
    }
  }

  function onNext() {
    const current = getNextQuestionIndex(state);
    setState(state.set("done", current === -1).set("current", current));
  }

  return state.loading ? (
    <Loading />
  ) : state.done ? (
    <Results state={state} quiz={props.quiz} onReset={onReset} />
  ) : (
    <>
      <Status
        current={state.current}
        state={state}
        onSelectQuestion={onSelectQuestion}
      />
      <Question
        key={state.current}
        result={state.results.get(state.current) as RecordOf<IQuestionResult>}
        question={state.questions.get(state.current) as QuestionClass}
        timeInSeconds={props.quiz.getTimeInSecond()}
        onNext={onNext}
        onCheck={onCheck}
      />
    </>
  );
}

function getNextQuestionIndex(state: RecordOf<IQuizState>) {
  let next = -1;

  for (let i = state.current + 1, il = state.results.size; i < il; i++) {
    const result = state.results.get(i) as RecordOf<IQuestionResult>;

    if (!result.done) {
      next = i;
      break;
    }
  }
  if (next === -1) {
    for (let i = 0, il = state.current; i < il; i++) {
      const result = state.results.get(i) as RecordOf<IQuestionResult>;

      if (!result.done) {
        next = i;
        break;
      }
    }
  }

  return next;
}
