import { firebase } from "../../firebase";
import { IUserExtra, STORE_NAME, User } from "./definitiions";
import { state } from "../lib/state";
import { none, Option, some } from "@aicacia/core";

export const store = state.getStore(STORE_NAME);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    signUserIn(user);
  } else {
    signUserOut();
  }
});

export function toggleSignInModal() {
  store.update((state) => state.set("signInModal", !state.get("signInModal")));
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

export async function isValidUsername(uid: string, username = "") {
  const dataSnapshot = await firebase
    .database()
    .ref("users")
    .orderByChild("username")
    .equalTo(username)
    .once("value");

  return (
    dataSnapshot.exists() && !Object.keys(dataSnapshot.val()).includes(uid)
  );
}

export async function setUserExtra(uid: string, userExtra: IUserExtra) {
  await firebase
    .database()
    .ref(`users/${uid}`)
    .set({
      ...userExtra,
      birthday: userExtra.birthday?.toUTCString(),
    });
}

const USER_EXTRA_REF: Option<firebase.database.Reference> = none();

function subscribeUserExtra(uid: string) {
  const ref = firebase.database().ref(`users/${uid}`);

  unsubscribeUserExtra();
  USER_EXTRA_REF.replace(ref);

  ref.on("value", (snapshot) => {
    const data: IUserExtra = snapshot.val() || {};

    store.update((state) =>
      state.update("user", (userOption) =>
        userOption.map((user) =>
          user.update("extra", (extra) =>
            extra
              .set("firstName", data.firstName)
              .set("lastName", data.lastName)
              .set("username", data.username)
              .set("country", data.country)
              .set("timezone", data.timezone)
              .set("birthday", data.birthday)
              .set("about", data.about)
          )
        )
      )
    );
  });
}

function unsubscribeUserExtra() {
  USER_EXTRA_REF.take().map((ref) => ref.off("value"));
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

  subscribeUserExtra(user.uid);

  return store.update((state) => state.set("user", some(user)));
}

function signUserOut() {
  unsubscribeUserExtra();
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
