import { StyleSheet } from "react-native";
import { View, Spinner } from "native-base";

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
      <Spinner />
    </View>
  );
}
