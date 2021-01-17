import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, View } from "react-native";
import { Card, Divider, List, ListItem, Text } from "@ui-kitten/components";
import { getCategory } from "../../../course-lib/categories";
import { excerpt } from "../../excerpt";
import {
  CHAPTER_SCREEN,
  COURSE_SCREEN,
  ParamList,
} from "../../navigationConfig";

const styles = StyleSheet.create({
  chapters: {
    marginTop: 16,
  },
});

export function Course(props: ParamList[typeof COURSE_SCREEN]) {
  const navigation = useNavigation(),
    course = getCategory(props.category).courseMap[props.course];

  return (
    <Card>
      <Text category="h1">{course.name}</Text>
      <Divider />
      <Text>{course.description}</Text>
      <View style={styles.chapters}>
        <Text category="h3">Chapters</Text>
        <Divider />
        <List
          data={course.chapters}
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
                  ...props,
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
