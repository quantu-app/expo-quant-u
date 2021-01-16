import React from "react";
import { StatusBar } from "expo-status-bar";
import { Navigation } from "./src/Navigation";
import { createStateProvider } from "@aicacia/state-react";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import customTheme from "./custom-theme.json";
import customMapping from "./custom-mapping.json";
import { Provider as ReactProvider, state } from "./src/state";

import "./generators";
import "./courses";

const StateProvider = createStateProvider(state, ReactProvider);

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{ ...eva.light, ...customTheme }}
        customMapping={customMapping as any}
      >
        <StateProvider>
          <Navigation />
          <StatusBar style="auto" />
        </StateProvider>
      </ApplicationProvider>
    </>
  );
}
