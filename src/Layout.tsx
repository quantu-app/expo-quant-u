import {
  DrawerActionHelpers,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import app from "../app.json";
import { LARGE_WIDTH } from "./screens";
import { ParamList } from "./Navigation";
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
    maxWidth: LARGE_WIDTH,
    paddingLeft: 16,
    paddingRight: 16,
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
