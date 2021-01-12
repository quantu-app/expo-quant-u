import React from "react";
import { Checkbox, List } from "react-native-paper";
import {
  MultipleChoiceInput as MultipleChoiceInputClass,
  MultipleChoiceInputOption,
} from "../../../course-lib";
import { IQuestionInputProps } from "./IQuestionInputProps";

export function MultipleChoiceInput(
  props: IQuestionInputProps<string[], MultipleChoiceInputClass>
) {
  const isMultiple = props.input.hasMultipleAnswers(),
    selected = props.value || [];

  function onSelect(choice: MultipleChoiceInputOption) {
    const index = selected.indexOf(choice.getKey()),
      newSelected = isMultiple ? selected.slice(0) : [];

    if (index === -1) {
      newSelected.push(choice.getKey());
    } else {
      newSelected.splice(index, 1);
    }

    return props.onChange(newSelected);
  }

  function renderItem(selected: boolean, choice: MultipleChoiceInputOption) {
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
    <List.Section>
      {props.input
        .getChoices()
        .map((choice) =>
          renderItem(selected.includes(choice.getKey()), choice)
        )}
    </List.Section>
  );
}
