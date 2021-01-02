import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Subheading, Title, Button, Card, Surface } from "react-native-paper";
import { pascalCase } from "pascal-case";
import { Layout } from "../../Layout";
import { ParamList, QUIZ_SCREEN } from "../../Navigation";
import { sections } from "../../quizzes.json";
import { IQuizSection } from "./IQuizSection";

const styles = StyleSheet.create({
  section: { marginTop: 16 },
  title: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  buttons: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  button: {},
});

export function Quizzes() {
  const navigation: NavigationProp<ParamList> = useNavigation();

  return (
    <Layout>
      {Object.entries(sections).map(
        ([key, quizSection]: [string, IQuizSection]) => (
          <View key={key} style={styles.section}>
            <QuizSection
              navigation={navigation}
              path={[key]}
              section={quizSection}
            />
          </View>
        )
      )}
    </Layout>
  );
}

interface IQuizSectionProps {
  navigation: NavigationProp<ParamList>;
  path: string[];
  section: IQuizSection;
}

function QuizSection(props: IQuizSectionProps) {
  return (
    <>
      {Object.entries(props.section.sections).map(
        ([key, quizSection]: [string, IQuizSection]) => {
          const path = [...props.path, key];
          return (
            <View key={key}>
              <Surface style={styles.title}>
                <Title>{path.map((key) => pascalCase(key)).join(" > ")}</Title>
              </Surface>
              <QuizSection
                navigation={props.navigation}
                path={path}
                section={quizSection}
              />
            </View>
          );
        }
      )}
      {props.section.quizzes.map((quiz, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Title>{quiz.name}</Title>
            <Subheading>{quiz.tags?.join(", ")}</Subheading>
            <View style={styles.buttons}>
              <Button
                mode="contained"
                style={styles.button}
                onPress={() =>
                  props.navigation.navigate(QUIZ_SCREEN, {
                    path: props.path.join("/"),
                    index,
                  })
                }
              >
                Start
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}
    </>
  );
}
