import React from "react";
import { RecordOf } from "immutable";
import { StyleSheet } from "react-native";
import { Icon, Layout } from "@ui-kitten/components";
import customThem from "../../custom-theme.json";
import { IQuizState } from "./Quiz";

interface IStatusProps {
  current: number;
  state: RecordOf<IQuizState>;
  onSelectQuestion(index: number): void;
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export function Status(props: IStatusProps) {
  return (
    <Layout style={styles.container}>
      {props.state.results.map((result, index) => (
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
          disabled={index === props.current || props.state.done}
          onPress={() => props.onSelectQuestion(index)}
        />
      ))}
    </Layout>
  );
}
