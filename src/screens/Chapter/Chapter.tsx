import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet } from "react-native";
import {
  Title,
  Divider,
  Surface,
  List,
  Subheading,
  Paragraph,
} from "react-native-paper";
import { getCategory } from "../../../course-lib";
import { Layout } from "../../Layout";
import { CHAPTER_SCREEN, ParamList, UNIT_SCREEN } from "../../Navigation";

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export function Chapter(props: ParamList[typeof CHAPTER_SCREEN]) {
  const navigation = useNavigation(),
    chapter = getCategory(props.category).courseMap[props.course].chapterMap[
      props.chapter
    ];

  return (
    <Layout>
      <Surface style={styles.container}>
        <Title>{chapter.name}</Title>
        <Paragraph>{chapter.description}</Paragraph>
        <Divider />
        <Subheading>Units</Subheading>
        <Divider />
        <List.Section>
          {chapter.units.map((unit) => (
            <List.Item
              key={unit.url}
              title={unit.name}
              left={
                unit.logo &&
                (() => (
                  <Image
                    source={unit.logo}
                    style={{ width: 64 }}
                    resizeMode="contain"
                  />
                ))
              }
              description={unit.description}
              onPress={() =>
                navigation.navigate(UNIT_SCREEN, {
                  ...props,
                  unit: unit.url,
                })
              }
            />
          ))}
        </List.Section>
      </Surface>
    </Layout>
  );
}
