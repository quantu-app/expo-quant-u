import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Portal, Title, IconButton, Button, Surface } from "react-native-paper";
import { SMALL_WIDTH } from "./screens";
import { signInWithGithub, signInWithGoogle } from "./state/auth";
import { theme } from "./theme";

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.backdrop,
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  modal: {
    width: SMALL_WIDTH * 0.5,
  },
  header: {
    flex: 1,
    alignContent: "space-between",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  title: {
    marginTop: 8,
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  button: {
    marginBottom: 8,
  },
});

export interface ISignInProps {
  open: boolean;
  onClose(): void;
}

export function SignIn(props: ISignInProps) {
  const [loading, setLoading] = useState(false);

  async function signIn(signInFn: () => Promise<void>) {
    setLoading(true);
    try {
      await signInFn();
      props.onClose();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Portal>
      {props.open ? (
        <>
          <View style={styles.backdrop} />
          <View style={styles.wrapper}>
            <Surface style={styles.modal}>
              <View style={styles.header}>
                <Title style={styles.title}>Sign in</Title>
                <IconButton icon="close" onPress={props.onClose} />
              </View>
              <View style={styles.content}>
                <Button
                  style={styles.button}
                  icon="google"
                  mode="contained"
                  color="#ea4335"
                  disabled={loading}
                  uppercase={false}
                  onPress={() => signIn(signInWithGoogle)}
                >
                  Google
                </Button>
                <Button
                  style={styles.button}
                  icon="github"
                  mode="contained"
                  color="#24292e"
                  disabled={loading}
                  uppercase={false}
                  onPress={() => signIn(signInWithGithub)}
                >
                  Github
                </Button>
              </View>
            </Surface>
          </View>
        </>
      ) : null}
    </Portal>
  );
}
