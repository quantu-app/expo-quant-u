import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItem,
  DrawerContentOptions,
} from "@react-navigation/drawer";
import { HomeScreen } from "./screens/Home/HomeScreen";
import { QuizzesScreen } from "./screens/Quizes/QuizzesScreen";
import { QuizScreen } from "./screens/Quiz/QuizScreen";
import { StyleSheet, View, Platform } from "react-native";
import { Drawer } from "react-native-paper";
import { MaterialCommunityIcons, Foundation } from "@expo/vector-icons";
import { Loading } from "./Loading";

export const HOME_SCREEN = "Home",
  QUIZZES_SCREEN = "Quizzes",
  QUIZ_SCREEN = "Quiz",
  DEFAULT_SCREEN = QUIZZES_SCREEN;

export type ParamList = {
  [HOME_SCREEN]: undefined;
  [QUIZZES_SCREEN]: undefined;
  [QUIZ_SCREEN]: { path: string; index: number };
};

// TODO: remove after not hosting on github pages
export const DISABLE_LINKING =
  "electron" in process.versions || Platform.OS === "web";

export const linking = {
  prefixes: [
    "https://quant-u.com",
    "quant-u://",
    "https://quantu-app.github.io/expo-quant-u",
  ],
  config: {
    screens: {
      [HOME_SCREEN]: "",
      [QUIZZES_SCREEN]: "quizzes",
      [QUIZ_SCREEN]: "quizzes/:path/:index",
    },
  },
};

export const DrawerNavigator = createDrawerNavigator<ParamList>();

export function Navigation() {
  return (
    <NavigationContainer
      linking={DISABLE_LINKING ? undefined : linking}
      fallback={<Loading />}
    >
      <AppDrawer />
    </NavigationContainer>
  );
}

export function AppDrawer() {
  return (
    <DrawerNavigator.Navigator
      initialRouteName={DEFAULT_SCREEN}
      drawerType="front"
      drawerContent={DrawerContent}
    >
      <DrawerNavigator.Screen name={HOME_SCREEN} component={HomeScreen} />
      <DrawerNavigator.Screen name={QUIZZES_SCREEN} component={QuizzesScreen} />
      <DrawerNavigator.Screen name={QUIZ_SCREEN} component={QuizScreen} />
    </DrawerNavigator.Navigator>
  );
}

const drawerContentStyles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerSection: {
    marginTop: 15,
  },
});

function DrawerContent(
  props: DrawerContentComponentProps<DrawerContentOptions>
) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={drawerContentStyles.drawerContent}>
        <Drawer.Section style={drawerContentStyles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            )}
            label={HOME_SCREEN}
            onPress={() => props.navigation.navigate(HOME_SCREEN)}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Foundation name="page-multiple" color={color} size={size} />
            )}
            label={QUIZZES_SCREEN}
            onPress={() => props.navigation.navigate(QUIZZES_SCREEN)}
          />
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}
