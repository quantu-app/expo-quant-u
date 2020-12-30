export type IQuestionConfigType = "string" | "boolean" | "integer" | "float";

export type IQuestionConfig<T extends Record<string, any>> = Record<
  keyof T,
  IQuestionConfigType
>;
