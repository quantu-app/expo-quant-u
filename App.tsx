import { StatusBar } from "expo-status-bar";
import { Provider } from "react-native-paper";
import { theme } from "./src/theme";
import { Navigation } from "./src/Navigation";
import { createStateProvider } from "@aicacia/state-react";
import { Provider as ReactProvider, state } from "./src/state";

const StateProvider = createStateProvider(state, ReactProvider);

export default function App() {
  return (
    <Provider theme={theme}>
      <StateProvider>
        <Navigation />
      </StateProvider>
      <StatusBar style="auto" />
    </Provider>
  );
}
