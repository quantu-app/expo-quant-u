import { StyleSheet, Image, View, useWindowDimensions } from "react-native";
import { Button, Headline, Subheading } from "react-native-paper";
import bg from "../../../assets/bg.jpg";
import { Layout } from "../../Layout";
import { useNavigation } from "@react-navigation/native";
import { COURSES_SCREEN } from "../../Navigation";
import { isSmallScreen } from "../../screens";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  contentSmall: {
    flex: 1,
    flexDirection: "column",
  },
  grid: {
    padding: 16,
    flex: 1,
  },
  space: {
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
  const windowDimensions = useWindowDimensions(),
    navigation = useNavigation();

  return (
    <Layout>
      <View style={styles.container}>
        <View
          style={
            isSmallScreen(windowDimensions.width)
              ? styles.contentSmall
              : styles.content
          }
        >
          <View style={styles.grid}>
            <Headline>Lifelong Learning</Headline>
            <Subheading>
              With our open platform designed for deep thinkers and lifelong
              learners, you can build, train and iteratively improve your
              reasoning and quantitative skills.
            </Subheading>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => navigation.navigate(COURSES_SCREEN)}
            >
              Courses
            </Button>
          </View>
          <View style={styles.grid}>
            <Image source={bg} style={styles.image} resizeMode="contain" />
          </View>
        </View>
        <View style={styles.space} />
      </View>
    </Layout>
  );
}
