import { StyleSheet } from "react-native";
import { Container } from "native-base";
import { ReactNode } from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  layout: {
    flex: 1,
    maxWidth: 768,
  },
});

export interface ILayoutProps {
  children: ReactNode;
}

export function Layout(props: ILayoutProps) {
  return (
    <Container style={styles.container}>
      <Container style={styles.layout}>{props.children}</Container>
    </Container>
  );
}
