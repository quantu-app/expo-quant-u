import { XorShiftRng } from "@aicacia/rand";
import { StyleSheet } from "react-native";
import { Title, Surface, Divider } from "react-native-paper";
import { getCategory } from "../../../course-lib";
import { Quiz as QuizClass } from "../../../course-lib/quiz";
import { Layout } from "../../Layout";
import { ParamList, QUIZ_SCREEN } from "../../Navigation";
import { Quiz as QuizComponent } from "../../Quiz";

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
  },
});

export function Quiz(props: ParamList[typeof QUIZ_SCREEN]) {
  const quiz = getCategory(props.category).courseMap[props.course].chapterMap[
    props.chapter
  ].unitMap[props.unit].quizMap[props.quiz];

  return (
    <Layout>
      <Surface style={styles.container}>
        <Title>{quiz.name}</Title>
        <Divider />
        <QuizComponent
          quiz={QuizClass.fromQuizData(quiz)}
          rng={XorShiftRng.fromSeed(props.seed)}
        />
      </Surface>
    </Layout>
  );
}
