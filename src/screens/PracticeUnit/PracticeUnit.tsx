import React, { useEffect } from "react";
import { XorShiftRng } from "@aicacia/rand";
import { Card, Text, Divider } from "@ui-kitten/components";
import { Quiz as QuizClass } from "../../../course-lib/quiz";
import { ParamList, PRACTICE_UNIT_SCREEN } from "../../navigationConfig";
import { getUnit } from "../../../course-lib/categories";
import { viewUnit } from "../../state/tracking";
import { isQuiz, IUnit } from "../../../course-lib";
import { Quiz } from "../../Quiz";
import { createGuard } from "../../createGaurd";
import { selectUser } from "../../state/auth";
import { AccessError } from "../../AccessError";

export type IPracticeUnitProps = ParamList[typeof PRACTICE_UNIT_SCREEN] & {
  unitObject: IUnit;
};

export const PracticeUnit = createGuard(
  selectUser,
  async (props: ParamList[typeof PRACTICE_UNIT_SCREEN], user) => {
    const unitObject = await getUnit(
      props.category,
      props.course,
      props.chapter,
      props.unit
    );

    if (unitObject.isFree || user.extra.online) {
      return { ...props, unitObject };
    } else {
      throw new AccessError();
    }
  },
  (props: IPracticeUnitProps) => {
    useEffect(
      () => viewUnit(props.category, props.course, props.chapter, props.unit),
      [props.category, props.course, props.chapter, props.unit]
    );

    return (
      <Card disabled>
        <Text category="h1">{props.unitObject.name}</Text>
        <Divider />
        <Quiz
          quiz={QuizClass.fromQuizDatum(
            props.unitObject.lessons.filter(isQuiz)
          )}
          rng={XorShiftRng.fromSeed(props.seed)}
        />
      </Card>
    );
  }
);
