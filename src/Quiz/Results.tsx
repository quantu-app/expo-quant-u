import React, { memo } from "react";
import { List, Map, RecordOf } from "immutable";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "@ui-kitten/components";
import { Question, Quiz } from "../../course-lib";
import { IQuestionResult } from "./QuestionResult";
import { Timer } from "./Timer";

interface IResultsProps {
  quiz: Quiz;
  questions: List<Question>;
  results: Map<string, List<RecordOf<IQuestionResult>>>;
  onReset(): void;
}

const styles = StyleSheet.create({
  buttons: {
    marginTop: 16,
    alignItems: "center",
  },
});

export const Results = memo((props: IResultsProps) => {
  return (
    <>
      <View>
        {props.results
          .map((results, id) => (
            <Text key={id}>
              {id} Total Time -{" "}
              <Timer
                timeInSeconds={
                  results.reduce(
                    (acc, result) => acc + (result.end - result.start),
                    0
                  ) / 1000
                }
              />
            </Text>
          ))
          .valueSeq()}
      </View>
      <View>
        {props.questions.map((question, index) => (
          <View key={index}>
            <View>{question.getPrompt()}</View>
            <View>
              {props.results
                .filter((results) => !!results.get(index))
                .map((results, id) => {
                  const questionResult = results.get(
                    index
                  ) as RecordOf<IQuestionResult>;

                  return (
                    <View key={id}>
                      <View>
                        <Text>{id}</Text>
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
                })
                .valueSeq()}
            </View>
          </View>
        ))}
      </View>
      <View style={styles.buttons}>
        <Button appearance="filled" onPress={props.onReset}>
          Reset
        </Button>
      </View>
    </>
  );
});
