import { View } from "react-native";
import { Checkbox, List } from "react-native-paper";
import {
  MultipleChoiceQuestion as MultipleChoiceQuestionClass,
  MultipleChoiceQuestionOption,
} from "../../quizlib";
import { IQuestionComponentProps } from "./IQuestionComponentProps";

export function MultipleChoiceQuestion(
  props: IQuestionComponentProps<string[], MultipleChoiceQuestionClass>
) {
  const isMultiple = props.question.hasMultipleAnswers(),
    selected = props.value || [];

  function onSelect(choice: MultipleChoiceQuestionOption) {
    const index = selected.indexOf(choice.getKey()),
      newSelected = isMultiple ? selected.slice(0) : [];

    if (index === -1) {
      newSelected.push(choice.getKey());
    } else {
      newSelected.splice(index, 1);
    }

    return props.onChange(newSelected);
  }

  function renderItem(selected: boolean, choice: MultipleChoiceQuestionOption) {
    const checkAnswerQuestionElement = (
      <Checkbox
        status={
          (props.done && choice.isCorrect()) || selected
            ? "checked"
            : "unchecked"
        }
        disabled={props.done}
        onPress={() => onSelect(choice)}
      />
    );

    if (props.done) {
      if (choice.isCorrect()) {
        return (
          <List.Item
            key={choice.getKey()}
            left={() => checkAnswerQuestionElement}
            title={choice.getChildren()}
          />
        );
      } else if (selected) {
        return (
          <List.Item
            key={choice.getKey()}
            left={() => checkAnswerQuestionElement}
            title={choice.getChildren()}
          />
        );
      } else {
        return (
          <List.Item
            key={choice.getKey()}
            left={() => checkAnswerQuestionElement}
            title={choice.getChildren()}
          />
        );
      }
    } else {
      return (
        <List.Item
          key={choice.getKey()}
          left={() => checkAnswerQuestionElement}
          title={choice.getChildren()}
        />
      );
    }
  }

  return (
    <>
      <View>{props.question.getPrompt()}</View>
      <View>
        <List.Section>
          {props.question
            .getChoices()
            .map((choice) =>
              renderItem(selected.includes(choice.getKey()), choice)
            )}
        </List.Section>
      </View>
    </>
  );
}
