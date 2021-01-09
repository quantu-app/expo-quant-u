import React from "react";
import { RecordOf } from "immutable";
import { StyleSheet, View } from "react-native";
import { Button, Title } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../theme";
import { Quiz } from "../../course-lib";
import { IQuizState } from "./Quiz";
import { IQuestionResult } from "./QuestionResult";
import { QuestionComponent } from "./QuestionComponent";

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
    <View style={styles.container}>
      <View>
        {props.state.questions.map((question, index) => {
          const questionResult = props.state.results.get(
            index
          ) as RecordOf<IQuestionResult>;

          return (
            <View key={index} style={styles.result}>
              <View style={styles.question}>
                <QuestionComponent
                  {...questionResult.toJS()}
                  question={question}
                  onChange={noop}
                  onCheck={noop}
                />
              </View>
              <View style={styles.points}>
                <Title>
                  {questionResult.correct ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={32}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="window-close"
                      size={32}
                      color={theme.colors.error}
                    />
                  )}
                  {questionResult.points} / {questionResult.total}
                </Title>
              </View>
            </View>
          );
        })}
      </View>
      <View style={{ marginTop: 16 }}>
        <Title>
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
        </Title>
      </View>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          style={styles.resetButton}
          onPress={props.onReset}
        >
          Reset
        </Button>
      </View>
    </View>
  );
}
