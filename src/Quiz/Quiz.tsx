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
import { StyleSheet, View } from "react-native";
import { Counter } from "./Counter";

export interface IQuizProps {
  rng: Rng;
  quiz: QuizClass;
}

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

const styles = StyleSheet.create({
  timer: {
    alignItems: "center",
  },
});

export function Quiz(props: IQuizProps) {
  const [state, setState] = useState(QuizState());
  const [loading, setLoading] = useState(true);

  async function onReset() {
    setLoading(true);
    const questions = await props.quiz.getQuestions(props.rng);

    if (questions.length) {
      setState(
        QuizState({
          done: false,
          current: 0,
          start: Date.now(),
          questions: List(questions),
          results: List(questions.map(() => QuestionResult())),
        })
      );
    } else {
      setState(
        QuizState({
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
    (result: RecordOf<IQuestionResult>) => {
      if (state.current !== -1) {
        let nextState = state.update("results", (results) =>
          results.set(state.current, result)
        );

        if (props.quiz.getAutoNext() && !result.explained) {
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

  const onNext = useCallback(() => {
    const endTime = Date.now(),
      current = getNextQuestionIndex(state);
    let nextState = state.set("done", current === -1).set("current", current);

    if (nextState.done) {
      nextState = nextState.set("end", endTime);
    }

    setState(nextState);
  }, [state, setState]);

  if (loading) {
    return <Loading />;
  } else if (state.done) {
    return <Results state={state} quiz={props.quiz} onReset={onReset} />;
  } else {
    const result = state.results.get(
        state.current
      ) as RecordOf<IQuestionResult>,
      question = state.questions.get(state.current) as QuestionClass;

    return (
      <>
        <Status
          current={state.current}
          state={state}
          onSelectQuestion={onSelectQuestion}
        />
        <View style={styles.timer}>
          <Counter
            key={state.current}
            timeInSeconds={question.getTimeInSeconds()}
          />
        </View>
        <Question
          key={state.current}
          result={result}
          question={question}
          onNext={onNext}
          onCheck={onCheck}
        />
      </>
    );
  }
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
