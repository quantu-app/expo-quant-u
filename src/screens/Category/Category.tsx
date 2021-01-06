import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import {
  Title,
  Button,
  Surface,
  Subheading,
  Divider,
} from "react-native-paper";
import { getCategory } from "../../../course-lib/categories";
import { Layout } from "../../Layout";
import { CATEGORY_SCREEN, COURSE_SCREEN, ParamList } from "../../Navigation";

export function Category(props: ParamList[typeof CATEGORY_SCREEN]) {
  const navigation = useNavigation(),
    category = getCategory(props.category);

  return (
    <Layout>
      <Surface>
        <Title>{category.name}</Title>
        <Divider />
        {category.courses.map((course) => (
          <View key={course.url}>
            <Subheading>{course.name}</Subheading>
            <Button
              onPress={() =>
                navigation.navigate(COURSE_SCREEN, {
                  ...props,
                  course: course.url,
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
