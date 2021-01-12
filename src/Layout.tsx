import {
  DrawerActionHelpers,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import React, { ReactNode, useState } from "react";
import app from "../app.json";
import { LARGE_WIDTH } from "./screens";
import { HOME_SCREEN, ParamList } from "./Navigation";
import { theme } from "./theme";
import { SignIn } from "./SignIn";
import { useMapStateToProps } from "./state";
import { selectUser, signOut } from "./state/auth";

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    overflowY: "scroll",
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
      DrawerActionHelpers<ParamList> = useNavigation(),
    [signInOpen, setSignInOpen] = useState(false),
    stateProps = useMapStateToProps((state) => ({
      user: selectUser(state),
    }));

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content
          title={
            <Button
              color={theme.colors.text}
              onPress={() => navigation.navigate(HOME_SCREEN)}
            >
              {app.expo.name}
            </Button>
          }
        />
        {stateProps.user
          .map(() => <Appbar.Action key={0} icon="logout" onPress={signOut} />)
          .unwrapOrElse(() => (
            <Appbar.Action icon="login" onPress={() => setSignInOpen(true)} />
          ))}
      </Appbar.Header>
      <SignIn open={signInOpen} onClose={() => setSignInOpen(false)} />
      <View style={styles.container}>
        <View style={styles.layout}>{props.children}</View>
      </View>
    </>
  );
}
