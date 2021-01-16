import React from "react";
import { StyleSheet, Image, useWindowDimensions } from "react-native";
import { Text, Button, Layout } from "@ui-kitten/components";
import bg from "../../../assets/bg.jpg";
import { useNavigation } from "@react-navigation/native";
import { CATEGORY_SCREEN } from "../../navigationConfig";
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
    <Layout style={styles.container}>
      <Layout
        style={
          isSmallScreen(windowDimensions.width)
            ? styles.contentSmall
            : styles.content
        }
      >
        <Layout style={styles.grid}>
          <Image source={bg} style={styles.image} resizeMode="contain" />
        </Layout>
        <Layout style={styles.grid}>
          <Text category="h3">Lifelong Learning</Text>
          <Text category="h4">
            With our open platform designed for deep thinkers and lifelong
            learners, you can build, train and iteratively improve your
            reasoning and quantitative skills.
          </Text>
          <Button
            style={styles.button}
            appearance="filled"
            onPress={() =>
              navigation.navigate(CATEGORY_SCREEN, {
                category: "mathematics",
              })
            }
          >
            Mathematics
          </Button>
        </Layout>
      </Layout>
    </Layout>
  );
}
