import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, View } from "react-native";
import { Card, Button, Text, Divider } from "@ui-kitten/components";
import { getCategory, getCourses } from "../../../course-lib/categories";
import { excerpt } from "../../excerpt";
import {
  CATEGORY_SCREEN,
  COURSE_SCREEN,
  ParamList,
} from "../../navigationConfig";
import { Async } from "@aicacia/async_component-react";
import { Loading } from "../../Loading";
import { JSError } from "../../JSError";
import { viewCategory } from "../../state/tracking";
import { createGuard } from "../../createGaurd";
import { selectUser, setSignInUpOpen } from "../../state/auth";
import { useMapStateToProps } from "../../state";

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

function InternalCategory(props: ParamList[typeof CATEGORY_SCREEN]) {
  const navigation = useNavigation(),
    category = getCategory(props.category);

  useEffect(() => viewCategory(props.category), []);

  return (
    <>
      <Card disabled>
        <Text category="h1">{category.name}</Text>
        <Divider />
        <Text>{category.description}</Text>
      </Card>
      <Async
        promise={getCourses(category.url)}
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
                    onPress={() => {
                      navigation.navigate(COURSE_SCREEN, {
                        ...props,
                        course: course.url,
                      });
                    }}
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

export const Category = createGuard(InternalCategory, async (props) => {
  const user = useMapStateToProps(selectUser),
    category = getCategory(props.category);

  if (!user.extra.online || category.isFree === false) {
    setSignInUpOpen(true);
    throw new Error("No Access");
  }
});
