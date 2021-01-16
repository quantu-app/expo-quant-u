import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Modal, Layout, Button, Text, Icon } from "@ui-kitten/components";
import { SMALL_WIDTH } from "./screens";
import { signInWithGithub, signInWithGoogle } from "./state/auth";

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  google: { backgroundColor: "#ea4335" },
  github: { backgroundColor: "#24292e" },
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
    <Modal
      style={styles.modal}
      visible={props.open}
      onBackdropPress={props.onClose}
      backdropStyle={styles.backdrop}
    >
      <Layout style={styles.header}>
        <Text category="h3" style={styles.title}>
          Sign in
        </Text>
        <Button
          appearance="ghost"
          onPress={props.onClose}
          accessoryLeft={(props) => <Icon {...props} name="close" />}
        />
      </Layout>
      <Layout style={styles.content}>
        <Button
          style={[styles.button, styles.google]}
          accessoryLeft={(props) => <Icon {...props} name="google" />}
          appearance="filled"
          disabled={loading}
          onPress={() => signIn(signInWithGoogle)}
        >
          Google
        </Button>
        <Button
          style={[styles.button, styles.github]}
          accessoryLeft={(props) => <Icon {...props} name="github" />}
          appearance="filled"
          disabled={loading}
          onPress={() => signIn(signInWithGithub)}
        >
          Github
        </Button>
      </Layout>
    </Modal>
  );
}
