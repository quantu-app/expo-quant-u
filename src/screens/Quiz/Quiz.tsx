import { Async } from "@aicacia/async_component-react";
import { none, Option, some } from "@aicacia/core";
import { Quiz as QuizClass } from "../../quizlib";
import { Quiz as QuizComponent } from "../../Quiz";
import { Layout } from "../../Layout";
import quizzes from "../../quizzes.json";
import { IQuizSection } from "../Quizes/IQuizSection";
import { XorShiftRng } from "@aicacia/rand";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { Title } from "react-native-paper";

export interface IQuizProps {
  index: number;
  path: string[];
}

export function Quiz(props: IQuizProps) {
  return (
    <Layout>
      {getQuizSection(quizzes, props.path)
        .map((section) => section.quizzes[props.index])
        .map((quiz) => (
          <Async
            key={0}
            promise={QuizClass.fromJSON(quiz as any)}
            onSuccess={(quiz) => (
              <QuizComponent
                rng={XorShiftRng.fromSeed(Date.now())}
                quiz={quiz}
              />
            )}
            onError={(error) => <JSError error={error} />}
            onPending={() => <Loading />}
          />
        ))
        .unwrapOrElse(() => (
          <Title>
            No Quiz Found at path {props.path.join("/")} with id {props.index}
          </Title>
        ))}
    </Layout>
  );
}

function getQuizSection(
  section: IQuizSection,
  path: string[]
): Option<IQuizSection> {
  const nextSectionKey = path.shift();

  if (nextSectionKey) {
    const nextSection = section.sections[nextSectionKey];

    if (path.length) {
      if (nextSection) {
        return getQuizSection(nextSection, path);
      } else {
        return none();
      }
    } else {
      return some(nextSection);
    }
  }
  return none();
}
