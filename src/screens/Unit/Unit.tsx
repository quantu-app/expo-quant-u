import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, View } from "react-native";
import {
  ListItem,
  Divider,
  Card,
  List,
  Text,
  Button,
} from "@ui-kitten/components";
import { excerpt } from "../../excerpt";
import {
  ParamList,
  START_CHALLENGE_QUIZ_SCREEN,
  START_PRACTICE_UNIT_SCREEN,
  START_QUIZ_SCREEN,
  UNIT_SCREEN,
} from "../../navigationConfig";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { getUnit } from "../../../course-lib/categories";
import { viewUnit } from "../../state/tracking";
import { ILesson, isQuiz } from "../../../course-lib";
import { useMapStateToProps } from "../../state";
import { createGuard } from "../../createGaurd";
import { selectUser, setSignInUpOpen } from "../../state/auth";

const styles = StyleSheet.create({
  lessons: {
    marginTop: 16,
  },
  buttons: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  quizButtons: {
    flexDirection: "row",
  },
});

export function InternalUnit(props: ParamList[typeof UNIT_SCREEN]) {
  const navigation = useNavigation();

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
          <Text>{unit.description}</Text>
          <View style={styles.buttons}>
            <Button
              onPress={() =>
                navigation.navigate(START_PRACTICE_UNIT_SCREEN, props)
              }
            >
              Practice
            </Button>
          </View>
          <View style={styles.lessons}>
            <Text category="h3">Lessons</Text>
            <Text category="h6">
              Quizzes: {getLessonQuizCount(unit.lessons)}
            </Text>
            <Divider />
            <List
              data={unit.lessons}
              renderItem={({ item }) => (
                <ListItem
                  key={item.url}
                  title={item.name}
                  disabled
                  accessoryLeft={
                    item.logo &&
                    ((props) => (
                      <Image
                        {...props}
                        source={item.logo}
                        style={{ width: 64, height: 64 }}
                        resizeMode="contain"
                      />
                    ))
                  }
                  accessoryRight={(_accessoryProps) => (
                    <View style={styles.quizButtons}>
                      <Button
                        size="small"
                        onPress={() =>
                          navigation.navigate(START_CHALLENGE_QUIZ_SCREEN, {
                            ...props,
                            lesson: item.url,
                            seed: Date.now(),
                            id: Math.random().toString(36).slice(2),
                          })
                        }
                      >
                        Challenge
                      </Button>
                      <Button
                        size="small"
                        onPress={() =>
                          navigation.navigate(START_QUIZ_SCREEN, {
                            ...props,
                            lesson: item.url,
                            seed: Date.now(),
                          })
                        }
                      >
                        Start
                      </Button>
                    </View>
                  )}
                  description={excerpt(item.description)}
                />
              )}
            />
          </View>
        </Card>
      )}
    />
  );
}

function getLessonQuizCount(lessons: ILesson[]) {
  return lessons.filter(isQuiz).reduce((count) => count + 1, 0);
}

export const Unit = createGuard(InternalUnit, async (props) => {
  const user = useMapStateToProps(selectUser),
    unit = await getUnit(
      props.category,
      props.course,
      props.chapter,
      props.unit
    );

  if (!user.extra.online || unit.isFree === false) {
    setSignInUpOpen(true);
    throw new Error("No Access");
  }
});
