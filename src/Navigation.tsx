import React, { memo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from "@react-navigation/drawer";
import { HomeScreen } from "./screens/Home/HomeScreen";
import { CourseScreen } from "./screens/Course/CourseScreen";
import { Platform, SafeAreaView, StyleSheet, StatusBar } from "react-native";
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
import { StartPracticeUnitScreen } from "./screens/StartPracticeUnit/StartPracticeUnitScreen";
import { PracticeUnitScreen } from "./screens/PracticeUnit/PracticeUnitScreen";
import { QuizScreen } from "./screens/Quiz/QuizScreen";
import { StartQuizScreen } from "./screens/StartQuiz/StartQuizScreen";
import { ProfileScreen } from "./screens/Profile/ProfileScreen";
import {
  IUser,
  selectIsSignedIn,
  selectUser,
  signOut,
  toggleSignInUpOpen,
} from "./state/auth";
import { useMapStateToProps } from "./state";
import {
  CATEGORIES_SCREEN,
  CATEGORY_SCREEN,
  CHALLENGE_QUIZ_SCREEN,
  CHAPTER_SCREEN,
  COURSE_SCREEN,
  DEFAULT_SCREEN,
  HOME_SCREEN,
  linking,
  ParamList,
  PRACTICE_UNIT_SCREEN,
  PROFILE_SCREEN,
  QUIZ_SCREEN,
  START_CHALLENGE_QUIZ_SCREEN,
  START_PRACTICE_UNIT_SCREEN,
  START_QUIZ_SCREEN,
  UNIT_SCREEN,
} from "./navigationConfig";
import { SignInUp } from "./SignInUp";
import app from "../app.json";
import { DrawerHeaderProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { StartChallengeQuizScreen } from "./screens/StartChallengeQuiz/StartChallengeQuizScreen";
import { ChallengeQuizScreen } from "./screens/ChallengeQuiz/ChallengeQuizScreen";
import { RecordOf } from "immutable";

export const { Navigator, Screen } = createDrawerNavigator<ParamList>();

export function Navigation() {
  return (
    <NavigationContainer
      linking={linking}
      fallback={<Loading />}
    >
      <NavigationDrawer />
    </NavigationContainer>
  );
}

function NavigationDrawer() {
  const [isSignedIn, user] = useMapStateToProps((state) => [
    selectIsSignedIn(state),
    selectUser(state),
  ]);

  return (
    <Navigator
      initialRouteName={DEFAULT_SCREEN}
      screenOptions={{
        headerShown: true,
        header: (props) => (
          <Header {...props} user={user} isSignedIn={isSignedIn} />
        ),
      }}
      drawerType="front"
      drawerContent={(props) => (
        <DrawerContent {...props} isSignedIn={isSignedIn} />
      )}
      detachInactiveScreens
    >
      <Screen name={HOME_SCREEN} component={HomeScreen} />
      {isSignedIn && <Screen name={PROFILE_SCREEN} component={ProfileScreen} />}
      <Screen name={CATEGORIES_SCREEN} component={CategoriesScreen} />
      <Screen name={CATEGORY_SCREEN} component={CategoryScreen} />
      <Screen name={COURSE_SCREEN} component={CourseScreen} />
      <Screen name={CHAPTER_SCREEN} component={ChapterScreen} />
      <Screen name={UNIT_SCREEN} component={UnitScreen} />
      <Screen
        name={START_PRACTICE_UNIT_SCREEN}
        component={StartPracticeUnitScreen}
      />
      <Screen name={PRACTICE_UNIT_SCREEN} component={PracticeUnitScreen} />
      <Screen name={START_QUIZ_SCREEN} component={StartQuizScreen} />
      <Screen name={QUIZ_SCREEN} component={QuizScreen} />
      <Screen
        name={START_CHALLENGE_QUIZ_SCREEN}
        component={StartChallengeQuizScreen}
      />
      <Screen name={CHALLENGE_QUIZ_SCREEN} component={ChallengeQuizScreen} />
    </Navigator>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS !== "web" ? StatusBar.currentHeight : 0,
    borderBottomColor: "rgb(228, 233, 242)",
    borderBottomWidth: 1,
  },
});

interface IDrawerHeaderProps extends DrawerHeaderProps {
  user: RecordOf<IUser>;
  isSignedIn: boolean;
}

const Header = memo(
  (props: IDrawerHeaderProps) => {
    return (
      <SafeAreaView>
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
              <>
                <TopNavigationAction
                  {...accessoryProps}
                  onPress={() =>
                    (props.scene.descriptor.navigation as any).openDrawer()
                  }
                  icon={(props) => <Icon {...props} name="menu-outline" />}
                />
                {props.scene.descriptor.navigation.canGoBack() && (
                  <TopNavigationAction
                    {...accessoryProps}
                    onPress={() => props.scene.descriptor.navigation.goBack()}
                    icon={(props) => (
                      <Icon {...props} name="arrow-back-outline" />
                    )}
                  />
                )}
              </>
            )}
            accessoryRight={
              props.isSignedIn
                ? (accessoryProps) => (
                    <>
                      <Button
                        size="small"
                        appearance="ghost"
                        onPress={() =>
                          props.scene.descriptor.navigation.navigate(
                            PROFILE_SCREEN
                          )
                        }
                      >
                        {props.user.extra.username}
                      </Button>
                      <TopNavigationAction
                        {...accessoryProps}
                        onPress={signOut}
                        accessibilityHint="Log out"
                        icon={(props) => (
                          <Icon {...props} name="log-out-outline" />
                        )}
                      />
                    </>
                  )
                : (props) => (
                    <TopNavigationAction
                      {...props}
                      onPress={toggleSignInUpOpen}
                      accessibilityHint="Log in"
                      icon={(props) => (
                        <Icon {...props} name="log-in-outline" />
                      )}
                    />
                  )
            }
          />
          <SignInUp />
        </Layout>
      </SafeAreaView>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isSignedIn === nextProps.isSignedIn &&
      prevProps.user === nextProps.user
    );
  }
);

interface IDrawerContentProps
  extends DrawerContentComponentProps<DrawerContentOptions> {
  isSignedIn: boolean;
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

const DrawerContent = memo(
  (props: IDrawerContentProps) => {
    return (
      <DrawerContentScrollView {...props}>
        <Drawer
          selectedIndex={
            new IndexPath(mapStateIndexToListed(props.state.index))
          }
        >
          <DrawerItem
            accessoryLeft={(props) => <Icon {...props} name="home-outline" />}
            title={HOME_SCREEN}
            onPress={() => props.navigation.navigate(HOME_SCREEN)}
          />
          <DrawerItem
            accessoryLeft={(props) => <Icon {...props} name="list-outline" />}
            title={"Mentel Math"}
            onPress={() =>
              props.navigation.navigate(COURSE_SCREEN, {
                category: "mathematics",
                course: "mental_math",
              })
            }
          />
          {props.isSignedIn ? (
            <DrawerItem
              accessoryLeft={(props) => (
                <Icon {...props} name="person-outline" />
              )}
              title={PROFILE_SCREEN}
              onPress={() => props.navigation.navigate(PROFILE_SCREEN)}
            />
          ) : (
            (null as any)
          )}
        </Drawer>
      </DrawerContentScrollView>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isSignedIn === nextProps.isSignedIn &&
      prevProps.state.index === nextProps.state.index
    );
  }
);
