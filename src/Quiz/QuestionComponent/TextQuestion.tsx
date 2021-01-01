import { StyleSheet, View } from "react-native";
import { Surface, TextInput } from "react-native-paper";
import type { TextQuestion as TextQuestionClass } from "../../quizlib";
import { IQuestionComponentProps } from "./IQuestionComponentProps";

const styles = StyleSheet.create({
  prompt: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 16,
  },
});

export function TextQuestion(
  props: IQuestionComponentProps<string, TextQuestionClass>
) {
  return (
    <>
      <Surface style={styles.prompt}>{props.question.getPrompt()}</Surface>
      <View>
        <TextInput
          label="Answer"
          dense
          error={props.done && props.points < props.total}
          disabled={props.done}
          value={props.value || ""}
          onChangeText={props.onChange}
        />
      </View>
    </>
  );
}
