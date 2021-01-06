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
import { getCategory } from "../../../course-lib/categories";
import { Layout } from "../../Layout";
import { CHAPTER_SCREEN, COURSE_SCREEN, ParamList } from "../../Navigation";

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export function Course(props: ParamList[typeof COURSE_SCREEN]) {
  const navigation = useNavigation(),
    course = getCategory(props.category).courseMap[props.course];

  return (
    <Layout>
      <Surface style={styles.container}>
        <Title>{course.name}</Title>
        <Paragraph>{course.description}</Paragraph>
        <Divider />
        <Subheading>Chapters</Subheading>
        <Divider />
        <List.Section>
          {course.chapters.map((chapter) => (
            <List.Item
              key={course.url}
              title={chapter.name}
              description={chapter.description}
              onPress={() =>
                navigation.navigate(CHAPTER_SCREEN, {
                  ...props,
                  chapter: chapter.url,
                })
              }
            />
          ))}
        </List.Section>
      </Surface>
    </Layout>
  );
}
