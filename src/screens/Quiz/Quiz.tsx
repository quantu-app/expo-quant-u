import React from "react";
import { XorShiftRng } from "@aicacia/rand";
import { Text, Card, Divider } from "@ui-kitten/components";
import { getCategory, IQuiz } from "../../../course-lib";
import { Quiz as QuizClass } from "../../../course-lib/quiz";
import { ParamList, QUIZ_SCREEN } from "../../navigationConfig";
import { Quiz as QuizComponent } from "../../Quiz";

export function Quiz(props: ParamList[typeof QUIZ_SCREEN]) {
  const quiz = getCategory(props.category).courseMap[props.course].chapterMap[
    props.chapter
  ].unitMap[props.unit].lessonMap[props.lesson];

  return (
    <Card disabled>
      <Text category="h1">{quiz.name}</Text>
      <Divider />
      <QuizComponent
        quiz={QuizClass.fromQuizData(quiz as IQuiz)}
        rng={XorShiftRng.fromSeed(props.seed)}
      />
    </Card>
  );
}
