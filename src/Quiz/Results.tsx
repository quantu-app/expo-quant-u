import React from "react";
import { RecordOf } from "immutable";
import { StyleSheet } from "react-native";
import { Button, Text, Layout } from "@ui-kitten/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Quiz } from "../../course-lib";
import customTheme from "../../custom-theme.json";
import { IQuizState } from "./Quiz";
import { IQuestionResult } from "./QuestionResult";
import { QuestionInput } from "./QuestionInput";

interface IResultsProps {
  quiz: Quiz;
  state: RecordOf<IQuizState>;
  onReset(): void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
  },
  result: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 16,
  },
  question: {
    flex: 11,
    marginTop: 16,
    marginBottom: 16,
  },
  points: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttons: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  resetButton: {
    marginRight: 16,
  },
});

const noop = () => null;

export function Results(props: IResultsProps) {
  return (
    <Layout style={styles.container}>
      <Layout>
        {props.state.questions.map((question, index) => {
          const questionResult = props.state.results.get(
            index
          ) as RecordOf<IQuestionResult>;

          return (
            <Layout key={index} style={styles.result}>
              <Layout style={styles.question}>
                <QuestionInput
                  result={questionResult}
                  input={question.getInput()}
                  onChange={noop}
                  onCheck={noop}
                />
              </Layout>
              <Layout style={styles.points}>
                <Text category="h1">
                  {questionResult.correct ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={32}
                      color={customTheme["color-success-100"]}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="window-close"
                      size={32}
                      color={customTheme["color-danger-100"]}
                    />
                  )}
                  {questionResult.points} / {questionResult.total}
                </Text>
              </Layout>
            </Layout>
          );
        })}
      </Layout>
      <Layout style={{ marginTop: 16 }}>
        <Text category="h1">
          Points -{" "}
          {props.state.results.reduce(
            (count, questionResult) => count + questionResult.points,
            0
          )}
          {" / "}
          {props.state.results.reduce(
            (count, questionResult) => count + questionResult.total,
            0
          )}
        </Text>
      </Layout>
      <Layout style={styles.buttons}>
        <Button
          appearance="filled"
          style={styles.resetButton}
          onPress={props.onReset}
        >
          Reset
        </Button>
      </Layout>
    </Layout>
  );
}
