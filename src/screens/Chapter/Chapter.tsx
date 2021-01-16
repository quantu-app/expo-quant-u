import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet } from "react-native";
import { Divider, Layout, List, ListItem, Text } from "@ui-kitten/components";
import { getCategory } from "../../../course-lib";
import { excerpt } from "../../excerpt";
import { CHAPTER_SCREEN, ParamList, UNIT_SCREEN } from "../../navigationConfig";

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
    <Layout style={styles.container}>
      <Text category="h1">{chapter.name}</Text>
      <Divider />
      <Text>{chapter.description}</Text>
      <Text category="h3">Units</Text>
      <Divider />
      <List
        data={chapter.units}
        renderItem={({ item }) => (
          <ListItem
            key={item.url}
            title={item.name}
            accessoryLeft={
              item.logo &&
              ((props) => (
                <Image
                  {...props}
                  source={item.logo}
                  style={{ width: 64 }}
                  resizeMode="contain"
                />
              ))
            }
            description={excerpt(item.description)}
            onPress={() =>
              navigation.navigate(UNIT_SCREEN, {
                ...props,
                unit: item.url,
              })
            }
          />
        )}
      />
    </Layout>
  );
}
