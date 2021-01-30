import React, { useCallback } from "react";
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

export interface IFixedQuizProps {
  rng: Rng;
  quiz: QuizClass;
}

export interface IFixedQuizState {
  done: boolean;
  current: number;
  start: number;
  end: number;
  questions: List<QuestionClass>;
  results: List<RecordOf<IQuestionResult>>;
}

export const FixedQuizState = Record<IFixedQuizState>({
  done: true,
  current: -1,
  start: 0,
  end: 0,
  questions: List(),
  results: List(),
});

export function FixedQuiz(props: IFixedQuizProps) {
  const [state, setState] = useState(FixedQuizState());
  const [loading, setLoading] = useState(true);

  async function onReset() {
    setLoading(true);
    const questions = await props.quiz.getQuestions(props.rng);

    if (questions.length) {
      setState(
        FixedQuizState({
          done: false,
          current: 0,
          start: Date.now(),
          end: Date.now(),
          questions: List(questions),
          results: List(questions.map(() => QuestionResult())),
        })
      );
    } else {
      setState(
        FixedQuizState({
          start: Date.now(),
          end: Date.now(),
        })
      );
    }
    setLoading(false);
  }

  useMemo(onReset, [props.quiz, props.rng]);

  const onSelectQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < state.questions.size) {
        setState(state.set("current", index));
      }
    },
    [setState, state]
  );

  const onCheck = useCallback(
    async (result: RecordOf<IQuestionResult>) => {
      if (state.current !== -1) {
        const question = state.questions.get(state.current) as QuestionClass;

        let nextState = state.update("results", (results) =>
          results.set(state.current, result)
        );

        if (
          (result.correct ||
            question
              .getRetries()
              .map((retries) => result.attempt < retries)
              .unwrapOr(true)) &&
          props.quiz.getAutoNext() &&
          !result.explained
        ) {
          const current = getNextQuestionIndex(nextState);

          nextState = nextState
            .set("done", current === -1)
            .set("current", current);

          if (nextState.done) {
            nextState = nextState.set("end", Date.now());
          }
        }

        setState(nextState);
      }
    },
    [state, setState, props.quiz]
  );

  const onNext = useCallback(async () => {
    const endTime = Date.now(),
      current = getNextQuestionIndex(state);
    let nextState = state.set("done", current === -1).set("current", current);

    if (nextState.done) {
      nextState = nextState.set("end", endTime);
    }

    setState(nextState);
  }, [state, setState]);

  const onRetry = useCallback(
    (result: RecordOf<IQuestionResult>) => {
      if (state.current !== -1) {
        setState(
          state.update("results", (results) =>
            results.set(
              state.current,
              QuestionResult({
                start: result.start,
                end: result.end,
                attempt: result.attempt + 1,
              })
            )
          )
        );
      }
    },
    [state, setState]
  );

  if (loading) {
    return <Loading />;
  } else if (state.done) {
    return (
      <Results
        results={state.results}
        questions={state.questions}
        start={state.start}
        end={state.end}
        quiz={props.quiz}
        onReset={onReset}
      />
    );
  } else {
    const result = state.results.get(
        state.current
      ) as RecordOf<IQuestionResult>,
      question = state.questions.get(state.current) as QuestionClass,
      key = `${state.current}-${result.attempt}`;

    return (
      <>
        <Status
          current={state.current}
          state={state}
          onSelectQuestion={onSelectQuestion}
        />
        <Question
          key={key}
          result={result}
          question={question}
          onNext={onNext}
          onRetry={onRetry}
          onCheck={onCheck}
        />
      </>
    );
  }
}

function getNextQuestionIndex(state: RecordOf<IFixedQuizState>) {
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
