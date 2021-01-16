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
import { StyleSheet, View } from "react-native";
import {
  MaterialCommunityIcons,
  Foundation,
  Feather,
} from "@expo/vector-icons";
import { Option } from "@aicacia/core";
import {
  Button,
  Divider,
  Drawer,
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
  selectSignInModal,
  selectUser,
  signOut,
  toggleSignInModal,
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
  const { user, signInModal } = useMapStateToProps((state) => ({
    user: selectUser(state),
    signInModal: selectSignInModal(state),
  }));

  return (
    <DrawerNavigator.Navigator
      initialRouteName={DEFAULT_SCREEN}
      screenOptions={{
        headerShown: true,
        header(props) {
          return <Header {...props} user={user} signInModal={signInModal} />;
        },
      }}
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

interface IDrawerHeaderProps extends DrawerHeaderProps {
  user: Option<IUser>;
  signInModal: boolean;
}

export function Header(props: IDrawerHeaderProps) {
  return (
    <View>
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
                  onPress={toggleSignInModal}
                  icon={(props) => <Icon {...props} name="log-in-outline" />}
                />
              )
        }
      />
      <Divider />
      <SignIn open={props.signInModal} onClose={toggleSignInModal} />
    </View>
  );
}

interface IDrawerContentProps
  extends DrawerContentComponentProps<DrawerContentOptions> {
  user: Option<IUser>;
}

function DrawerContent(props: IDrawerContentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <Drawer
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
    </DrawerContentScrollView>
  );
}
