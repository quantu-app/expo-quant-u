import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import {
  Title,
  Button,
  Surface,
  Divider,
  Subheading,
} from "react-native-paper";
import { getCategory } from "../../../course-lib";
import { Layout } from "../../Layout";
import { ParamList, QUIZ_SCREEN, UNIT_SCREEN } from "../../Navigation";

export function Unit(props: ParamList[typeof UNIT_SCREEN]) {
  const navigation = useNavigation(),
    unit = getCategory(props.category).courseMap[props.course].chapterMap[
      props.chapter
    ].unitMap[props.unit];

  return (
    <Layout>
      <Surface>
        <Title>{unit.name}</Title>
        <Divider />
        {unit.quizzes.map((quiz) => (
          <View key={quiz.url}>
            <Subheading>{quiz.name}</Subheading>
            <Button
              onPress={() =>
                navigation.navigate(QUIZ_SCREEN, {
                  ...props,
                  quiz: quiz.url,
                })
              }
            >
              Start
            </Button>
          </View>
        ))}
      </Surface>
    </Layout>
  );
}
