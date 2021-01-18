import { firebase } from "../../firebase";

export function firebaseSignInWithGoogle(): Promise<firebase.auth.UserCredential> {
  return firebase
    .auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((result) => {
      if (result.user) {
        return result;
      } else {
        throw new Error(JSON.stringify(result, null, 2));
      }
    });
}
