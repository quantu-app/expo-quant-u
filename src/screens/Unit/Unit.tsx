import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { ListItem, Divider, Layout, List, Text } from "@ui-kitten/components";
import { getCategory } from "../../../course-lib";
import { excerpt } from "../../excerpt";
import {
  ParamList,
  START_QUIZ_SCREEN,
  UNIT_SCREEN,
} from "../../navigationConfig";

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export function Unit(props: ParamList[typeof UNIT_SCREEN]) {
  const navigation = useNavigation(),
    unit = getCategory(props.category).courseMap[props.course].chapterMap[
      props.chapter
    ].unitMap[props.unit];

  return (
    <Layout style={styles.container}>
      <Text category="h1">{unit.name}</Text>
      <Divider />
      <Text>{unit.description}</Text>
      <Text category="h3">Quizzes</Text>
      <Divider />
      <List
        data={unit.quizzes}
        renderItem={({ item }) => (
          <ListItem
            key={item.url}
            title={item.name}
            description={excerpt(item.description)}
            onPress={() =>
              navigation.navigate(START_QUIZ_SCREEN, {
                ...props,
                quiz: item.url,
              })
            }
          />
        )}
      />
    </Layout>
  );
}
