import React from "react";
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
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";

const styles = StyleSheet.create({
  chapters: {
    marginTop: 16,
  },
});

export function Course(props: ParamList[typeof COURSE_SCREEN]) {
  const navigation = useNavigation();

  return (
    <Async
      promise={getCourse(props.category, props.course)}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
      onSuccess={(course) => (
        <Card disabled>
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
      )}
    />
  );
}
