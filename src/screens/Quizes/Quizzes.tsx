import { StyleSheet, Image, View } from "react-native";
import {
  Text,
  Button,
  Headline,
  Subheading,
  Divider,
} from "react-native-paper";
import bg from "../../../assets/bg.jpg";
import app from "../../../app.json";
import { Layout } from "../../Layout";

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
  footer: {
    padding: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  footerContent: {
    textAlign: "center",
  },
});

export function Quizzes() {
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
            <Button style={styles.button} mode="contained">
              Courses
            </Button>
          </View>
          <View style={styles.half}>
            <Image source={bg} style={styles.image} resizeMode="contain" />
          </View>
        </View>
      </View>
      <Divider />
      <View style={styles.footer}>
        <Text style={styles.footerContent}>
          &copy; {app.expo.name} {new Date().getFullYear()}
        </Text>
      </View>
    </Layout>
  );
}
