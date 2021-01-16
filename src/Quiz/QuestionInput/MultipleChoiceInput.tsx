import React from "react";
import { CheckBox, List, ListItem } from "@ui-kitten/components";
import {
  MultipleChoiceInput as MultipleChoiceInputClass,
  MultipleChoiceInputOption,
} from "../../../course-lib";
import { IQuestionInputProps } from "./IQuestionInputProps";

export function MultipleChoiceInput(
  props: IQuestionInputProps<string[], MultipleChoiceInputClass>
) {
  const isMultiple = props.input.hasMultipleAnswers(),
    selected = props.result.value || [];

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

  return (
    <List
      data={props.input.getChoices()}
      renderItem={({ item }) => (
        <ListItem
          key={item.getKey()}
          accessoryLeft={() => (
            <CheckBox
              status={
                (props.result.done && item.isCorrect()) || selected
                  ? "checked"
                  : "unchecked"
              }
              disabled={props.result.done}
              onPress={() => onSelect(item)}
            />
          )}
          title={item.getChildren()}
        />
      )}
    />
  );
}
