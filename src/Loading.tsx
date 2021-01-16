import React from "react";
import { StyleSheet, View } from "react-native";
import { Spinner } from "@ui-kitten/components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});

export function Loading() {
  return (
    <View style={styles.container}>
      <Spinner animating size="large" />
    </View>
  );
}
