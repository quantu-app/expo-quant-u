import React, { useEffect } from "react";
import { Button, Card, Text } from "@ui-kitten/components";
import {
  ParamList,
  PRACTICE_UNIT_SCREEN,
  START_PRACTICE_UNIT_SCREEN,
} from "../../navigationConfig";
import { getUnit } from "../../../course-lib/categories";
import { viewUnit } from "../../state/tracking";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { selectUser } from "../../state/auth";
import { createGuard } from "../../createGaurd";
import { AccessError } from "../../AccessError";
import { IUnit } from "../../../course-lib";

const styles = StyleSheet.create({
  buttons: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export type IStartPracticeUnitProps = ParamList[typeof START_PRACTICE_UNIT_SCREEN] & {
  unitObject: IUnit;
};

export const StartPracticeUnit = createGuard(
  selectUser,
  async (props: ParamList[typeof START_PRACTICE_UNIT_SCREEN], user) => {
    const unitObject = await getUnit(
      props.category,
      props.course,
      props.chapter,
      props.unit
    );

    if (unitObject.isFree || user.extra.online) {
      return { ...props, unitObject };
    } else {
      throw new AccessError();
    }
  },
  (props: IStartPracticeUnitProps) => {
    const navigation = useNavigation();

    useEffect(
      () => viewUnit(props.category, props.course, props.chapter, props.unit),
      [props.category, props.course, props.chapter, props.unit]
    );

    return (
      <Card disabled>
        <Text category="h1">{props.unitObject.name}</Text>
        <View style={styles.buttons}>
          <Button
            onPress={() =>
              navigation.navigate(PRACTICE_UNIT_SCREEN, {
                category: props.category,
                course: props.course,
                chapter: props.chapter,
                unit: props.unit,
                seed: Date.now(),
              })
            }
          >
            Start
          </Button>
        </View>
      </Card>
    );
  }
);
