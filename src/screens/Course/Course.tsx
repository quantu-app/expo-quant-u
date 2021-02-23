import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, View } from "react-native";
import { Card, Divider, List, ListItem, Text } from "@ui-kitten/components";
import { getCourse } from "../../../course-lib/categories";
import { excerpt } from "../../excerpt";
import {
  CHAPTER_SCREEN,
  COURSE_SCREEN,
  ParamList,
} from "../../navigationConfig";
import { viewCourse } from "../../state/tracking";
import { createGuard } from "../../createGaurd";
import { selectUser } from "../../state/auth";
import { ICourse } from "../../../course-lib";
import { AccessError } from "../../AccessError";

const styles = StyleSheet.create({
  chapters: {
    marginTop: 16,
  },
});

export type ICourseProps = ParamList[typeof COURSE_SCREEN] & {
  courseObject: ICourse;
};

export const Course = createGuard(
  selectUser,
  async (props: ParamList[typeof COURSE_SCREEN], user) => {
    const courseObject = await getCourse(props.category, props.course);

    if (courseObject.isFree || user.extra.online) {
      return { ...props, courseObject };
    } else {
      throw new AccessError();
    }
  },
  (props: ICourseProps) => {
    const navigation = useNavigation();

    useEffect(() => viewCourse(props.category, props.course), []);

    return (
      <Card disabled>
        <Text category="h1">{props.courseObject.name}</Text>
        <Divider />
        <Text>{props.courseObject.description}</Text>
        <View style={styles.chapters}>
          <Text category="h3">Chapters</Text>
          <Divider />
          <List
            data={props.courseObject.chapters}
            renderItem={({ item }) => (
              <ListItem
                key={item.url}
                title={item.name}
                accessoryLeft={
                  item.logo &&
                  (() => (
                    <Image
                      source={item.logo}
                      style={{ width: 64, height: 64 }}
                      resizeMode="contain"
                    />
                  ))
                }
                description={excerpt(item.description)}
                onPress={() =>
                  navigation.navigate(CHAPTER_SCREEN, {
                    category: props.category,
                    course: props.course,
                    chapter: item.url,
                  })
                }
              />
            )}
          />
        </View>
      </Card>
    );
  }
);
