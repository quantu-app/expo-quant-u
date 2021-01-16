import {
  DrawerActionHelpers,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { SafeAreaView, StyleSheet, View } from "react-native";
import {
  Divider,
  Icon,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import React, { ReactNode } from "react";
import { Button } from "@ui-kitten/components";
import app from "../app.json";
import { LARGE_WIDTH } from "./screens";
import { HOME_SCREEN, ParamList } from "./navigationConfig";
import { SignIn } from "./SignIn";
import { useMapStateToProps } from "./state";
import {
  selectSignInModal,
  selectUser,
  signOut,
  toggleSignInModal,
} from "./state/auth";

const styles = StyleSheet.create({
  main: { flex: 1 },
  header: {
    padding: 0,
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

export function AppLayout(props: ILayoutProps) {
  const navigation: NavigationProp<ParamList> &
      DrawerActionHelpers<ParamList> = useNavigation(),
    { user, signInModal } = useMapStateToProps((state) => ({
      user: selectUser(state),
      signInModal: selectSignInModal(state),
    }));

  return (
    <SafeAreaView style={styles.main}>
      <TopNavigation
        style={styles.header}
        alignment="start"
        title={() => (
          <Button
            appearance="ghost"
            onPress={() => navigation.navigate(HOME_SCREEN)}
          >
            {app.expo.name}
          </Button>
        )}
        accessoryLeft={(props) => (
          <TopNavigationAction
            {...props}
            onPress={() => navigation.openDrawer()}
            icon={(props) => <Icon {...props} name="menu-outline" />}
          />
        )}
        accessoryRight={
          user.isSome()
            ? (props) => (
                <TopNavigationAction
                  {...props}
                  onPress={signOut}
                  icon={(props) => <Icon {...props} name="person-outline" />}
                />
              )
            : (props) => (
                <TopNavigationAction
                  {...props}
                  onPress={toggleSignInModal}
                  icon={(props) => <Icon {...props} name="log-in-outline" />}
                />
              )
        }
      />
      <Divider />
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.content}>{props.children}</View>
        </View>
      </View>
      <SignIn open={signInModal} onClose={toggleSignInModal} />
    </SafeAreaView>
  );
}
