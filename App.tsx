import { StatusBar } from "expo-status-bar";
import { Navigation } from "./src/Navigation";
import { createStateProvider } from "@aicacia/state-react";
import { Provider as ReactProvider, state } from "./src/state";

const StateProvider = createStateProvider(state, ReactProvider);

export default function App() {
  return (
    <StateProvider>
      <Navigation />
      <StatusBar style="auto" />
    </StateProvider>
  );
}
