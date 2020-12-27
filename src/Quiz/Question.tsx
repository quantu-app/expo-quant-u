import { Record, RecordOf } from "immutable";
import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Divider, Button } from "react-native-paper";
import { MaterialCommunityIcons, Foundation } from "@expo/vector-icons";
import type { Question as QuestionClass } from "../quizlib";
import { isSmallScreen } from "../screens";
import { Input } from "./Input";
import { useTheme } from "@react-navigation/native";
import { theme } from "../theme";

export interface IQuestionProps<T = any> {
  onNext(result: [number, number], explained: boolean, correct: boolean): void;
  question: QuestionClass<T>;
}

interface IQuestionState<T = any> {
  loading: boolean;
  done: boolean;
  changed: boolean;
  value?: T;
  explained: boolean;
  correct: boolean;
  result: [number, number];
}

const QuestionState = Record<IQuestionState>({
  loading: false,
  done: false,
  changed: false,
  value: null,
  explained: false,
  correct: false,
  result: [0, 0],
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  containerSmall: {
    flexDirection: "column",
  },
  content: {
    flex: 8,
    marginRight: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  contentSmall: {
    flex: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  prompt: {
    flex: 1,
    marginBottom: 16,
  },
  explanation: {
    flex: 1,
    marginBottom: 16,
  },
  answer: {
    flex: 4,
  },
  input: {
    marginTop: 16,
    marginBottom: 16,
  },
  buttons: {
    marginTop: 16,
    flexDirection: "row",
  },
  button: {
    flex: 1,
  },
});

export function Question<T = any>(props: IQuestionProps<T>) {
  const dimensions = useWindowDimensions(),
    [state, setState] = useState<RecordOf<IQuestionState<T>>>(QuestionState());

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
    props.onNext(state.result, state.explained, state.correct);
  }

  return (
    <View
      style={
        isSmallScreen(dimensions.width)
          ? styles.containerSmall
          : styles.container
      }
    >
      <View
        style={
          isSmallScreen(dimensions.width) ? styles.contentSmall : styles.content
        }
      >
        <View style={styles.prompt}>{props.question.getPrompt()}</View>
        {state.explained &&
          props.question
            .getExplanation()
            .map((explanation) => (
              <>
                <Divider />
                <View style={styles.explanation}>
                  <View>{explanation}</View>
                </View>
              </>
            ))
            .unwrapOr(null as any)}
      </View>
      <View style={styles.answer}>
        <View style={styles.input}>
          <Input
            input={props.question.getInput()}
            value={state.value}
            done={state.done}
            result={state.result}
            onChange={onInputChange}
          />
        </View>
        {state.done && state.correct && (
          <MaterialCommunityIcons
            name="check"
            size={32}
            color={theme.colors.primary}
          />
        )}
        {state.done && !state.correct && !state.explained && (
          <MaterialCommunityIcons
            name="window-close"
            size={32}
            color={theme.colors.error}
          />
        )}
        <Divider />
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
      </View>
    </View>
  );
}
