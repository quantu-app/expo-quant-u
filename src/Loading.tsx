import React from "react";
import { StyleSheet, View } from "react-native";
import { Spinner } from "@ui-kitten/components";
import { EvaSize } from "@ui-kitten/components/devsupport";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});

export interface ILoadingProps {
  size?: EvaSize;
}

export function Loading(props: ILoadingProps) {
  return (
    <View style={styles.container}>
      <Spinner animating size={props.size || "large"} />
    </View>
  );
}
