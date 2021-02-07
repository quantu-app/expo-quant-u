import React, { memo } from "react";
import { RecordOf, List } from "immutable";
import { StyleSheet, View } from "react-native";
import { Icon } from "@ui-kitten/components";
import customThem from "../../custom-theme.json";
import { IQuestionResult } from "./QuestionResult";

interface IStatusProps {
  current: number;
  results: List<RecordOf<IQuestionResult>>;
  done: boolean;
  onSelectQuestion?: (index: number) => void;
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const Status = memo((props: IStatusProps) => (
  <View style={styles.container}>
    {props.results.map((result, index) => (
      <Icon
        key={index}
        size="tiny"
        style={{
          width: 24,
          backgroundColor: result.done
            ? result.correct
              ? customThem["color-success-100"]
              : customThem["color-danger-100"]
            : undefined,
        }}
        name={
          result.done
            ? result.correct
              ? "checkmark-square-2-outline"
              : "close-square-outline"
            : "square-outline"
        }
        disabled={index === props.current || props.done}
        onPress={() => props.onSelectQuestion && props.onSelectQuestion(index)}
      />
    ))}
  </View>
));
