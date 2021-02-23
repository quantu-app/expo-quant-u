import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button, Card, Divider, Text } from "@ui-kitten/components";
import { IQuiz } from "../../../course-lib";
import {
  ParamList,
  START_QUIZ_SCREEN,
  QUIZ_SCREEN,
} from "../../navigationConfig";
import { getLesson } from "../../../course-lib/categories";
import { viewLesson } from "../../state/tracking";
import { createGuard } from "../../createGaurd";
import { selectUser } from "../../state/auth";
import { AccessError } from "../../AccessError";

const styles = StyleSheet.create({
  buttons: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export type IStartQuizProps = ParamList[typeof START_QUIZ_SCREEN] & {
  quizObject: IQuiz;
};

export const StartQuiz = createGuard(
  selectUser,
  async (props: ParamList[typeof START_QUIZ_SCREEN], user) => {
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
  (props: IStartQuizProps) => {
    const navigation = useNavigation();

    useEffect(
      () =>
        viewLesson(
          props.category,
          props.course,
          props.chapter,
          props.unit,
          props.lesson,
          "quiz"
        ),
      []
    );

    return (
      <Card disabled>
        <Text category="h1">{props.quizObject.name}</Text>
        <Divider />
        <Text>{props.quizObject.description}</Text>
        <View style={styles.buttons}>
          <Button
            appearance="filled"
            onPress={() =>
              navigation.navigate(QUIZ_SCREEN, {
                category: props.category,
                course: props.course,
                chapter: props.chapter,
                unit: props.unit,
                lesson: props.lesson,
              })
            }
          >
            Start Quiz
          </Button>
        </View>
      </Card>
    );
  }
);
