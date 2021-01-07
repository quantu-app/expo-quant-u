import { RecordOf } from "immutable";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { theme } from "../theme";
import { IQuizState } from "./Quiz";

interface IStatusProps {
  current: number;
  state: RecordOf<IQuizState>;
  onSelectQuestion(index: number): void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export function Status(props: IStatusProps) {
  return (
    <View style={styles.container}>
      {props.state.results.map((result, index) => (
        <IconButton
          color={
            result.done
              ? result.correct
                ? theme.colors.primary
                : theme.colors.error
              : undefined
          }
          disabled={index === props.current || props.state.done}
          icon={
            result.done
              ? result.correct
                ? "checkbox-marked"
                : "checkbox-blank-off-outline"
              : "checkbox-blank-outline"
          }
          key={index}
          onPress={() => props.onSelectQuestion(index)}
        />
      ))}
    </View>
  );
}
