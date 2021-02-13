import React, { useCallback } from "react";
import { Rng } from "@aicacia/rand";
import { Map, List, Record, RecordOf } from "immutable";
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
import { PEER_ID } from "../state/challenge";

export interface IQuizState {
  done: boolean;
  current: number;
  start: number;
  end: number;
  questions: List<QuestionClass>;
  results: List<RecordOf<IQuestionResult>>;
}

export const QuizState = Record<IQuizState>({
  done: true,
  current: -1,
  start: 0,
  end: 0,
  questions: List(),
  results: List(),
});

export interface IQuizProps {
  rng: Rng;
  quiz: QuizClass;
  peers?: Map<string, List<RecordOf<IQuestionResult>>>;
}

export function Quiz(props: IQuizProps) {
  const [state, setState] = useState(QuizState());
  const [loading, setLoading] = useState(true);

  async function onReset() {
    setLoading(true);
    const question = await props.quiz.getNextQuestion(props.rng);

    setState(
      QuizState({
        done: false,
        current: 0,
        start: Date.now(),
        end: Date.now(),
        questions: List([question]),
        results: List([QuestionResult()]),
      })
    );
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
      const currentQuestion = state.questions.get(
        state.current
      ) as QuestionClass;

      let nextState = state.update("results", (results) =>
        results.set(state.current, result)
      );

      if (
        (result.correct ||
          currentQuestion
            .getRetries()
            .map((retries) => result.attempt < retries)
            .unwrapOr(true)) &&
        props.quiz.getAutoNext() &&
        !result.explained
      ) {
        const question = await props.quiz.getNextQuestion(props.rng);
        nextState = nextState
          .set("current", state.current + 1)
          .update("results", (results) => results.push(QuestionResult()))
          .update("questions", (questions) => questions.push(question));
      }

      setState(nextState);
    },
    [state, setState, props.quiz, props.rng]
  );

  const onNext = useCallback(async () => {
    const question = await props.quiz.getNextQuestion(props.rng);

    setState(
      state
        .update("results", (results) => results.push(QuestionResult()))
        .update("questions", (questions) => questions.push(question))
        .set("current", state.current + 1)
    );
  }, [state, setState, props.quiz, props.rng]);

  const onQuit = useCallback(() => {
    setState(
      state
        .update("results", (results) => results.pop())
        .update("questions", (questions) => questions.pop())
        .set("done", true)
        .set("current", -1)
        .set("end", Date.now())
    );
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
        results={(props.peers || Map()).merge({ [PEER_ID]: state.results })}
        questions={state.questions}
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
          results={state.results}
          done={state.done}
          onSelectQuestion={onSelectQuestion}
        />
        <Question
          key={key}
          result={result}
          question={question}
          onNext={onNext}
          onRetry={onRetry}
          onCheck={onCheck}
          onQuit={onQuit}
        />
      </>
    );
  }
}
