import React from "react";
import { StyleSheet, View, Image, useWindowDimensions } from "react-native";
import { Text, Button, Card } from "@ui-kitten/components";
import bg from "../../../assets/bg.jpg";
import { useNavigation } from "@react-navigation/native";
import { CATEGORY_SCREEN } from "../../navigationConfig";
import { isSmallScreen } from "../../screens";

const styles = StyleSheet.create({
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
    height: "100%",
  },
  imageSmall: {
    height: 256,
  },
});

export function Home() {
  const windowDimensions = useWindowDimensions(),
    navigation = useNavigation();

  return (
    <Card disabled>
      <View
        style={
          isSmallScreen(windowDimensions.width)
            ? styles.contentSmall
            : styles.content
        }
      >
        <View style={styles.grid}>
          <Image
            source={bg}
            style={
              isSmallScreen(windowDimensions.width)
                ? styles.imageSmall
                : styles.image
            }
            resizeMode="contain"
          />
        </View>
        <View style={styles.grid}>
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
        </View>
      </View>
    </Card>
  );
}
