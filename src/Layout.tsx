import {
  DrawerActionHelpers,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import React, { ReactNode } from "react";
import app from "../app.json";
import { LARGE_WIDTH } from "./screens";
import { HOME_SCREEN, ParamList } from "./Navigation";
import { theme } from "./theme";
import { SignIn } from "./SignIn";
import { useMapStateToProps } from "./state";
import {
  selectSignInModal,
  selectUser,
  signOut,
  toggleSignInModal,
} from "./state/auth";

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    maxWidth: LARGE_WIDTH,
    paddingLeft: 16,
    paddingRight: 16,
  },
  content: {
    flex: 1,
  },
});

export interface ILayoutProps {
  children: ReactNode;
}

export function Layout(props: ILayoutProps) {
  const navigation: NavigationProp<ParamList> &
      DrawerActionHelpers<ParamList> = useNavigation(),
    { user, signInModal } = useMapStateToProps((state) => ({
      user: selectUser(state),
      signInModal: selectSignInModal(state),
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
        {user
          .map(() => <Appbar.Action key={0} icon="logout" onPress={signOut} />)
          .unwrapOrElse(() => (
            <Appbar.Action icon="login" onPress={toggleSignInModal} />
          ))}
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.content}>{props.children}</View>
        </View>
        <SignIn open={signInModal} onClose={toggleSignInModal} />
      </View>
    </>
  );
}
