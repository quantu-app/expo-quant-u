import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, View } from "react-native";
import { Card, Button, Text, Divider } from "@ui-kitten/components";
import { getCategory } from "../../../course-lib/categories";
import { excerpt } from "../../excerpt";
import {
  CATEGORY_SCREEN,
  COURSE_SCREEN,
  ParamList,
} from "../../navigationConfig";
import { Async } from "@aicacia/async_component-react";
import { Loading } from "../../Loading";
import { JSError } from "../../JSError";

const styles = StyleSheet.create({
  grid: {
    marginBottom: 16,
    flex: 1,
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "wrap",
  },
  card: {
    maxWidth: 256,
    marginTop: 16,
  },
  buttons: {
    marginTop: 16,
    alignItems: "center",
  },
});

export function Category(props: ParamList[typeof CATEGORY_SCREEN]) {
  const navigation = useNavigation(),
    category = getCategory(props.category);

  return (
    <>
      <Card disabled>
        <Text category="h1">{category.name}</Text>
        <Divider />
        <Text>{category.description}</Text>
      </Card>
      <Async
        promise={Promise.all(
          category.courses.map((promise) =>
            promise.then((exports) => exports.course)
          )
        )}
        onError={(error) => <JSError error={error} />}
        onPending={() => <Loading />}
        onSuccess={(courses) => (
          <View style={styles.grid}>
            {courses.map((course) => (
              <Card key={course.url} style={styles.card}>
                <Text category="h2">{course.name}</Text>
                {course.logo && (
                  <Image
                    source={course.logo}
                    resizeMode="contain"
                    style={{ height: 128 }}
                  />
                )}
                <Text>{excerpt(course.description)}</Text>
                <View style={styles.buttons}>
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
                </View>
              </Card>
            ))}
          </View>
        )}
      />
    </>
  );
}
