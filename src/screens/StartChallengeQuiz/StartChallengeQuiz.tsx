import React, { useEffect, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button, Card, Divider, Text } from "@ui-kitten/components";
import { IQuiz } from "../../../course-lib";
import {
  START_CHALLENGE_QUIZ_SCREEN,
  CHALLENGE_QUIZ_SCREEN,
  ParamList,
} from "../../navigationConfig";
import {
  IPeer,
  Peer,
  PEER_ID,
  selectPeers,
  setReady,
  subscribeChallenge,
  unsubscribeChallenge,
} from "../../state/challenge";
import { useMapStateToProps } from "../../state";
import { Map, RecordOf } from "immutable";

const styles = StyleSheet.create({
  buttons: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  challenge: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
  },
});

export interface IStartChallengeQuizProps {
  quiz: IQuiz;
  routeParams: ParamList[typeof START_CHALLENGE_QUIZ_SCREEN];
  seed: number;
  id: string;
}

export function StartChallengeQuiz(props: IStartChallengeQuizProps) {
  const navigation = useNavigation(),
    peers = useMapStateToProps(selectPeers);

  useEffect(() => {
    subscribeChallenge(props.id);
    return unsubscribeChallenge;
  }, []);

  useMemo(() => {
    if (!peers.isEmpty() && getReadyCount(peers) === peers.size) {
      navigation.navigate(CHALLENGE_QUIZ_SCREEN, props.routeParams);
    }
  }, [peers, props.routeParams]);

  return (
    <Card disabled>
      <Text category="h1">{props.quiz.name}</Text>
      <Divider />
      <Text>{props.quiz.description}</Text>
      <Text>
        Ready {getReadyCount(peers)} out of {peers.size}
      </Text>
      <View style={styles.buttons}>
        <Button
          disabled={peers.size < 2 || peers.get(PEER_ID, Peer()).ready}
          appearance="filled"
          onPress={setReady}
        >
          Ready
        </Button>
      </View>
    </Card>
  );
}

function getReadyCount(peers: Map<string, RecordOf<IPeer>>) {
  return peers
    .valueSeq()
    .reduce((acc, peer) => (peer.ready ? acc + 1 : acc), 0);
}
