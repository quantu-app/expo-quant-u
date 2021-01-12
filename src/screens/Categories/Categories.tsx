import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet } from "react-native";
import { Card, Title, Button, Surface, Paragraph } from "react-native-paper";
import { getCategories } from "../../../course-lib/categories";
import { excerpt } from "../../excerpt";
import { CATEGORY_SCREEN } from "../../Navigation";

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
      <Surface style={styles.title}>
        <Title>Categories</Title>
      </Surface>
      {getCategories().map((category) => (
        <Card key={category.url} style={styles.card}>
          <Card.Content>
            <Title>{category.name}</Title>
            {category.logo && (
              <Image
                source={category.logo}
                resizeMode="contain"
                style={{ height: 128 }}
              />
            )}
            <Paragraph>{excerpt(category.description)}</Paragraph>
            <Button
              mode="contained"
              onPress={() =>
                navigation.navigate(CATEGORY_SCREEN, {
                  category: category.url,
                })
              }
            >
              Start
            </Button>
          </Card.Content>
        </Card>
      ))}
    </>
  );
}
