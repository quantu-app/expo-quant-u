import { AppLoading } from "expo";
import { loadAsync } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Navigation } from "./src/Navigation";
import { createStateProvider } from "@aicacia/state-react";
import { Provider as ReactProvider, state } from "./src/state";
import { useAsync } from "@aicacia/async_component-react";

const StateProvider = createStateProvider(state, ReactProvider);

export default function App() {
  const fonts = useAsync(
    loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    })
  );

  if (fonts.isSome()) {
    return <AppLoading />;
  }

  return (
    <StateProvider>
      <Navigation />
      <StatusBar style="auto" />
    </StateProvider>
  );
}
