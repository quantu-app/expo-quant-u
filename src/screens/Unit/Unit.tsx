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
import { getUnit } from "../../../course-lib/categories";
import { viewUnit } from "../../state/tracking";
import { ILesson, isQuiz, IUnit } from "../../../course-lib";
import { AccessError } from "../../AccessError";
import { createGuard } from "../../createGaurd";
import { selectUser } from "../../state/auth";

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

export type IUnitProps = ParamList[typeof UNIT_SCREEN] & {
  unitObject: IUnit;
};

export const Unit = createGuard(
  selectUser,
  async (props: ParamList[typeof UNIT_SCREEN], user) => {
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
  (props: IUnitProps) => {
    const navigation = useNavigation();

    useEffect(
      () => viewUnit(props.category, props.course, props.chapter, props.unit),
      [props.category, props.course, props.chapter, props.unit]
    );

    return (
      <Card disabled>
        <Text category="h1">{props.unitObject.name}</Text>
        <Divider />
        <Text>{props.unitObject.description}</Text>
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
            Quizzes: {getLessonQuizCount(props.unitObject.lessons)}
          </Text>
          <Divider />
          <List
            data={props.unitObject.lessons}
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
                          category: props.category,
                          course: props.course,
                          chapter: props.chapter,
                          unit: props.unit,
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
                          category: props.category,
                          course: props.course,
                          chapter: props.chapter,
                          unit: props.unit,
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
    );
  }
);

function getLessonQuizCount(lessons: ILesson[]) {
  return lessons.filter(isQuiz).reduce((count) => count + 1, 0);
}
