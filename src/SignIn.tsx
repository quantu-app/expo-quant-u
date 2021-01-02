import { StyleSheet } from "react-native";
import { Modal, Portal, Title, IconButton, Surface } from "react-native-paper";
import { SMALL_WIDTH } from "./screens";

let windowObjectReference: Window | null = null,
  previousUrl: string | null = null;

function receiveMessage(event: MessageEvent) {
  console.log(event);
}

async function signInExternal(url: string) {
  const name = "Sign in";
  window.removeEventListener("message", receiveMessage);

  const strWindowFeatures = "toolbar=no, menubar=no, width=600, height=700";

  if (windowObjectReference === null || windowObjectReference.closed) {
    windowObjectReference = window.open(url, name, strWindowFeatures);
  } else if (previousUrl !== url) {
    windowObjectReference = window.open(url, name, strWindowFeatures) as Window;
    windowObjectReference.focus();
  } else {
    windowObjectReference.focus();
  }

  window.addEventListener("message", receiveMessage, false);
  previousUrl = url;
}

const styles = StyleSheet.create({
  modal: {
    maxWidth: SMALL_WIDTH,
  },
});

export interface ISignInProps {
  open: boolean;
  onClose(): void;
  onSignIn(): void;
}

export function SignIn(props: ISignInProps) {
  async function signInWithGithub() {
    await signInExternal("GITHUB_URL");
  }

  return (
    <Portal>
      <Modal
        visible={props.open}
        onDismiss={props.onClose}
        contentContainerStyle={styles.modal}
      >
        <Surface>
          <Title>Sign in</Title>
          <IconButton icon="github" onPress={signInWithGithub} />
        </Surface>
      </Modal>
    </Portal>
  );
}
