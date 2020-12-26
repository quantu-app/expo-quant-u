import { StatusBar } from "expo-status-bar";
import { Navigation } from "./src/Navigation";
import { createStateProvider } from "@aicacia/state-react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReactProvider, state } from "./src/state";
import { theme } from "./src/theme";

const StateProvider = createStateProvider(state, ReactProvider);

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StateProvider>
        <Navigation />
        <StatusBar style="auto" />
      </StateProvider>
    </PaperProvider>
  );
}
