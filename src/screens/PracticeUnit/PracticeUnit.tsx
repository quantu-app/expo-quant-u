import React, { useEffect } from "react";
import { XorShiftRng } from "@aicacia/rand";
import { Card, Text, Divider } from "@ui-kitten/components";
import { Quiz as QuizClass } from "../../../course-lib/quiz";
import { ParamList, PRACTICE_UNIT_SCREEN } from "../../navigationConfig";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { getUnit } from "../../../course-lib/categories";
import { viewUnit } from "../../state/tracking";
import { isQuiz } from "../../../course-lib";
import { Quiz } from "../../Quiz";

export function PracticeUnit(props: ParamList[typeof PRACTICE_UNIT_SCREEN]) {
  useEffect(
    () => viewUnit(props.category, props.course, props.chapter, props.unit),
    [props.category, props.course, props.chapter, props.unit]
  );

  return (
    <Async
      promise={getUnit(props.category, props.course, props.chapter, props.unit)}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
      onSuccess={(unit) => (
        <Card disabled>
          <Text category="h1">{unit.name}</Text>
          <Divider />
          <Quiz
            quiz={QuizClass.fromQuizDatum(unit.lessons.filter(isQuiz))}
            rng={XorShiftRng.fromSeed(props.seed)}
          />
        </Card>
      )}
    />
  );
}
