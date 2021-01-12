import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import {
  Title,
  Divider,
  Surface,
  List,
  Headline,
  Paragraph,
} from "react-native-paper";
import { getCategory } from "../../../course-lib";
import { excerpt } from "../../excerpt";
import { ParamList, START_QUIZ_SCREEN, UNIT_SCREEN } from "../../Navigation";

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
    <Surface style={styles.container}>
      <Headline>{unit.name}</Headline>
      <Divider />
      <Paragraph>{unit.description}</Paragraph>
      <Title>Quizzes</Title>
      <Divider />
      <List.Section>
        {unit.quizzes.map((quiz) => (
          <List.Item
            key={quiz.url}
            title={quiz.name}
            description={excerpt(quiz.description)}
            onPress={() =>
              navigation.navigate(START_QUIZ_SCREEN, {
                ...props,
                quiz: quiz.url,
              })
            }
          />
        ))}
      </List.Section>
    </Surface>
  );
}
