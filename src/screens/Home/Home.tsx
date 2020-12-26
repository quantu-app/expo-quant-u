import { StyleSheet, Image, View } from "react-native";
import { Text, Button } from "react-native-paper";
import bg from "../../../assets/bg.jpg";
import app from "../../../app.json";
import { Layout } from "../../Layout";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gird: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 386,
  },
  half: {
    padding: 16,
    width: "50%",
  },
  image: {
    height: "100%",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignContent: "center",
  },
});

export function Home() {
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.gird}>
          <View style={styles.half}>
            <Text>Lifelong Learning</Text>
            <Text>
              With our open platform designed for deep thinkers and lifelong
              learners, you can build, train and iteratively improve your
              reasoning and quantitative skills.
            </Text>
            &nbsp;
            <Button mode="contained">Courses</Button>
          </View>
          <View style={styles.half}>
            <Image source={bg} style={styles.image} resizeMode="contain" />
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text>
          &copy; {app.expo.name} {new Date().getFullYear()}
        </Text>
      </View>
    </Layout>
  );
}
