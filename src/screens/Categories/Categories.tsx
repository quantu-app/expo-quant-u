import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, View } from "react-native";
import { Text, Button, Card } from "@ui-kitten/components";
import { getCategories } from "../../../course-lib/categories";
import { excerpt } from "../../excerpt";
import { CATEGORY_SCREEN } from "../../navigationConfig";
import { viewCategory } from "../../state/tracking";

const styles = StyleSheet.create({
  grid: {
    marginBottom: 16,
    flex: 1,
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "wrap",
  },
  card: {
    maxWidth: 256,
    marginTop: 16,
  },
  buttons: {
    marginTop: 16,
    alignItems: "center",
  },
});

export function Categories() {
  const navigation = useNavigation();

  return (
    <>
      <Card disabled>
        <Text category="h1">Categories</Text>
      </Card>
      <View style={styles.grid}>
        {getCategories().map((category) => (
          <Card key={category.url} style={styles.card}>
            <Text category="h1">{category.name}</Text>
            {category.logo && (
              <Image
                source={category.logo}
                resizeMode="contain"
                style={{ height: 128 }}
              />
            )}
            <Text>{excerpt(category.description)}</Text>
            <View style={styles.buttons}>
              <Button
                appearance="filled"
                onPress={() => {
                  viewCategory(category.url);
                  navigation.navigate(CATEGORY_SCREEN, {
                    category: category.url,
                  });
                }}
              >
                Start
              </Button>
            </View>
          </Card>
        ))}
      </View>
    </>
  );
}
