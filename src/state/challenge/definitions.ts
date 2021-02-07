import { IJSONObject } from "@aicacia/json";
import { Map, List, Record, RecordOf } from "immutable";
import { IQuestionResult, QuestionResult } from "../../Quiz/QuestionResult";

export const PEER_ID = `quantu-com-${Math.random().toString(36).slice(2)}`;

export interface IPeer {
  ready: boolean;
  results: List<RecordOf<IQuestionResult>>;
}

export const Peer = Record<IPeer>({
  ready: false,
  results: List(),
});

export function peerFromJSON(json: IJSONObject): RecordOf<IPeer> {
  return Peer({
    ready: json.ready === true,
    results: List(
      ((json.results || []) as Array<IJSONObject>).map(QuestionResult)
    ),
  });
}

export function peersfromJSON(json: IJSONObject) {
  return Object.keys(json).reduce(
    (peers, id) => peers.set(id, peerFromJSON(json[id] as IJSONObject)),
    Map<string, RecordOf<IPeer>>()
  );
}

export interface IChallenge {
  peers: Map<string, RecordOf<IPeer>>;
}

export const Challenge = Record<IChallenge>({
  peers: Map(),
});

export function fromJSON(json: IJSONObject): RecordOf<IChallenge> {
  return Challenge({
    peers: peersfromJSON(json.peers as IJSONObject),
  });
}

export const STORE_NAME = "challenge";
export const INITIAL_STATE = Challenge();
