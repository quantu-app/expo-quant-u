import { RecordOf } from "immutable";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Question as QuestionClass } from "../../course-lib";
import { QuestionComponent } from "./QuestionComponent";
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
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  question: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  explanation: {
    flex: 1,
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
  button: {},
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
      <View style={styles.question}>
        <QuestionComponent
          {...props.result.toJS()}
          question={props.question}
          onChange={onInputChange}
          onCheck={onCheck}
        />
      </View>
      <View style={styles.buttons}>
        {props.result.done ? (
          <Button mode="contained" onPress={props.onNext} style={styles.button}>
            Next
          </Button>
        ) : (
          <Button
            mode="contained"
            loading={loading}
            disabled={!props.result.changed || loading}
            style={styles.button}
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
            style={styles.button}
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
