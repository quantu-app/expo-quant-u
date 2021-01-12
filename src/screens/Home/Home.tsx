import React from "react";
import { StyleSheet, Image, View, useWindowDimensions } from "react-native";
import { Button, Headline, Subheading, Surface } from "react-native-paper";
import bg from "../../../assets/bg.jpg";
import { useNavigation } from "@react-navigation/native";
import { CATEGORY_SCREEN } from "../../Navigation";
import { isSmallScreen } from "../../screens";

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
  },
  content: {
    flexDirection: "row",
  },
  contentSmall: {
    flexDirection: "column",
  },
  grid: {
    padding: 16,
    flex: 1,
  },
  button: {
    marginTop: 16,
  },
  image: {
    height: 256,
  },
});

export function Home() {
  const windowDimensions = useWindowDimensions(),
    navigation = useNavigation();

  return (
    <Surface style={styles.container}>
      <View
        style={
          isSmallScreen(windowDimensions.width)
            ? styles.contentSmall
            : styles.content
        }
      >
        <View style={styles.grid}>
          <Image source={bg} style={styles.image} resizeMode="contain" />
        </View>
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
            onPress={() =>
              navigation.navigate(CATEGORY_SCREEN, {
                category: "mathematics",
              })
            }
          >
            Mathematics
          </Button>
        </View>
      </View>
    </Surface>
  );
}
