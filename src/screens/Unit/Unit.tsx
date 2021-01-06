import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import {
  Title,
  Divider,
  Surface,
  List,
  Subheading,
  Paragraph,
} from "react-native-paper";
import { getCategory } from "../../../course-lib";
import { Layout } from "../../Layout";
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
    <Layout>
      <Surface style={styles.container}>
        <Title>{unit.name}</Title>
        <Paragraph>{unit.description}</Paragraph>
        <Divider />
        <Subheading>Quizzes</Subheading>
        <Divider />
        <List.Section>
          {unit.quizzes.map((quiz) => (
            <List.Item
              key={quiz.url}
              title={quiz.name}
              description={quiz.description}
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
    </Layout>
  );
}
