import {
  DrawerActionHelpers,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import { ReactNode, useState } from "react";
import app from "../app.json";
import { LARGE_WIDTH } from "./screens";
import { ParamList } from "./Navigation";
import { theme } from "./theme";
import { SignIn } from "./SignIn";

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
      DrawerActionHelpers<ParamList> = useNavigation(),
    [signInOpen, setSignInOpen] = useState(false),
    [user, setUser] = useState(null);

  function onSignOut() {
    setUser(null);
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title={app.expo.name} />
        {user ? (
          <Appbar.Action
            icon="logout"
            color={theme.colors.surface}
            onPress={onSignOut}
          />
        ) : (
          <Appbar.Action
            icon="login"
            color={theme.colors.surface}
            onPress={() => setSignInOpen(true)}
          />
        )}
      </Appbar.Header>
      <SignIn
        open={signInOpen}
        onClose={() => setSignInOpen(true)}
        onSignIn={() => setUser(null)}
      />
      <View style={styles.container}>
        <View style={styles.layout}>{props.children}</View>
      </View>
    </>
  );
}
