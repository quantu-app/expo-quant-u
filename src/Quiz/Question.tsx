import React from "react";
import { RecordOf } from "immutable";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Question as QuestionClass } from "../../course-lib";
import { QuestionInput } from "./QuestionInput";
import { theme } from "../theme";
import { IQuestionResult } from "./QuestionResult";

export interface IQuestionProps<T = any> {
  timeInSeconds?: number;
  result: RecordOf<IQuestionResult<T>>;
  question: QuestionClass<T>;
  update(
    updater: (
      result: RecordOf<IQuestionResult<T>>
    ) => RecordOf<IQuestionResult<T>>
  ): void;
  onNext(): void;
  onCheck(points: number): void;
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
  const [loading, setLoading] = useState(false);

  useMemo(async () => {
    setLoading(true);
    const total = await props.question.getTotalPoints();
    props.update((result) => result.set("total", total));
    setLoading(false);
  }, [props.question]);

  function onInputChange(value: any) {
    props.update((result) => result.set("value", value).set("changed", true));
  }

  async function onCheck() {
    setLoading(true);
    props.onCheck(await props.question.checkAnswer(props.result.value as any));
    setLoading(false);
  }

  async function onExplain() {
    props.update((result) => result.set("done", true).set("explained", true));
  }

  return (
    <>
      <View style={styles.prompt}>{props.question.getPrompt()}</View>
      <View style={styles.input}>
        <QuestionInput
          {...props.result.toJS()}
          input={props.question.getInput()}
          onChange={onInputChange}
          onCheck={onCheck}
        />
      </View>
      <View style={styles.buttons}>
        {props.result.done ? (
          <Button mode="contained" onPress={props.onNext}>
            Next
          </Button>
        ) : (
          <Button
            mode="contained"
            loading={loading}
            disabled={!props.result.changed || loading}
            onPress={onCheck}
          >
            Check
          </Button>
        )}
        {props.question.getExplanation().isSome() && (
          <Button
            mode="outlined"
            loading={loading}
            disabled={props.result.explained || loading}
            onPress={onExplain}
          >
            Explain
          </Button>
        )}
      </View>
      <View style={styles.results}>
        {props.result.done && props.result.correct && (
          <MaterialCommunityIcons
            name="check"
            size={32}
            color={theme.colors.primary}
          />
        )}
        {props.result.done && !props.result.correct && (
          <MaterialCommunityIcons
            name="window-close"
            size={32}
            color={theme.colors.error}
          />
        )}
      </View>
      {props.result.explained &&
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
