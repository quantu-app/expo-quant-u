import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, View } from "react-native";
import { Divider, Card, List, ListItem, Text } from "@ui-kitten/components";
import { excerpt } from "../../excerpt";
import { CHAPTER_SCREEN, ParamList, UNIT_SCREEN } from "../../navigationConfig";
import { getChapter } from "../../../course-lib/categories";
import { viewChapter } from "../../state/tracking";
import { createGuard } from "../../createGaurd";
import { selectUser } from "../../state/auth";
import { IChapter } from "../../../course-lib";
import { AccessError } from "../../AccessError";

const styles = StyleSheet.create({
  units: {
    marginTop: 16,
  },
});

export type IChapterProps = ParamList[typeof CHAPTER_SCREEN] & {
  chapterObject: IChapter;
};

export const Chapter = createGuard(
  selectUser,
  async (props: ParamList[typeof CHAPTER_SCREEN], user) => {
    const chapterObject = await getChapter(
      props.category,
      props.course,
      props.chapter
    );

    if (chapterObject.isFree || user.extra.online) {
      return { ...props, chapterObject };
    } else {
      throw new AccessError();
    }
  },
  (props: IChapterProps) => {
    const navigation = useNavigation();

    useEffect(
      () => viewChapter(props.category, props.course, props.chapter),
      []
    );

    return (
      <Card disabled>
        <Text category="h1">{props.chapterObject.name}</Text>
        <Divider />
        <Text>{props.chapterObject.description}</Text>
        <View style={styles.units}>
          <Text category="h3">Units</Text>
          <Divider />
          <List
            data={props.chapterObject.units}
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
                      style={{ width: 64, height: 64 }}
                      resizeMode="contain"
                    />
                  ))
                }
                description={excerpt(item.description)}
                onPress={() =>
                  navigation.navigate(UNIT_SCREEN, {
                    category: props.category,
                    course: props.course,
                    chapter: props.chapter,
                    unit: item.url,
                  })
                }
              />
            )}
          />
        </View>
      </Card>
    );
  }
);
