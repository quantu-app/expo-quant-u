import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button, Card, Divider, Text } from "@ui-kitten/components";
import { getCategory } from "../../../course-lib";
import {
  ParamList,
  START_QUIZ_SCREEN,
  QUIZ_SCREEN,
} from "../../navigationConfig";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";

const styles = StyleSheet.create({
  buttons: {
    marginTop: 16,
    alignItems: "center",
  },
});

export function StartQuiz(props: ParamList[typeof START_QUIZ_SCREEN]) {
  const navigation = useNavigation();

  return (
    <Async
      promise={getCategory(props.category).courseMap[props.course].then(
        (exports) =>
          exports.course.chapterMap[props.chapter].unitMap[props.unit]
            .lessonMap[props.lesson]
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
