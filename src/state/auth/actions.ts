import { firebase } from "./firebase";
import { STORE_NAME, User } from "./definitiions";
import { state } from "../lib/state";
import { none, some } from "@aicacia/core";

export const store = state.getStore(STORE_NAME);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    signIn(user);
  } else {
    signOut();
  }
});

export const githubAuthProvider = new firebase.auth.GithubAuthProvider();

githubAuthProvider.setCustomParameters({
  allow_signup: "true",
});

firebase
  .auth()
  .getRedirectResult()
  .then(function (authData) {
    console.log(authData);
  })
  .catch(function (error) {
    console.log(error);
  });

export function signIn(user: firebase.User) {
  return store.update((state) =>
    state.set(
      "user",
      some(
        User({
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          providerId: user.providerId,
          uid: user.uid,
        })
      )
    )
  );
}

export function signOut() {
  return store.update((state) => state.set("user", none()));
}

export async function signInWithGithub() {
  return firebase
    .auth()
    .signInWithPopup(githubAuthProvider)
    .then((result) => {
      if (result.user) {
        signIn(result.user);
      } else {
        throw new Error(JSON.stringify(result, null, 2));
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
