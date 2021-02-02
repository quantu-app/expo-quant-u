import { firebase } from "../../firebase";
import { IUser, IUserExtra, STORE_NAME, User, UserExtra } from "./definitiions";
import { state } from "../lib/state";
import { none, Option, some } from "@aicacia/core";
import { Map, RecordOf } from "immutable";
import { XorShiftRng } from "@aicacia/rand";
import { firebaseSignInWithGoogle } from "./firebaseSignInWithGoogle";

export const store = state.getStore(STORE_NAME);

window.addEventListener("unload", () =>
  store.getCurrent().user.map((user) => setUserOnline(user, false))
);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    signUserIn(user, false);
  } else {
    signUserOut();
  }
});

export function setUserOnline(user: RecordOf<IUser>, online: boolean) {
  return firebase
    .database()
    .ref(`users/${user.uid}`)
    .child("online")
    .set(online);
}

export function toggleSignInUpOpen() {
  store.update((state) =>
    state.set("signInUpOpen", !state.get("signInUpOpen"))
  );
}

export function setSignInUpOpen(open: boolean) {
  store.update((state) => state.set("signInUpOpen", open));
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
      signUserIn(
        authData.user,
        authData.additionalUserInfo?.isNewUser === true
      );
    }
  })
  .catch((error) => {
    console.error(error);
  });

export async function isValidUsername(user: RecordOf<IUser>, username = "") {
  const dataSnapshot = await firebase
    .database()
    .ref("users")
    .orderByChild("username")
    .equalTo(username)
    .once("value");

  return (
    !dataSnapshot.exists() || Object.keys(dataSnapshot.val()).includes(user.uid)
  );
}

export async function findByUsername(user: RecordOf<IUser>, username = "") {
  const dataSnapshot = await firebase
      .database()
      .ref("users")
      .orderByChild("username")
      .startAt(username)
      .endAt(username + "\uf8ff")
      .once("value"),
    users: Record<string, any> = dataSnapshot.val() || {};

  return Object.keys(users).reduce((acc, uid) => {
    const otherUser = UserExtra(users[uid]);

    if (uid === user.uid || !otherUser.online) {
      return acc;
    } else {
      return acc.set(uid, otherUser);
    }
  }, Map<string, RecordOf<IUserExtra>>());
}

export function setUserExtra(user: RecordOf<IUser>, userExtra: IUserExtra) {
  return firebase
    .database()
    .ref(`users/${user.uid}`)
    .set(
      JSON.parse(
        JSON.stringify({
          ...userExtra,
          birthday: userExtra.birthday?.toUTCString(),
        })
      )
    );
}

const USER_EXTRA_REF: Option<firebase.database.Reference> = none();

async function subscribeUserExtra(user: RecordOf<IUser>, isNewUser: boolean) {
  const ref = firebase.database().ref(`users/${user.uid}`);

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
              .set("birthday", data.birthday && new Date(data.birthday))
              .set("about", data.about)
              .set("online", true)
          )
        )
      )
    );
  });

  if (isNewUser) {
    const snapshot = await ref.child("username").once("value"),
      username = await getValidUsername(
        user,
        snapshot.val() ||
          (user.displayName || "").toLowerCase().replace(/\s+/g, "")
      );

    await firebase
      .database()
      .ref(`users/${user.uid}`)
      .child("username")
      .set(username);
  }
}

function unsubscribeUserExtra() {
  USER_EXTRA_REF.take().map((ref) => ref.off("value"));
}

function signUserIn(firebaseUser: firebase.User, isNewUser: boolean) {
  const user = User({
    displayName: firebaseUser.displayName,
    email: firebaseUser.email,
    phoneNumber: firebaseUser.phoneNumber,
    photoURL: firebaseUser.photoURL,
    providerId: firebaseUser.providerId,
    uid: firebaseUser.uid,
  });

  setUserOnline(user, true);
  subscribeUserExtra(user, isNewUser);

  return store.update((state) => state.set("user", some(user)));
}

function signUserOut() {
  unsubscribeUserExtra();
  return store.update((state) => {
    state.user.map((user) => setUserOnline(user, false));
    return state.set("user", none());
  });
}

export async function signOut() {
  signUserOut();
  await firebase.auth().signOut();
}

export async function signInWithGithub() {
  return firebase
    .auth()
    .signInWithPopup(githubAuthProvider)
    .then((result) => {
      if (result.user) {
        signUserIn(result.user, result.additionalUserInfo?.isNewUser === true);
      } else {
        throw new Error(JSON.stringify(result, null, 2));
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function signInWithGoogle() {
  return firebaseSignInWithGoogle()
    .then((result) => {
      if (result.user) {
        signUserIn(result.user, result.additionalUserInfo?.isNewUser === true);
      } else {
        throw new Error(JSON.stringify(result, null, 2));
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

async function getValidUsername(
  user: RecordOf<IUser>,
  username: string
): Promise<string> {
  if (await isValidUsername(user, username)) {
    return username;
  } else {
    return getValidUsernameRecur(user, username);
  }
}

async function getValidUsernameRecur(
  user: RecordOf<IUser>,
  username: string
): Promise<string> {
  const usernameWithRandomString = `${username}${randomString()}`;

  if (await isValidUsername(user, usernameWithRandomString)) {
    return usernameWithRandomString;
  } else {
    return getValidUsernameRecur(user, username);
  }
}

const RNG = XorShiftRng.fromSeed(Date.now());

function randomString() {
  return RNG.uniformIntRng(0, 9).iter().take(4).toArray().join("");
}
