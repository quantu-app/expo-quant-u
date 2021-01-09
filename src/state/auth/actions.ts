import { firebase } from "../../firebase";
import { IUser, STORE_NAME, User } from "./definitiions";
import { state } from "../lib/state";
import { none, some } from "@aicacia/core";

export const store = state.getStore(STORE_NAME);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    signUserIn(user);
  } else {
    signUserOut();
  }
});

export function isUserSignedIn() {
  return store.getCurrent().user.isSome();
}

export const githubAuthProvider = new firebase.auth.GithubAuthProvider();

githubAuthProvider.setCustomParameters({
  allow_signup: "true",
});

firebase
  .auth()
  .getRedirectResult()
  .then((authData) => {
    if (authData.user) {
      signUserIn(authData.user);
    }
  })
  .catch((error) => {
    console.error(error);
  });

async function getUserInfo(uid: string) {
  const userInfo = await firebase.database().ref(`users/${uid}`).once("value"),
    data = (userInfo.val() as Record<keyof IUser, any>) || ({} as any);

  store.update((state) =>
    state.update("user", (userOption) =>
      userOption.map((user) =>
        user
          .set("firstName", data.firstName || "")
          .set("lastName", data.lastName || "")
          .set(
            "username",
            data.username ||
              user.displayName?.replace(/\s+/g, "").toLowerCase() ||
              ""
          )
          .set("country", data.country || "US")
          .set("timezone", data.timezone || "Central")
          .set("birthday", data.birthday ? new Date(data.birthday) : new Date())
          .set("about", data.about || "")
      )
    )
  );
}

function signUserIn(firebaseUser: firebase.User) {
  const user = User({
    displayName: firebaseUser.displayName,
    email: firebaseUser.email,
    phoneNumber: firebaseUser.phoneNumber,
    photoURL: firebaseUser.photoURL,
    providerId: firebaseUser.providerId,
    uid: firebaseUser.uid,
  });

  getUserInfo(user.uid);

  return store.update((state) => state.set("user", some(user)));
}

function signUserOut() {
  return store.update((state) => state.set("user", none()));
}

export async function signOut() {
  await firebase.auth().signOut();
  return signUserOut();
}

export async function signInWithGithub() {
  return firebase
    .auth()
    .signInWithPopup(githubAuthProvider)
    .then((result) => {
      if (result.user) {
        signUserIn(result.user);
      } else {
        throw new Error(JSON.stringify(result, null, 2));
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
