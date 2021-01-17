import { StyleSheet, View } from "react-native";
import React, { ReactNode } from "react";
import { LARGE_WIDTH } from "./screens";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    maxWidth: LARGE_WIDTH,
    padding: 16,
  },
  content: {
    flex: 1,
  },
});

export interface IContainerProps {
  children: ReactNode;
}

export function Container(props: IContainerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.content}>{props.children}</View>
      </View>
    </View>
  );
}
