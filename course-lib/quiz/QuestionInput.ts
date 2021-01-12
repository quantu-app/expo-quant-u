export abstract class QuestionInput<T = any> {
  abstract getTotalPoints(): Promise<number>;
  abstract checkAnswer(answer?: T): Promise<number>;
}
