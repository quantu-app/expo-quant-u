import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItem,
  DrawerContentOptions,
} from "@react-navigation/drawer";
import { HomeScreen } from "./screens/Home/HomeScreen";
import { StyleSheet, View } from "react-native";
import { Drawer } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HOME_PAGE = "Home";

export type ParamList = {
  [HOME_PAGE]: undefined;
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
      initialRouteName={HOME_PAGE}
      drawerType="back"
      drawerContent={DrawerContent}
    >
      <DrawerNavigator.Screen name={HOME_PAGE} component={HomeScreen} />
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
            label={HOME_PAGE}
            onPress={() => props.navigation.jumpTo(HOME_PAGE)}
          />
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}
