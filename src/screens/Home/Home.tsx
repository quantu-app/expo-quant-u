import { StyleSheet, Image, View } from "react-native";
import { Button, Headline, Subheading } from "react-native-paper";
import bg from "../../../assets/bg.jpg";
import { Layout } from "../../Layout";
import { useNavigation } from "@react-navigation/native";
import { QUIZZES_SCREEN } from "../../Navigation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gird: {
    flexDirection: "row",
  },
  half: {
    padding: 16,
    flex: 1,
  },
  button: {
    marginTop: 16,
  },
  image: {
    height: "100%",
  },
});

export function Home() {
  const navigation = useNavigation();

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.gird}>
          <View style={styles.half}>
            <Headline>Lifelong Learning</Headline>
            <Subheading>
              With our open platform designed for deep thinkers and lifelong
              learners, you can build, train and iteratively improve your
              reasoning and quantitative skills.
            </Subheading>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => navigation.navigate(QUIZZES_SCREEN)}
            >
              Quizzes
            </Button>
          </View>
          <View style={styles.half}>
            <Image source={bg} style={styles.image} resizeMode="contain" />
          </View>
        </View>
      </View>
    </Layout>
  );
}
