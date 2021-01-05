import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Card, Title, Button } from "react-native-paper";
import { getCategories } from "../../../course-lib/categories";
import { Layout } from "../../Layout";
import { COURSE_SCREEN } from "../../Navigation";

export function Courses() {
  const navigation = useNavigation();
  return (
    <Layout>
      <View>
        {getCategories().map((course) => (
          <Card key={course.name}>
            <Card.Content>
              <Title>{course.name}</Title>
              <Button
                onPress={() =>
                  navigation.navigate(COURSE_SCREEN, { name: course.name })
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
