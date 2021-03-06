export {
  IConfigSchema,
  IQuestionGenerator,
  IQuestionGeneratorFn,
  createSchema,
  createQuestionGenerator,
  isQuestionGenerator,
  MultipleChoiceInput,
  MultipleChoiceInputOption,
  Question,
  QuestionInput,
  Quiz,
  TextInput,
  addQuestionGenerator,
  getQuestionGenerator,
  hasQuestionGenerator,
} from "./quiz";
export {
  ICategory,
  IQuiz,
  IQuizItem,
  IChapter,
  ICourse,
  ILesson,
  IUnit,
  isQuiz,
} from "./interfaces";
export {
  getCategories,
  addCategory,
  hasCategory,
  getCategory,
} from "./categories";
