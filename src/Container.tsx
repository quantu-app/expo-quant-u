import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import React, { ReactNode } from "react";
import { LARGE_WIDTH } from "./screens";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
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
  const windowDimensions = useWindowDimensions();

  return (
    <ScrollView style={{ height: windowDimensions.height - 60 }}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.content}>{props.children}</View>
        </View>
      </View>
    </ScrollView>
  );
}
