import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, View } from "react-native";
import { Divider, Card, List, ListItem, Text } from "@ui-kitten/components";
import { excerpt } from "../../excerpt";
import { CHAPTER_SCREEN, ParamList, UNIT_SCREEN } from "../../navigationConfig";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { getChapter } from "../../../course-lib/categories";
import { viewChapter } from "../../state/tracking";
import { useMapStateToProps } from "../../state";
import { selectUser, setSignInUpOpen } from "../../state/auth";
import { createGuard } from "../../createGaurd";

const styles = StyleSheet.create({
  units: {
    marginTop: 16,
  },
});

function InternalChapter(props: ParamList[typeof CHAPTER_SCREEN]) {
  const navigation = useNavigation();

  useEffect(() => viewChapter(props.category, props.course, props.chapter), []);

  return (
    <Async
      promise={getChapter(props.category, props.course, props.chapter)}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
      onSuccess={(chapter) => (
        <Card disabled>
          <Text category="h1">{chapter.name}</Text>
          <Divider />
          <Text>{chapter.description}</Text>
          <View style={styles.units}>
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
                        style={{ width: 64, height: 64 }}
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
          </View>
        </Card>
      )}
    />
  );
}

export const Chapter = createGuard(InternalChapter, async (props) => {
  const user = useMapStateToProps(selectUser),
    chapter = await getChapter(props.category, props.course, props.chapter);

  if (!user.extra.online || chapter.isFree === false) {
    setSignInUpOpen(true);
    throw new Error("No Access");
  }
});
