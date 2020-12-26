import {
  DrawerActionHelpers,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { ReactNode } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Appbar } from "react-native-paper";
import app from "../app.json";
import { isLargeScreen } from "./isLargeScreen";
import { ParamList } from "./Navigation";

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
  const navigation: NavigationProp<ParamList> &
    DrawerActionHelpers<ParamList> = useNavigation();

  return (
    <>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title={app.expo.name} />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.layout}>{props.children}</View>
      </View>
    </>
  );
}
