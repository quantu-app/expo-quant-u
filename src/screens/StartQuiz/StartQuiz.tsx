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
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { getLesson } from "../../../course-lib/categories";
import { viewLesson } from "../../state/tracking";

const styles = StyleSheet.create({
  buttons: {
    marginTop: 16,
    alignItems: "center",
  },
});

export function StartQuiz(props: ParamList[typeof START_QUIZ_SCREEN]) {
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
    <Async
      promise={getLesson<IQuiz>(
        props.category,
        props.course,
        props.chapter,
        props.unit,
        props.lesson
      )}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
      onSuccess={(quiz) => (
        <Card disabled>
          <Text category="h1">{quiz.name}</Text>
          <Divider />
          <Text>{quiz.description}</Text>
          <View style={styles.buttons}>
            <Button
              appearance="filled"
              onPress={() =>
                navigation.navigate(QUIZ_SCREEN, {
                  ...props,
                  seed: Date.now(),
                })
              }
            >
              Start Quiz
            </Button>
          </View>
        </Card>
      )}
    />
  );
}
