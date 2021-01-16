import { Platform } from "react-native";

export const HOME_SCREEN = "Home",
  PROFILE_SCREEN = "Profile",
  CATEGORIES_SCREEN = "Categories",
  CATEGORY_SCREEN = "Category",
  COURSE_SCREEN = "Course",
  CHAPTER_SCREEN = "Chapter",
  UNIT_SCREEN = "Unit",
  START_QUIZ_SCREEN = "Start Quiz",
  QUIZ_SCREEN = "Quiz",
  DEFAULT_SCREEN = HOME_SCREEN;

export type ParamList = {
  [HOME_SCREEN]: undefined;
  [PROFILE_SCREEN]: undefined;
  [CATEGORIES_SCREEN]: undefined;
  [CATEGORY_SCREEN]: { category: string };
  [COURSE_SCREEN]: { category: string; course: string };
  [CHAPTER_SCREEN]: { category: string; course: string; chapter: string };
  [UNIT_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
  };
  [START_QUIZ_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
    quiz: string;
  };
  [QUIZ_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
    quiz: string;
    seed: number;
  };
};

export const ENABLE_LINKING =
  global.location?.hostname === "localhost" ||
  (!("electron" in (global.process?.versions || {})) && Platform.OS !== "web");

export const linking = {
  prefixes: [
    "https://quant-u.com",
    "quant-u://",
    "https://quantu-app.github.io/expo-quant-u",
  ],
  config: {
    screens: {
      [HOME_SCREEN]: "",
      [PROFILE_SCREEN]: "profile",
      [CATEGORIES_SCREEN]: "categories",
      [CATEGORY_SCREEN]: ":category",
      [COURSE_SCREEN]: ":category/:course",
      [CHAPTER_SCREEN]: ":category/:course/:chapter",
      [UNIT_SCREEN]: ":category/:course/:chapter/:unit",
      [START_QUIZ_SCREEN]:
        ":category/:course/:chapter/:unit/quizzes/:quiz/start",
      [QUIZ_SCREEN]: {
        path: ":category/:course/:chapter/:unit/quizzes/:quiz",
        parse: {
          seed: Number,
        },
      },
    },
  },
};

if (ENABLE_LINKING && process.env.NODE_ENV !== "production") {
  linking.prefixes.push(
    `${global.location?.protocol}//${global.location?.host}:${global.location?.port}`
  );
}
