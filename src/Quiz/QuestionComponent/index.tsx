import {
  TextQuestion as TextQuestionClass,
  MultipleChoiceQuestion as MultipleChoiceQuestionClass,
} from "../../quizlib";
import { IQuestionComponentProps } from "./IQuestionComponentProps";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { TextQuestion } from "./TextQuestion";

export function QuestionComponent(props: IQuestionComponentProps) {
  const { question, ...rest } = props;

  if (question instanceof TextQuestionClass) {
    return <TextQuestion {...rest} question={question} />;
  } else if (question instanceof MultipleChoiceQuestionClass) {
    return <MultipleChoiceQuestion {...rest} question={question} />;
  } else {
    return null;
  }
}
