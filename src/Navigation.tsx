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
import { StyleSheet, View } from "react-native";
import { Drawer } from "react-native-paper";
import { MaterialCommunityIcons, Foundation } from "@expo/vector-icons";

export const HOME_SCREEN = "Home",
  QUIZZES_SCREEN = "Quizzes",
  DEFAULT_SCREEN = QUIZZES_SCREEN;

export type ParamList = {
  [HOME_SCREEN]: undefined;
  [QUIZZES_SCREEN]: undefined;
};

export const DrawerNavigator = createDrawerNavigator<ParamList>();

export function Navigation() {
  return (
    <NavigationContainer>
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
            onPress={() => props.navigation.jumpTo(HOME_SCREEN)}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Foundation name="page-multiple" color={color} size={size} />
            )}
            label={QUIZZES_SCREEN}
            onPress={() => props.navigation.jumpTo(QUIZZES_SCREEN)}
          />
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}
