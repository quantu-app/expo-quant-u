import { StyleSheet, View } from "react-native";
import { ReactNode } from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  layout: {
    flex: 1,
    maxWidth: 1080,
  },
});

export interface ILayoutProps {
  children: ReactNode;
}

export function Layout(props: ILayoutProps) {
  return (
    <View style={styles.container}>
      <View style={styles.layout}>{props.children}</View>
    </View>
  );
}
