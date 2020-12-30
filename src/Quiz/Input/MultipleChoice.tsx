import { Checkbox, List } from "react-native-paper";
import type {
  MultipleChoice as MultipleChoiceClass,
  Choice,
} from "../../quizlib";
import { IInputState } from "./IInputState";

export interface IMultipleChoiceProps extends IInputState<string[]> {
  multipleChoice: MultipleChoiceClass;
}

export function MultipleChoice(props: IMultipleChoiceProps) {
  const isMultiple = props.multipleChoice.hasMultipleAnswers(),
    selected = props.value || [];

  function onSelect(choice: Choice) {
    const index = selected.indexOf(choice.getKey()),
      newSelected = isMultiple ? selected.slice(0) : [];

    if (index === -1) {
      newSelected.push(choice.getKey());
    } else {
      newSelected.splice(index, 1);
    }

    return props.onChange(newSelected);
  }

  function renderItem(selected: boolean, choice: Choice) {
    const checkAnswerInputElement = (
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
            left={() => checkAnswerInputElement}
            title={choice.getChildren()}
          />
        );
      } else if (selected) {
        return (
          <List.Item
            key={choice.getKey()}
            left={() => checkAnswerInputElement}
            title={choice.getChildren()}
          />
        );
      } else {
        return (
          <List.Item
            key={choice.getKey()}
            left={() => checkAnswerInputElement}
            title={choice.getChildren()}
          />
        );
      }
    } else {
      return (
        <List.Item
          key={choice.getKey()}
          left={() => checkAnswerInputElement}
          title={choice.getChildren()}
        />
      );
    }
  }

  return (
    <List.Section>
      {props.multipleChoice
        .getChoices()
        .map((choice) =>
          renderItem(selected.includes(choice.getKey()), choice)
        )}
    </List.Section>
  );
}
