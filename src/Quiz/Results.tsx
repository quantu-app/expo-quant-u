import React, { memo } from "react";
import { List, RecordOf } from "immutable";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "@ui-kitten/components";
import { Question, Quiz } from "../../course-lib";
import { IQuestionResult } from "./QuestionResult";
import { QuestionInput } from "./QuestionInput";
import { Timer } from "./Timer";

interface IResultsProps {
  quiz: Quiz;
  questions: List<Question>;
  results: List<RecordOf<IQuestionResult>>;
  start: number;
  end: number;
  onReset(): void;
}

const styles = StyleSheet.create({
  buttons: {
    marginTop: 16,
    alignItems: "center",
  },
});

const noop = () => null;

export const Results = memo((props: IResultsProps) => {
  return (
    <>
      <View>
        <Text>
          Total Quiz Time -{" "}
          <Timer timeInSeconds={(props.end - props.start) / 1000} />
        </Text>
        <Text>
          Total Time -{" "}
          <Timer
            timeInSeconds={
              props.results.reduce(
                (acc, result) => acc + (result.end - result.start),
                0
              ) / 1000
            }
          />
        </Text>
      </View>
      <View>
        {props.questions.map((question, index) => {
          const questionResult = props.results.get(
            index
          ) as RecordOf<IQuestionResult>;

          return (
            <View key={index}>
              <View>
                <QuestionInput
                  result={questionResult}
                  input={question.getInput()}
                  onChange={noop}
                  onCheck={noop}
                />
              </View>
              <View>
                <Text>
                  {questionResult.points} / {questionResult.total}
                </Text>
              </View>
              <View>
                <Timer
                  timeInSeconds={
                    (questionResult.end - questionResult.start) / 1000
                  }
                />
              </View>
            </View>
          );
        })}
      </View>
      <View>
        <Text>
          Points -{" "}
          {props.results.reduce(
            (count, questionResult) => count + questionResult.points,
            0
          )}
          {" / "}
          {props.results.reduce(
            (count, questionResult) => count + questionResult.total,
            0
          )}
        </Text>
      </View>
      <View style={styles.buttons}>
        <Button appearance="filled" onPress={props.onReset}>
          Reset
        </Button>
      </View>
    </>
  );
});
