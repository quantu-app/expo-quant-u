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
import { CHAPTER_SCREEN, ParamList, UNIT_SCREEN } from "../../Navigation";

export function Chapter(props: ParamList[typeof CHAPTER_SCREEN]) {
  const navigation = useNavigation(),
    chapter = getCategory(props.category).courseMap[props.course].chapterMap[
      props.chapter
    ];

  return (
    <Layout>
      <Surface>
        <Title>{chapter.name}</Title>
        <Divider />
        {chapter.units.map((unit) => (
          <View key={unit.url}>
            <Subheading>{unit.name}</Subheading>
            <Button
              onPress={() =>
                navigation.navigate(UNIT_SCREEN, {
                  ...props,
                  unit: unit.url,
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
