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
import { StyleSheet } from "react-native";
import {
  MaterialCommunityIcons,
  Foundation,
  Feather,
} from "@expo/vector-icons";
import { Option } from "@aicacia/core";
import { Divider, Drawer, IndexPath, Layout } from "@ui-kitten/components";
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
import {
  CATEGORIES_SCREEN,
  CATEGORY_SCREEN,
  CHAPTER_SCREEN,
  COURSE_SCREEN,
  DEFAULT_SCREEN,
  ENABLE_LINKING,
  HOME_SCREEN,
  linking,
  ParamList,
  PROFILE_SCREEN,
  QUIZ_SCREEN,
  START_QUIZ_SCREEN,
  UNIT_SCREEN,
} from "./navigationConfig";

export const DrawerNavigator = createDrawerNavigator<ParamList>();

export function Navigation() {
  return (
    <NavigationContainer
      linking={ENABLE_LINKING ? linking : undefined}
      fallback={<Loading />}
    >
      <NavigationDrawer />
    </NavigationContainer>
  );
}

const navigationDrawerStyles = StyleSheet.create({
  sceneContainerStyle: {
    flex: 1,
    flexGrow: 1,
  },
});

function NavigationDrawer() {
  const user = useMapStateToProps(selectUser);

  return (
    <DrawerNavigator.Navigator
      initialRouteName={DEFAULT_SCREEN}
      drawerType="front"
      drawerContent={(props) => <DrawerContent {...props} user={user} />}
      sceneContainerStyle={navigationDrawerStyles.sceneContainerStyle}
      detachInactiveScreens
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
      <Layout style={drawerContentStyles.drawerContent}>
        <Drawer
          style={drawerContentStyles.drawerSection}
          selectedIndex={new IndexPath(props.state.index)}
          onSelect={(index) =>
            props.navigation.navigate(props.state.routeNames[index.row])
          }
        >
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
          {props.user.isSome() ? (
            <DrawerItem
              icon={({ color, size }) => (
                <Feather name="user" color={color} size={size} />
              )}
              label={PROFILE_SCREEN}
              onPress={() => props.navigation.navigate(PROFILE_SCREEN)}
            />
          ) : (
            (null as any)
          )}
        </Drawer>
      </Layout>
    </DrawerContentScrollView>
  );
}
