import { firebase } from "../../firebase";
import { PEER_ID, STORE_NAME, peersfromJSON, Peer } from "./definitions";
import { state } from "../lib/state";
import { none, Option } from "@aicacia/core";
import { RecordOf } from "immutable";
import { IQuestionResult } from "../../Quiz/QuestionResult";

export const store = state.getStore(STORE_NAME);

const CHALLENGE_REF: Option<firebase.database.Reference> = none();

window.addEventListener("beforeunload", unsubscribeChallenge);

export function subscribeChallenge(challengeId: string) {
  const ref = firebase.database().ref(`challenges/${challengeId}`);

  unsubscribeChallenge();
  CHALLENGE_REF.replace(ref);

  ref.on("value", (snapshot) => {
    store.update((state) =>
      state.set("peers", peersfromJSON(snapshot.val() || {}))
    );
  });

  ref.child(PEER_ID).set(Peer().toJS());
}

export function unsubscribeChallenge() {
  if (CHALLENGE_REF.isSome()) {
    const ref = CHALLENGE_REF.unwrap();
    ref.off("value");
    ref.child(PEER_ID).remove();
  }
  CHALLENGE_REF.clear();
}

export function setReady() {
  if (CHALLENGE_REF.isSome()) {
    const ref = CHALLENGE_REF.unwrap();
    ref.child(PEER_ID).child("ready").set(true);
  }
}

export function setResult(index: number, result: RecordOf<IQuestionResult>) {
  if (CHALLENGE_REF.isSome()) {
    const ref = CHALLENGE_REF.unwrap();
    ref
      .child(PEER_ID)
      .child("results")
      .child(index.toString())
      .set(result.toJS());
  }
}
