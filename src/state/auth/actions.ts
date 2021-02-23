import { firebase } from "../../firebase";
import { IUserExtra, STORE_NAME, User, UserExtra } from "./definitions";
import { state } from "../lib/state";
import { none, Option } from "@aicacia/core";
import { Map, RecordOf } from "immutable";
import { XorShiftRng } from "@aicacia/rand";
import { firebaseSignInWithGoogle } from "./firebaseSignInWithGoogle";

export const store = state.getStore(STORE_NAME);

window.addEventListener("beforeunload", () => {
  const state = store.getCurrent();

  if (state.isSignedIn) {
    setUserOnline(state.user.uid, false);
  }
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    signUserIn(user, false);
  } else {
    signUserOut();
  }
});

export function setUserOnline(uid: string, online: boolean) {
  return firebase.database().ref(`users/${uid}`).child("online").set(online);
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

export async function isValidUsername(uid: string, username = "") {
  const dataSnapshot = await firebase
    .database()
    .ref("users")
    .orderByChild("username")
    .equalTo(username)
    .once("value");

  return (
    !dataSnapshot.exists() || Object.keys(dataSnapshot.val()).includes(uid)
  );
}

export async function findByUsername(uid: string, username = "") {
  const dataSnapshot = await firebase
      .database()
      .ref("users")
      .orderByChild("username")
      .startAt(username)
      .endAt(username + "\uf8ff")
      .once("value"),
    users: Record<string, any> = dataSnapshot.val() || {};

  return Object.keys(users).reduce((acc, id) => {
    const otherUser = UserExtra(users[id]);

    if (id === uid || !otherUser.online) {
      return acc;
    } else {
      return acc.set(id, otherUser);
    }
  }, Map<string, RecordOf<IUserExtra>>());
}

export function setUserExtra(uid: string, userExtra: IUserExtra) {
  return firebase
    .database()
    .ref(`users/${uid}`)
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

async function subscribeUserExtra(
  uid: string,
  displayName: string,
  isNewUser: boolean
) {
  const ref = firebase.database().ref(`users/${uid}`);

  unsubscribeUserExtra();
  USER_EXTRA_REF.replace(ref);

  ref.on("value", (snapshot) => {
    const data: IUserExtra = snapshot.val() || {};

    store.update((state) =>
      state.update("user", (user) =>
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
    );
  });

  if (isNewUser) {
    const snapshot = await ref.child("username").once("value"),
      username = await getValidUsername(
        uid,
        snapshot.val() || displayName.toLowerCase().replace(/\s+/g, "")
      );

    await firebase
      .database()
      .ref(`users/${uid}`)
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

  subscribeUserExtra(user.uid, user.displayName || "", isNewUser);
  setUserOnline(user.uid, true);

  return store.update((state) =>
    state.set("isSignedIn", true).set("user", user).set("signInUpOpen", false)
  );
}

function signUserOut() {
  unsubscribeUserExtra();
  return store.update((state) => {
    if (state.isSignedIn) {
      setUserOnline(state.user.uid, false);
    }
    return state.set("isSignedIn", false).set("user", User());
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
  uid: string,
  username: string
): Promise<string> {
  if (await isValidUsername(uid, username)) {
    return username;
  } else {
    return getValidUsernameRecur(uid, username);
  }
}

async function getValidUsernameRecur(
  uid: string,
  username: string
): Promise<string> {
  const usernameWithRandomString = `${username}${randomString()}`;

  if (await isValidUsername(uid, usernameWithRandomString)) {
    return usernameWithRandomString;
  } else {
    return getValidUsernameRecur(uid, username);
  }
}

const RNG = XorShiftRng.fromSeed(Date.now());

function randomString() {
  return RNG.uniformIntRng(0, 9).iter().take(4).toArray().join("");
}
