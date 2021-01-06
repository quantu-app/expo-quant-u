import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Card, Title, Button } from "react-native-paper";
import { getCategories } from "../../../course-lib/categories";
import { Layout } from "../../Layout";
import { CATEGORY_SCREEN } from "../../Navigation";

export function Categories() {
  const navigation = useNavigation();

  return (
    <Layout>
      <View>
        {getCategories().map((category) => (
          <Card key={category.url}>
            <Card.Content>
              <Title>{category.name}</Title>
              <Button
                onPress={() =>
                  navigation.navigate(CATEGORY_SCREEN, {
                    category: category.url,
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
