import { QuestionInput } from "../../../course-lib";
import { IQuestionResult } from "../QuestionResult";

export interface IQuestionInputProps<
  T = any,
  I extends QuestionInput<T> = QuestionInput<T>
> extends IQuestionResult<T> {
  input: I;
  onChange(value: T): void;
  onCheck(): void;
}
