import React from "react";
import { RecordOf } from "immutable";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Spinner } from "@ui-kitten/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Question as QuestionClass } from "../../course-lib";
import { QuestionInput } from "./QuestionInput";
import customTheme from "../../custom-theme.json";
import { IQuestionResult } from "./QuestionResult";

export interface IQuestionProps<T = any> {
  timeInSeconds?: number;
  result: RecordOf<IQuestionResult<T>>;
  question: QuestionClass<T>;
  onNext(): void;
  onCheck(result: RecordOf<IQuestionResult<T>>): void;
}

const styles = StyleSheet.create({
  prompt: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  input: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  explanation: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  buttons: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  results: {
    alignItems: "center",
    marginTop: 16,
  },
});

export function Question<T = any>(props: IQuestionProps<T>) {
  const [loading, setLoading] = useState(false),
    [state, setState] = useState(props.result);

  useMemo(async () => {
    setLoading(true);
    const total = await props.question.getTotalPoints();
    setState(state.set("total", total).set("start", Date.now()));
    setLoading(false);
  }, [props.question, props.result]);

  function onInputChange(value: any) {
    setState(state.set("value", value).set("changed", true));
  }

  async function onCheck() {
    setLoading(true);
    const points = await props.question.checkAnswer(state.value as any),
      nextState = state
        .set("done", true)
        .set("points", points)
        .set("correct", points === state.total && state.total > 0)
        .set("end", Date.now());
    setState(nextState);
    props.onCheck(nextState);
    setLoading(false);
  }

  async function onExplain() {
    let nextState = state;

    if (!nextState.done) {
      nextState = nextState.set("end", Date.now());
    }

    nextState = nextState.set("done", true).set("explained", true);

    setState(nextState);
    props.onCheck(nextState);
  }

  return (
    <>
      <View style={styles.prompt}>{props.question.getPrompt()}</View>
      <View style={styles.input}>
        <QuestionInput
          result={state}
          input={props.question.getInput()}
          onChange={onInputChange}
          onCheck={onCheck}
        />
      </View>
      <View style={styles.buttons}>
        {state.done ? (
          <Button appearance="filled" onPress={props.onNext}>
            Next
          </Button>
        ) : (
          <Button
            appearance="filled"
            accessoryLeft={loading ? () => <Spinner /> : undefined}
            disabled={!state.changed || loading}
            onPress={onCheck}
          >
            Check
          </Button>
        )}
        {props.question.getExplanation().isSome() && (
          <Button
            appearance="outline"
            accessoryLeft={loading ? () => <Spinner /> : undefined}
            disabled={state.explained || loading}
            onPress={onExplain}
          >
            Explain
          </Button>
        )}
      </View>
      <View style={styles.results}>
        {state.done && state.correct && (
          <MaterialCommunityIcons
            name="check"
            size={32}
            color={customTheme["color-success-100"]}
          />
        )}
        {state.done && !state.correct && (
          <MaterialCommunityIcons
            name="window-close"
            size={32}
            color={customTheme["color-danger-100"]}
          />
        )}
      </View>
      {state.explained &&
        props.question
          .getExplanation()
          .map((explanation) => (
            <View key={0} style={styles.explanation}>
              {explanation}
            </View>
          ))
          .unwrapOr(null as any)}
    </>
  );
}
