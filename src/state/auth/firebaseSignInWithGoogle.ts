import {
  initAsync,
  askForPlayServicesAsync,
  signInAsync,
} from "expo-google-sign-in";
import { firebase } from "../../firebase";

export async function firebaseSignInWithGoogle() {
  await initAsync();
  await askForPlayServicesAsync();
  const { user } = await signInAsync();

  return firebase
    .auth()
    .signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(user?.auth?.idToken)
    );
}
