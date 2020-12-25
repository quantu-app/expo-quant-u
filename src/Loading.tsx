import { View, StyleSheet, ActivityIndicator } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});

export function Loading() {
  return (
    <View>
      <ActivityIndicator />
    </View>
  );
}
