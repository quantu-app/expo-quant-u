import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet } from "react-native";
import { Text, Button, Layout } from "@ui-kitten/components";
import { getCategories } from "../../../course-lib/categories";
import { excerpt } from "../../excerpt";
import { CATEGORY_SCREEN } from "../../navigationConfig";

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    paddingLeft: 16,
  },
  card: {
    margin: 16,
    width: 196,
  },
});

export function Categories() {
  const navigation = useNavigation();

  return (
    <>
      <Layout style={styles.title}>
        <Text category="h1">Categories</Text>
      </Layout>
      {getCategories().map((category) => (
        <Layout key={category.url} style={styles.card}>
          <Text category="h1">{category.name}</Text>
          {category.logo && (
            <Image
              source={category.logo}
              resizeMode="contain"
              style={{ height: 128 }}
            />
          )}
          <Text>{excerpt(category.description)}</Text>
          <Button
            appearance="filled"
            onPress={() =>
              navigation.navigate(CATEGORY_SCREEN, {
                category: category.url,
              })
            }
          >
            Start
          </Button>
        </Layout>
      ))}
    </>
  );
}
