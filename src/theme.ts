import { DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  roundness: 1,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3f51b5",
    accent: "#ff5722",
    error: "#f10000",
    notification: "#f44336",
  },
};
