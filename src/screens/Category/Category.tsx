import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet } from "react-native";
import { Layout, Button, Text } from "@ui-kitten/components";
import { getCategory } from "../../../course-lib/categories";
import { excerpt } from "../../excerpt";
import {
  CATEGORY_SCREEN,
  COURSE_SCREEN,
  ParamList,
} from "../../navigationConfig";

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    padding: 16,
  },
  card: {
    margin: 16,
    width: 196,
  },
});

export function Category(props: ParamList[typeof CATEGORY_SCREEN]) {
  const navigation = useNavigation(),
    category = getCategory(props.category);

  return (
    <>
      <Layout style={styles.title}>
        <Text category="h1">{category.name}</Text>
        <Text>{category.description}</Text>
      </Layout>
      {category.courses.map((course) => (
        <Layout key={course.url} style={styles.card}>
          <Text category="h2">{course.name}</Text>
          {course.logo && (
            <Image
              source={course.logo}
              resizeMode="contain"
              style={{ height: 128 }}
            />
          )}
          <Text>{excerpt(course.description)}</Text>
          <Button
            appearance="filled"
            onPress={() =>
              navigation.navigate(COURSE_SCREEN, {
                ...props,
                course: course.url,
              })
            }
          >
            Start
          </Button>
        </Layout>
      ))}
    </>
  );
}
