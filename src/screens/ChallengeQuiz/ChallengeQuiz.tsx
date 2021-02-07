import React from "react";
import { XorShiftRng } from "@aicacia/rand";
import { Text, Card, Divider } from "@ui-kitten/components";
import { IQuiz } from "../../../course-lib";
import { Quiz as QuizClass } from "../../../course-lib/quiz";
import { FixedQuiz } from "../../Quiz";
import { useMapStateToProps } from "../../state";
import { PEER_ID, selectPeers, setResult } from "../../state/challenge";
import { View } from "react-native";
import { Status } from "../../Quiz/Status";

export interface IChallengeQuizProps {
  quiz: IQuiz;
  seed: number;
  id: string;
}

export function ChallengeQuiz(props: IChallengeQuizProps) {
  return (
    <Card disabled>
      <Text category="h1">{props.quiz.name}</Text>
      <Divider />
      <PeerStatus />
      <FixedQuiz
        quiz={QuizClass.fromQuizData(props.quiz as IQuiz)}
        rng={XorShiftRng.fromSeed(props.seed)}
        onResult={setResult}
      />
    </Card>
  );
}

function PeerStatus() {
  const peers = useMapStateToProps(selectPeers);

  return (
    <View>
      {peers
        .filter((_, key) => key !== PEER_ID)
        .valueSeq()
        .map((peer, index) => (
          <Status
            key={index}
            current={-1}
            results={peer.results}
            done={false}
          />
        ))}
    </View>
  );
}
