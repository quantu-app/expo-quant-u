import React, { memo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Modal, Text, Button, Icon, Card } from "@ui-kitten/components";
import { SMALL_WIDTH } from "./screens";
import { useMapStateToProps } from "./state";
import {
  selectSignInUpOpen,
  toggleSignInUpOpen,
  signInWithGithub,
  signInWithGoogle,
} from "./state/auth";

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: SMALL_WIDTH * 0.5,
  },
  header: {
    marginBottom: 16,
  },
  close: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  google: { backgroundColor: "#ea4335", borderColor: "transparent" },
  github: { backgroundColor: "#24292e", borderColor: "transparent" },
});

export const SignInUp = memo(() => {
  const signInUpOpen = useMapStateToProps(selectSignInUpOpen);

  return (
    <Modal
      style={styles.modal}
      visible={signInUpOpen}
      onBackdropPress={toggleSignInUpOpen}
      backdropStyle={styles.backdrop}
    >
      <Card disabled>
        <SignIn />
      </Card>
    </Modal>
  );
});

function SignIn() {
  const [loading, setLoading] = useState(false);

  async function signIn(signInFn: () => Promise<void>) {
    setLoading(true);
    try {
      await signInFn();
      toggleSignInUpOpen();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <View style={styles.header}>
        <Text category="h3">Sign in with</Text>
      </View>
      <Button
        style={styles.close}
        appearance="ghost"
        onPress={toggleSignInUpOpen}
        accessoryLeft={(props) => <Icon {...props} name="close" />}
      />
      <View>
        <Button
          style={styles.google}
          accessoryLeft={(props) => <Icon {...props} name="google" />}
          appearance="filled"
          disabled={loading}
          onPress={() => signIn(signInWithGoogle)}
        >
          Google
        </Button>
        {Platform.OS === "web" && (
          <Button
            style={styles.github}
            accessoryLeft={(props) => <Icon {...props} name="github" />}
            appearance="filled"
            disabled={loading}
            onPress={() => signIn(signInWithGithub)}
          >
            Github
          </Button>
        )}
      </View>
    </>
  );
}
