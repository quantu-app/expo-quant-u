import React from "react";
import { XorShiftRng } from "@aicacia/rand";
import { Text, Card, Divider } from "@ui-kitten/components";
import { IQuiz } from "../../../course-lib";
import { Quiz as QuizClass } from "../../../course-lib/quiz";
import { ParamList, QUIZ_SCREEN } from "../../navigationConfig";
import { FixedQuiz } from "../../Quiz";
import { getLesson } from "../../../course-lib/categories";
import { AccessError } from "../../AccessError";
import { createGuard } from "../../createGaurd";
import { selectUser } from "../../state/auth";

export type IQuizProps = ParamList[typeof QUIZ_SCREEN] & {
  quizObject: IQuiz;
};

export const Quiz = createGuard(
  selectUser,
  async (props: ParamList[typeof QUIZ_SCREEN], user) => {
    const quizObject = await getLesson<IQuiz>(
      props.category,
      props.course,
      props.chapter,
      props.unit,
      props.lesson
    );

    if (quizObject.isFree || user.extra.online) {
      return { ...props, quizObject };
    } else {
      throw new AccessError();
    }
  },
  (props: IQuizProps) => (
    <Card disabled>
      <Text category="h1">{props.quizObject.name}</Text>
      <Divider />
      <FixedQuiz
        quiz={QuizClass.fromQuizData(props.quizObject as IQuiz)}
        rng={XorShiftRng.fromSeed(props.seed)}
      />
    </Card>
  )
);
