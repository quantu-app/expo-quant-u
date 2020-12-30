import { none, Option } from "@aicacia/core";
import { Rng } from "@aicacia/rand";
import { List, Record, RecordOf } from "immutable";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Title } from "react-native-paper";
import type { Question as QuestionClass, Quiz as QuizClass } from "../quizlib";
import { Question } from "./Question";

export interface IQuizProps {
  rng: Rng;
  quiz: QuizClass;
}

interface IQuestionResult {
  result: [number, number];
  explained: boolean;
  correct: boolean;
}

const QuestionResult = Record<IQuestionResult>({
  result: [0, 0],
  explained: false,
  correct: false,
});

interface IQuizState<T = any> {
  done: boolean;
  current: Option<number>;
  questions: List<QuestionClass<T>>;
  results: List<RecordOf<IQuestionResult>>;
}

const QuizState = Record<IQuizState>({
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

  function onNext(
    result: [number, number],
    explained: boolean,
    correct: boolean
  ) {
    const current = state.current.unwrapOr(0),
      newState = state.update("results", (results) =>
        results.push(
          QuestionResult({
            result,
            correct,
            explained,
          })
        )
      );

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
          .flatMap((index) => Option.from(state.questions.get(index)))
          .map((question) => (
            <Question
              key={state.current.unwrap()}
              question={question}
              onNext={onNext}
            />
          ))
          .unwrapOr(null as any)
      )}
    </View>
  );
}

interface IResultsProps<T = any> {
  quiz: QuizClass;
  state: RecordOf<IQuizState<T>>;
  onReset(): void;
}

const resultStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 16,
  },
});

function Results<T = any>(props: IResultsProps<T>) {
  return (
    <View style={resultStyles.container}>
      <Title>
        Points -{" "}
        {props.state.results.reduce(
          (count, result) => count + result.result[0],
          0
        )}
        {" / "}
        {props.state.results.reduce(
          (count, result) => count + result.result[1],
          0
        )}
      </Title>
      <Title>
        Correct -{" "}
        {props.state.results.reduce(
          (count, result) => (result.correct ? count + 1 : count),
          0
        )}
        {" / "}
        {props.state.results.size}
      </Title>
      <Button
        mode="contained"
        style={resultStyles.button}
        onPress={props.onReset}
      >
        Reset
      </Button>
    </View>
  );
}
