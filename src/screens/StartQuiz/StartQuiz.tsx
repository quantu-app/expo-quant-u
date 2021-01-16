import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Button, Layout, Text } from "@ui-kitten/components";
import { getCategory } from "../../../course-lib";
import {
  ParamList,
  START_QUIZ_SCREEN,
  QUIZ_SCREEN,
} from "../../navigationConfig";

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
  },
  buttons: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export function StartQuiz(props: ParamList[typeof START_QUIZ_SCREEN]) {
  const quiz = getCategory(props.category).courseMap[props.course].chapterMap[
      props.chapter
    ].unitMap[props.unit].quizMap[props.quiz],
    navigation = useNavigation();

  return (
    <Layout style={styles.container}>
      <Text category="h1">{quiz.name}</Text>
      <Text>{quiz.description}</Text>
      <Layout style={styles.buttons}>
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
      </Layout>
    </Layout>
  );
}
