import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import {
  Card,
  Title,
  Button,
  Surface,
  Paragraph,
  Divider,
} from "react-native-paper";
import { getCategory } from "../../../course-lib/categories";
import { Layout } from "../../Layout";
import { CATEGORY_SCREEN, COURSE_SCREEN, ParamList } from "../../Navigation";

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    paddingLeft: 16,
  },
  card: {
    margin: 16,
    width: 196,
  },
});

export function Category(props: ParamList[typeof CATEGORY_SCREEN]) {
  const navigation = useNavigation(),
    category = getCategory(props.category);

  return (
    <Layout>
      <Surface style={styles.title}>
        <Title>{category.name}</Title>
        <Divider />
        <Paragraph>{category.description}</Paragraph>
      </Surface>
      {category.courses.map((course) => (
        <Card key={course.url} style={styles.card}>
          <Card.Content>
            <Title>{course.name}</Title>
            <Button
              mode="contained"
              onPress={() =>
                navigation.navigate(COURSE_SCREEN, {
                  ...props,
                  course: course.url,
                })
              }
            >
              Start
            </Button>
          </Card.Content>
        </Card>
      ))}
    </Layout>
  );
}
