import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

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
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}
