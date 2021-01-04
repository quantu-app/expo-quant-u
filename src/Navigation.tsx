import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItem,
  DrawerContentOptions,
} from "@react-navigation/drawer";
import { HomeScreen } from "./screens/Home/HomeScreen";
import { CoursesScreen } from "./screens/Courses/CoursesScreen";
import { CourseScreen } from "./screens/Course/CourseScreen";
import { StyleSheet, View, Platform } from "react-native";
import { Drawer } from "react-native-paper";
import { MaterialCommunityIcons, Foundation } from "@expo/vector-icons";
import { Loading } from "./Loading";

export const HOME_SCREEN = "Home",
  COURSES_SCREEN = "Courses",
  COURSE_SCREEN = "Course",
  DEFAULT_SCREEN = COURSES_SCREEN;

export type ParamList = {
  [HOME_SCREEN]: undefined;
  [COURSES_SCREEN]: undefined;
  [COURSE_SCREEN]: { name: string };
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
      [COURSES_SCREEN]: "courses",
      [COURSE_SCREEN]: "courses/:name",
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
      <DrawerNavigator.Screen name={COURSES_SCREEN} component={CoursesScreen} />
      <DrawerNavigator.Screen name={COURSE_SCREEN} component={CourseScreen} />
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
            label={COURSES_SCREEN}
            onPress={() => props.navigation.navigate(COURSES_SCREEN)}
          />
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}
