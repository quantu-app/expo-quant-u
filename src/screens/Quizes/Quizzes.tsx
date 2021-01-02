import { NavigationProp, useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Subheading, Title, Button } from "react-native-paper";
import { Layout } from "../../Layout";
import { ParamList, QUIZ_SCREEN } from "../../Navigation";
import { sections } from "../../quizzes.json";
import { IQuizSection } from "./IQuizSection";

export function Quizzes() {
  const navigation: NavigationProp<ParamList> = useNavigation();

  return (
    <Layout>
      {Object.entries(sections).map(
        ([key, quizSection]: [string, IQuizSection]) => (
          <View key={key}>
            <QuizSection navigation={navigation} section={quizSection} />
          </View>
        )
      )}
    </Layout>
  );
}

interface IQuizSectionProps {
  navigation: NavigationProp<ParamList>;
  section: IQuizSection;
}

function QuizSection(props: IQuizSectionProps) {
  return (
    <>
      {Object.entries(props.section.sections).map(
        ([key, quizSection]: [string, IQuizSection]) => (
          <View key={key}>
            <QuizSection navigation={props.navigation} section={quizSection} />
          </View>
        )
      )}
      {props.section.quizzes.map((quiz, index) => (
        <View key={index}>
          <Title>{quiz.name}</Title>
          <Subheading>{quiz.tags?.join(", ")}</Subheading>
          <Button
            onPress={() =>
              props.navigation.navigate(QUIZ_SCREEN, { name: quiz.name })
            }
          >
            Start
          </Button>
        </View>
      ))}
    </>
  );
}
