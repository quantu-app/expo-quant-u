import { RecordOf } from "immutable";
import { StyleSheet, View } from "react-native";
import { Button, Divider, Title, Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IQuestionResult } from "./Question";
import { theme } from "../theme";
import { Quiz } from "../quizlib";
import { IQuizState } from "./Quiz";

interface IResultsProps<T = any> {
  quiz: Quiz;
  state: RecordOf<IQuizState<T>>;
  onReset(): void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
  },
  card: {
    marginTop: 16,
  },
  buttons: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export function Results<T = any>(props: IResultsProps<T>) {
  return (
    <View style={styles.container}>
      <View>
        {props.state.questions.map((question, index) => {
          const questionResult = props.state.results.get(
            index
          ) as IQuestionResult;

          return (
            <Card key={index} style={styles.card}>
              <Card.Content>
                {question.getPrompt()}
                <Divider />
                <View>
                  <Title>{questionResult.value}</Title>
                  {questionResult.correct ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={32}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="window-close"
                      size={32}
                      color={theme.colors.error}
                    />
                  )}
                  <Title>
                    {questionResult.result[0]} / {questionResult.result[1]}
                  </Title>
                </View>
              </Card.Content>
            </Card>
          );
        })}
      </View>
      <Card style={{ marginTop: 16 }}>
        <Card.Content>
          <Title>
            Points -{" "}
            {props.state.results.reduce(
              (count, questionResult) => count + questionResult.result[0],
              0
            )}
            {" / "}
            {props.state.results.reduce(
              (count, questionResult) => count + questionResult.result[1],
              0
            )}
          </Title>
        </Card.Content>
      </Card>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          style={{ marginTop: 16 }}
          onPress={props.onReset}
        >
          Reset
        </Button>
      </View>
    </View>
  );
}
