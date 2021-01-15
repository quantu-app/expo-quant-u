import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItem,
  DrawerContentOptions,
} from "@react-navigation/drawer";
import { HomeScreen } from "./screens/Home/HomeScreen";
import { CourseScreen } from "./screens/Course/CourseScreen";
import { StyleSheet, View, Platform } from "react-native";
import { Divider, Drawer } from "react-native-paper";
import {
  MaterialCommunityIcons,
  Foundation,
  Feather,
} from "@expo/vector-icons";
import { Loading } from "./Loading";
import { CategoryScreen } from "./screens/Category/CategoryScreen";
import { CategoriesScreen } from "./screens/Categories/CategoriesScreen";
import { ChapterScreen } from "./screens/Chapter/ChapterScreen";
import { UnitScreen } from "./screens/Unit/UnitScreen";
import { QuizScreen } from "./screens/Quiz/QuizScreen";
import { StartQuizScreen } from "./screens/StartQuiz/StartQuizScreen";
import { ProfileScreen } from "./screens/Profile/ProfileScreen";
import { IUser, selectUser } from "./state/auth";
import { useMapStateToProps } from "./state";
import { Option } from "@aicacia/core";

export const HOME_SCREEN = "Home",
  PROFILE_SCREEN = "Profile",
  CATEGORIES_SCREEN = "Categories",
  CATEGORY_SCREEN = "Category",
  COURSE_SCREEN = "Course",
  CHAPTER_SCREEN = "Chapter",
  UNIT_SCREEN = "Unit",
  START_QUIZ_SCREEN = "Start Quiz",
  QUIZ_SCREEN = "Quiz",
  DEFAULT_SCREEN = PROFILE_SCREEN;

export type ParamList = {
  [HOME_SCREEN]: undefined;
  [PROFILE_SCREEN]: undefined;
  [CATEGORIES_SCREEN]: undefined;
  [CATEGORY_SCREEN]: { category: string };
  [COURSE_SCREEN]: { category: string; course: string };
  [CHAPTER_SCREEN]: { category: string; course: string; chapter: string };
  [UNIT_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
  };
  [START_QUIZ_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
    quiz: string;
  };
  [QUIZ_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
    quiz: string;
    seed: number;
  };
};

// TODO: remove after not hosting on github pages
export const ENABLE_LINKING =
  global.location?.hostname === "localhost" ||
  (!("electron" in (global.process?.versions || {})) && Platform.OS !== "web");

export const linking = {
  prefixes: [
    "https://quant-u.com",
    "quant-u://",
    "https://quantu-app.github.io/expo-quant-u",
  ],
  config: {
    screens: {
      [HOME_SCREEN]: "",
      [PROFILE_SCREEN]: "profile",
      [CATEGORIES_SCREEN]: "categories",
      [CATEGORY_SCREEN]: ":category",
      [COURSE_SCREEN]: ":category/:course",
      [CHAPTER_SCREEN]: ":category/:course/:chapter",
      [UNIT_SCREEN]: ":category/:course/:chapter/:unit",
      [START_QUIZ_SCREEN]:
        ":category/:course/:chapter/:unit/quizzes/:quiz/start",
      [QUIZ_SCREEN]: {
        path: ":category/:course/:chapter/:unit/quizzes/:quiz",
        parse: {
          seed: Number,
        },
      },
    },
  },
};

if (ENABLE_LINKING && process.env.NODE_ENV !== "production") {
  linking.prefixes.push(
    `${location.protocol}//${location.host}:${location.port}`
  );
}

export const DrawerNavigator = createDrawerNavigator<ParamList>();

export function Navigation() {
  return (
    <NavigationContainer
      linking={ENABLE_LINKING ? linking : undefined}
      fallback={<Loading />}
    >
      <AppDrawer />
    </NavigationContainer>
  );
}

export function AppDrawer() {
  const user = useMapStateToProps(selectUser);

  return (
    <DrawerNavigator.Navigator
      initialRouteName={DEFAULT_SCREEN}
      drawerType="front"
      drawerContent={(props) => <DrawerContent {...props} user={user} />}
    >
      <DrawerNavigator.Screen name={HOME_SCREEN} component={HomeScreen} />
      {user.isSome() && (
        <DrawerNavigator.Screen
          name={PROFILE_SCREEN}
          component={ProfileScreen}
        />
      )}
      <DrawerNavigator.Screen
        name={CATEGORIES_SCREEN}
        component={CategoriesScreen}
      />
      <DrawerNavigator.Screen
        name={CATEGORY_SCREEN}
        component={CategoryScreen}
      />
      <DrawerNavigator.Screen name={COURSE_SCREEN} component={CourseScreen} />
      <DrawerNavigator.Screen name={CHAPTER_SCREEN} component={ChapterScreen} />
      <DrawerNavigator.Screen name={UNIT_SCREEN} component={UnitScreen} />
      <DrawerNavigator.Screen
        name={START_QUIZ_SCREEN}
        component={StartQuizScreen}
      />
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

interface IDrawerContentProps
  extends DrawerContentComponentProps<DrawerContentOptions> {
  user: Option<IUser>;
}

function DrawerContent(props: IDrawerContentProps) {
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
            label={"Mathematics"}
            onPress={() =>
              props.navigation.navigate(CATEGORY_SCREEN, {
                category: "mathematics",
              })
            }
          />
          <Divider />
          {props.user.isSome() && (
            <DrawerItem
              icon={({ color, size }) => (
                <Feather name="user" color={color} size={size} />
              )}
              label={PROFILE_SCREEN}
              onPress={() => props.navigation.navigate(PROFILE_SCREEN)}
            />
          )}
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}
