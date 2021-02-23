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
import { selectUser } from "../../state/auth";
import { ICategory } from "../../../course-lib";
import { AccessError } from "../../AccessError";

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

export type ICategoryProps = ParamList[typeof CATEGORY_SCREEN] & {
  categoryObject: ICategory;
};

export const Category = createGuard(
  selectUser,
  async (props: ParamList[typeof COURSE_SCREEN], user) => {
    const categoryObject = await getCategory(props.category);

    if (categoryObject.isFree || user.extra.online) {
      return { ...props, categoryObject };
    } else {
      throw new AccessError();
    }
  },
  (props: ICategoryProps) => {
    const navigation = useNavigation();

    useEffect(() => viewCategory(props.category), []);

    return (
      <>
        <Card disabled>
          <Text category="h1">{props.categoryObject.name}</Text>
          <Divider />
          <Text>{props.categoryObject.description}</Text>
        </Card>
        <Async
          promise={getCourses(props.categoryObject.url)}
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
);
