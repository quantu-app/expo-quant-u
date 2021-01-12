import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet } from "react-native";
import {
  Title,
  Divider,
  Surface,
  List,
  Paragraph,
  Headline,
} from "react-native-paper";
import { getCategory } from "../../../course-lib/categories";
import { excerpt } from "../../excerpt";
import { CHAPTER_SCREEN, COURSE_SCREEN, ParamList } from "../../Navigation";

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
  },
});

export function Course(props: ParamList[typeof COURSE_SCREEN]) {
  const navigation = useNavigation(),
    course = getCategory(props.category).courseMap[props.course];

  return (
    <Surface style={styles.container}>
      <Headline>{course.name}</Headline>
      <Divider />
      <Paragraph>{course.description}</Paragraph>
      <Title>Chapters</Title>
      <Divider />
      <List.Section>
        {course.chapters.map((chapter) => (
          <List.Item
            key={course.url}
            title={chapter.name}
            left={
              chapter.logo &&
              (() => (
                <Image
                  source={chapter.logo}
                  style={{ width: 64 }}
                  resizeMode="contain"
                />
              ))
            }
            description={excerpt(chapter.description)}
            onPress={() =>
              navigation.navigate(CHAPTER_SCREEN, {
                ...props,
                chapter: chapter.url,
              })
            }
          />
        ))}
      </List.Section>
    </Surface>
  );
}
