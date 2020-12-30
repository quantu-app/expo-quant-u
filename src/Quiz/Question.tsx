import { Record, RecordOf } from "immutable";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Question as QuestionClass } from "../quizlib";
import { Input } from "./Input";
import { theme } from "../theme";

export interface IQuestionProps<T = any> {
  onNext(result: RecordOf<IQuestionResult<T>>): void;
  question: QuestionClass<T>;
}

export interface IQuestionResult<T = any> {
  done: boolean;
  changed: boolean;
  value?: T;
  explained: boolean;
  correct: boolean;
  result: [number, number];
}

const QuestionResult = Record<IQuestionResult>({
  done: false,
  changed: false,
  value: null,
  explained: false,
  correct: false,
  result: [0, 0],
});

interface IQuestionState<T = any> extends IQuestionResult<T> {
  loading: boolean;
}

const QuestionState = Record<IQuestionState>({
  ...QuestionResult().toJS(),
  loading: false,
});

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
  prompt: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  input: {
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
  const [state, setState] = useState<RecordOf<IQuestionState<T>>>(
    QuestionState()
  );

  function onInputChange(value: any) {
    setState(state.set("value", value).set("changed", true));
  }

  async function onCheck() {
    setState(state.set("loading", true));
    const result = await props.question.check(state.value as any);
    setState(
      state
        .set("loading", false)
        .set("done", true)
        .set("result", result)
        .set("correct", result[0] === result[1] && result[1] > 0)
    );
  }

  async function onExplain() {
    setState(state.set("loading", true));

    let newState = state
      .set("done", true)
      .set("explained", true)
      .set("loading", false);

    if (!newState.correct) {
      newState = newState.set("result", [
        0,
        await props.question.getInput().getTotalPoints(),
      ]);
    }

    setState(newState);
  }

  function onNext() {
    props.onNext(QuestionResult(state.toJS()));
  }

  return (
    <>
      <Surface style={styles.prompt}>{props.question.getPrompt()}</Surface>
      <View style={styles.input}>
        <Input
          input={props.question.getInput()}
          value={state.value}
          done={state.done}
          result={state.result}
          onChange={onInputChange}
        />
      </View>
      <View style={styles.buttons}>
        {state.done ? (
          <Button mode="contained" onPress={onNext} style={styles.button}>
            Next
          </Button>
        ) : (
          <Button
            mode="contained"
            loading={state.loading}
            disabled={!state.changed || state.loading}
            style={styles.button}
            onPress={onCheck}
          >
            Check
          </Button>
        )}
        {props.question.getExplanation().isSome() && (
          <Button
            mode="outlined"
            loading={state.loading}
            disabled={state.explained || state.loading}
            style={styles.button}
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
            color={theme.colors.primary}
          />
        )}
        {state.done && !state.correct && (
          <MaterialCommunityIcons
            name="window-close"
            size={32}
            color={theme.colors.error}
          />
        )}
      </View>
      {state.explained &&
        props.question
          .getExplanation()
          .map((explanation) => (
            <Surface key={0} style={styles.explanation}>
              {explanation}
            </Surface>
          ))
          .unwrapOr(null as any)}
    </>
  );
}
