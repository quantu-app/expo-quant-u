import { IState } from "../lib/state";

export function selectPeers(state: IState) {
  return state.challenge.peers;
}
