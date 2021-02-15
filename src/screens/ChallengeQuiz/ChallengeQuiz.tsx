import React, { useMemo } from "react";
import { XorShiftRng } from "@aicacia/rand";
import { Text, Card, Divider } from "@ui-kitten/components";
import { Map, List, RecordOf } from "immutable";
import { IQuiz } from "../../../course-lib";
import { Quiz as QuizClass } from "../../../course-lib/quiz";
import { FixedQuiz } from "../../Quiz";
import { useMapStateToProps } from "../../state";
import { selectPeerResults, setResult } from "../../state/challenge";
import { View } from "react-native";
import { Status } from "../../Quiz/Status";
import { IQuestionResult } from "../../Quiz/QuestionResult";

export interface IChallengeQuizProps {
  quiz: IQuiz;
  seed: number;
  id: string;
}

export function ChallengeQuiz(props: IChallengeQuizProps) {
  const quiz = useMemo(() => QuizClass.fromQuizData(props.quiz as IQuiz), [
      props.quiz,
    ]),
    rng = useMemo(() => XorShiftRng.fromSeed(props.seed), [props.seed]),
    peers = useMapStateToProps(selectPeerResults);

  return (
    <Card disabled>
      <Text category="h1">{props.quiz.name}</Text>
      <Divider />
      <PeerStatus peers={peers} />
      <FixedQuiz quiz={quiz} rng={rng} peers={peers} onResult={setResult} />
    </Card>
  );
}

interface IPeerStatus {
  peers: Map<string, List<RecordOf<IQuestionResult>>>;
}

function PeerStatus(props: IPeerStatus) {
  return (
    <View>
      {props.peers.map((results, index) => (
        <Status key={index} current={-1} results={results} done={false} />
      ))}
    </View>
  );
}
