import { firebase } from "../../firebase";
import { IUserExtra, STORE_NAME, User } from "./definitiions";
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

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

googleAuthProvider.setCustomParameters({
  allow_signup: "true",
});

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

export async function isValidUsername(uid: string, username: string) {
  const dataSnapshot = await firebase
    .database()
    .ref("users")
    .equalTo(username, "username")
    .once("value");

  return dataSnapshot.exists() && dataSnapshot.val().uid !== uid;
}

export async function setUserExtra(uid: string, userExtra: IUserExtra) {
  await firebase
    .database()
    .ref(`users/${uid}`)
    .set({
      ...userExtra,
      birthday: userExtra.birthday.toUTCString(),
    });
}

async function getUserExtra(uid: string) {
  const userExtra = await firebase.database().ref(`users/${uid}`).once("value"),
    data: IUserExtra = userExtra.val() || {};

  store.update((state) =>
    state.update("user", (userOption) =>
      userOption.map((user) =>
        user.update("extra", (extra) =>
          extra
            .set("firstName", data.firstName || "")
            .set("lastName", data.lastName || "")
            .set(
              "username",
              data.username ||
                user.displayName?.replace(/\s+/g, "").toLowerCase() ||
                ""
            )
            .set("country", data.country)
            .set("timezone", data.timezone)
            .set(
              "birthday",
              data.birthday ? new Date(data.birthday) : new Date()
            )
            .set("about", data.about || "")
        )
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

  getUserExtra(user.uid);

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

export async function signInWithGoogle() {
  return firebase
    .auth()
    .signInWithPopup(googleAuthProvider)
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
