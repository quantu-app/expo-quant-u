import { IState } from "../lib/state";
import { PEER_ID } from "./definitions";

export function selectPeers(state: IState) {
  return state.challenge.peers;
}

export function selectPeerResults(state: IState) {
  return selectPeers(state)
    .filter((_, key) => key !== PEER_ID)
    .map((peer) => peer.results);
}
