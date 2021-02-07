import React from "react";
import { StatusBar } from "expo-status-bar";
import { Navigation } from "./src/Navigation";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import customTheme from "./custom-theme.json";
import customMapping from "./custom-mapping.json";

import "./generators";
import "./courses";

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{ ...eva.light, ...customTheme }}
        customMapping={customMapping as any}
      >
        <StatusBar style="auto" />
        <Navigation />
      </ApplicationProvider>
    </>
  );
}
