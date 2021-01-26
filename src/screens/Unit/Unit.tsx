import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, View } from "react-native";
import { ListItem, Divider, Card, List, Text } from "@ui-kitten/components";
import { excerpt } from "../../excerpt";
import {
  ParamList,
  START_QUIZ_SCREEN,
  UNIT_SCREEN,
} from "../../navigationConfig";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { getUnit } from "../../../course-lib/categories";

const styles = StyleSheet.create({
  lessons: {
    marginTop: 16,
  },
});

export function Unit(props: ParamList[typeof UNIT_SCREEN]) {
  const navigation = useNavigation();

  return (
    <Async
      promise={getUnit(props.category, props.course, props.chapter, props.unit)}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
      onSuccess={(unit) => (
        <Card disabled>
          <Text category="h1">{unit.name}</Text>
          <Divider />
          <Text>{unit.description}</Text>
          <View style={styles.lessons}>
            <Text category="h3">Lessons</Text>
            <Divider />
            <List
              data={unit.lessons}
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
                    navigation.navigate(START_QUIZ_SCREEN, {
                      ...props,
                      lesson: item.url,
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
