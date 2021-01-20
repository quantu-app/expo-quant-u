import React, { memo } from "react";
import { RecordOf } from "immutable";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "@ui-kitten/components";
import { Quiz } from "../../course-lib";
import { IQuizState } from "./Quiz";
import { IQuestionResult } from "./QuestionResult";
import { QuestionInput } from "./QuestionInput";
import { Timer } from "./Timer";

interface IResultsProps {
  quiz: Quiz;
  state: RecordOf<IQuizState>;
  onReset(): void;
}

const styles = StyleSheet.create({
  buttons: {
    marginTop: 16,
    alignItems: "center",
  },
});

const noop = () => null;

export const Results = memo((props: IResultsProps) => (
  <>
    <View>
      <Text>
        Total Time -{" "}
        <Timer timeInSeconds={(props.state.end - props.state.start) / 1000} />
      </Text>
    </View>
    <View>
      {props.state.questions.map((question, index) => {
        const questionResult = props.state.results.get(
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
    </View>
    <View style={styles.buttons}>
      <Button appearance="filled" onPress={props.onReset}>
        Reset
      </Button>
    </View>
  </>
));
