import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Title, Button, Surface, Paragraph } from "react-native-paper";
import { getCategory } from "../../../course-lib";
import { Layout } from "../../Layout";
import { ParamList, START_QUIZ_SCREEN, QUIZ_SCREEN } from "../../Navigation";

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
  },
});

export function StartQuiz(props: ParamList[typeof START_QUIZ_SCREEN]) {
  const quiz = getCategory(props.category).courseMap[props.course].chapterMap[
      props.chapter
    ].unitMap[props.unit].quizMap[props.quiz],
    navigation = useNavigation();

  return (
    <Layout>
      <Surface style={styles.container}>
        <Title>{quiz.name}</Title>
        <Paragraph>{quiz.description}</Paragraph>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate(QUIZ_SCREEN, {
              ...props,
              seed: Date.now(),
            })
          }
        >
          Start Quiz
        </Button>
      </Surface>
    </Layout>
  );
}
