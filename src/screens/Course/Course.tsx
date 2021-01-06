import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import {
  Title,
  Button,
  Surface,
  Divider,
  Subheading,
} from "react-native-paper";
import { getCategory } from "../../../course-lib/categories";
import { Layout } from "../../Layout";
import { CHAPTER_SCREEN, COURSE_SCREEN, ParamList } from "../../Navigation";

export function Course(props: ParamList[typeof COURSE_SCREEN]) {
  const navigation = useNavigation(),
    course = getCategory(props.category).courseMap[props.course];

  return (
    <Layout>
      <Surface>
        <Title>{course.name}</Title>
        <Divider />
        {course.chapters.map((chapter) => (
          <View key={chapter.url}>
            <Subheading>{chapter.name}</Subheading>
            <Button
              onPress={() =>
                navigation.navigate(CHAPTER_SCREEN, {
                  ...props,
                  chapter: chapter.url,
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
