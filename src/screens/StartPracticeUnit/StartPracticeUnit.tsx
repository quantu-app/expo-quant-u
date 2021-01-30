import React, { useEffect } from "react";
import { Button, Card, Text } from "@ui-kitten/components";
import {
  ParamList,
  PRACTICE_UNIT_SCREEN,
  START_PRACTICE_UNIT_SCREEN,
} from "../../navigationConfig";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { getUnit } from "../../../course-lib/categories";
import { viewUnit } from "../../state/tracking";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  buttons: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export function StartPracticeUnit(
  props: ParamList[typeof START_PRACTICE_UNIT_SCREEN]
) {
  const navigation = useNavigation();

  useEffect(
    () => viewUnit(props.category, props.course, props.chapter, props.unit),
    [props.category, props.course, props.chapter, props.unit]
  );

  return (
    <Async
      promise={getUnit(props.category, props.course, props.chapter, props.unit)}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
      onSuccess={(unit) => (
        <Card disabled>
          <Text category="h1">{unit.name}</Text>
          <View style={styles.buttons}>
            <Button
              onPress={() =>
                navigation.navigate(PRACTICE_UNIT_SCREEN, {
                  ...props,
                  seed: Date.now(),
                })
              }
            >
              Start
            </Button>
          </View>
        </Card>
      )}
    />
  );
}
