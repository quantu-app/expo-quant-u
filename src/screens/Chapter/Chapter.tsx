import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet } from "react-native";
import {
  Title,
  Divider,
  Surface,
  List,
  Paragraph,
  Headline,
} from "react-native-paper";
import { getCategory } from "../../../course-lib";
import { excerpt } from "../../excerpt";
import { CHAPTER_SCREEN, ParamList, UNIT_SCREEN } from "../../Navigation";

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
  },
});

export function Chapter(props: ParamList[typeof CHAPTER_SCREEN]) {
  const navigation = useNavigation(),
    chapter = getCategory(props.category).courseMap[props.course].chapterMap[
      props.chapter
    ];

  return (
    <Surface style={styles.container}>
      <Headline>{chapter.name}</Headline>
      <Divider />
      <Paragraph>{chapter.description}</Paragraph>
      <Title>Units</Title>
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
            description={excerpt(unit.description)}
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
  );
}
