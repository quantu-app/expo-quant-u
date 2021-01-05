import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Card, Title, Button } from "react-native-paper";
import { getCategory } from "../../../course-lib/categories";
import { Layout } from "../../Layout";
import { COURSE_SCREEN } from "../../Navigation";

export interface ICategoryProps {
  category: string;
}

export function Category(props: ICategoryProps) {
  const navigation = useNavigation();

  return (
    <Layout>
      <View>
        {getCategory(props.category).courses.map((course) => (
          <Card key={course.name}>
            <Card.Content>
              <Title>{course.name}</Title>
              <Button
                onPress={() =>
                  navigation.navigate(COURSE_SCREEN, {
                    category: props.category,
                    course: course.name,
                  })
                }
              >
                Start
              </Button>
            </Card.Content>
          </Card>
        ))}
      </View>
    </Layout>
  );
}
