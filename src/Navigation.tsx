import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from "@react-navigation/drawer";
import { HomeScreen } from "./screens/Home/HomeScreen";
import { CourseScreen } from "./screens/Course/CourseScreen";
import { StyleSheet } from "react-native";
import { Option } from "@aicacia/core";
import {
  Button,
  Layout,
  Drawer,
  DrawerItem,
  Icon,
  IndexPath,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { Loading } from "./Loading";
import { CategoryScreen } from "./screens/Category/CategoryScreen";
import { CategoriesScreen } from "./screens/Categories/CategoriesScreen";
import { ChapterScreen } from "./screens/Chapter/ChapterScreen";
import { UnitScreen } from "./screens/Unit/UnitScreen";
import { QuizScreen } from "./screens/Quiz/QuizScreen";
import { StartQuizScreen } from "./screens/StartQuiz/StartQuizScreen";
import { ProfileScreen } from "./screens/Profile/ProfileScreen";
import {
  IUser,
  selectSignInUpOpen,
  selectUser,
  signOut,
  toggleSignInUpOpen,
} from "./state/auth";
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
import { SignIn } from "./SignIn";
import app from "../app.json";
import { DrawerHeaderProps } from "@react-navigation/drawer/lib/typescript/src/types";

export const { Navigator, Screen } = createDrawerNavigator<ParamList>();

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

function NavigationDrawer() {
  const [user, signInUpOpen] = useMapStateToProps((state) => [
    selectUser(state),
    selectSignInUpOpen(state),
  ]);

  return (
    <Navigator
      initialRouteName={DEFAULT_SCREEN}
      screenOptions={{
        headerShown: true,
        header(props) {
          return <Header {...props} user={user} signInUpOpen={signInUpOpen} />;
        },
      }}
      drawerType="front"
      drawerContent={(props) => <DrawerContent {...props} user={user} />}
      detachInactiveScreens
    >
      <Screen name={HOME_SCREEN} component={HomeScreen} />
      {user.isSome() && (
        <Screen name={PROFILE_SCREEN} component={ProfileScreen} />
      )}
      <Screen name={CATEGORIES_SCREEN} component={CategoriesScreen} />
      <Screen name={CATEGORY_SCREEN} component={CategoryScreen} />
      <Screen name={COURSE_SCREEN} component={CourseScreen} />
      <Screen name={CHAPTER_SCREEN} component={ChapterScreen} />
      <Screen name={UNIT_SCREEN} component={UnitScreen} />
      <Screen name={START_QUIZ_SCREEN} component={StartQuizScreen} />
      <Screen name={QUIZ_SCREEN} component={QuizScreen} />
    </Navigator>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    borderBottomColor: "rgb(228, 233, 242)",
    borderBottomWidth: 1,
  },
});

interface IDrawerHeaderProps extends DrawerHeaderProps {
  user: Option<IUser>;
  signInUpOpen: boolean;
}

export function Header(props: IDrawerHeaderProps) {
  return (
    <Layout style={headerStyles.container}>
      <TopNavigation
        alignment="start"
        title={() => (
          <Button
            appearance="ghost"
            onPress={() =>
              props.scene.descriptor.navigation.navigate(HOME_SCREEN)
            }
          >
            {app.expo.name}
          </Button>
        )}
        accessoryLeft={(accessoryProps) => (
          <TopNavigationAction
            {...accessoryProps}
            onPress={() =>
              (props.scene.descriptor.navigation as any).openDrawer()
            }
            icon={(props) => <Icon {...props} name="menu-outline" />}
          />
        )}
        accessoryRight={
          props.user.isSome()
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
                  onPress={toggleSignInUpOpen}
                  icon={(props) => <Icon {...props} name="log-in-outline" />}
                />
              )
        }
      />
      <SignIn open={props.signInUpOpen} onClose={toggleSignInUpOpen} />
    </Layout>
  );
}

interface IDrawerContentProps
  extends DrawerContentComponentProps<DrawerContentOptions> {
  user: Option<IUser>;
}

function mapStateIndexToListed(index: number) {
  switch (index) {
    case 0:
      return 0;
    case 1:
      return 2;
    default:
      return 1;
  }
}

function DrawerContent(props: IDrawerContentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <Drawer
        selectedIndex={new IndexPath(mapStateIndexToListed(props.state.index))}
      >
        <DrawerItem
          accessoryLeft={(props) => <Icon {...props} name="home-outline" />}
          title={HOME_SCREEN}
          onPress={() => props.navigation.navigate(HOME_SCREEN)}
        />
        <DrawerItem
          accessoryLeft={(props) => <Icon {...props} name="list-outline" />}
          title={"Mathematics"}
          onPress={() =>
            props.navigation.navigate(CATEGORY_SCREEN, {
              category: "mathematics",
            })
          }
        />
        {props.user.isSome() ? (
          <DrawerItem
            accessoryLeft={(props) => <Icon {...props} name="person-outline" />}
            title={PROFILE_SCREEN}
            onPress={() => props.navigation.navigate(PROFILE_SCREEN)}
          />
        ) : (
          (null as any)
        )}
      </Drawer>
    </DrawerContentScrollView>
  );
}
