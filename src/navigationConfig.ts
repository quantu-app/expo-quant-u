import { createURL } from "expo-linking";

export const HOME_SCREEN = "Home",
  PROFILE_SCREEN = "Profile",
  CATEGORIES_SCREEN = "Categories",
  CATEGORY_SCREEN = "Category",
  COURSE_SCREEN = "Course",
  CHAPTER_SCREEN = "Chapter",
  UNIT_SCREEN = "Unit",
  START_PRACTICE_UNIT_SCREEN = "Start Practice Unit",
  PRACTICE_UNIT_SCREEN = "Practice Unit",
  START_QUIZ_SCREEN = "Start Quiz",
  QUIZ_SCREEN = "Quiz",
  START_CHALLENGE_QUIZ_SCREEN = "Start Challenge Quiz",
  CHALLENGE_QUIZ_SCREEN = "Challenge Quiz",
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
  [START_PRACTICE_UNIT_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
  };
  [PRACTICE_UNIT_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
    seed: number;
  };
  [START_QUIZ_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
    lesson: string;
    seed: number;
  };
  [QUIZ_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
    lesson: string;
    seed: number;
  };
  [START_CHALLENGE_QUIZ_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
    lesson: string;
    seed: number;
    id: string;
  };
  [CHALLENGE_QUIZ_SCREEN]: {
    category: string;
    course: string;
    chapter: string;
    unit: string;
    lesson: string;
    seed: number;
    id: string;
  };
};

export const linking = {
  prefixes: [createURL("/")],
  config: {
    screens: {
      [HOME_SCREEN]: "",
      [PROFILE_SCREEN]: "profile",
      [CATEGORIES_SCREEN]: "categories",
      [CATEGORY_SCREEN]: ":category",
      [COURSE_SCREEN]: ":category/:course",
      [CHAPTER_SCREEN]: ":category/:course/:chapter",
      [UNIT_SCREEN]: ":category/:course/:chapter/:unit",
      [START_PRACTICE_UNIT_SCREEN]:
        ":category/:course/:chapter/:unit/start-practice",
      [PRACTICE_UNIT_SCREEN]: {
        path: ":category/:course/:chapter/:unit/practice",
        parse: {
          seed: Number,
        },
      },
      [START_QUIZ_SCREEN]: {
        path: ":category/:course/:chapter/:unit/:lesson/start",
        parse: {
          seed: Number,
        },
      },
      [QUIZ_SCREEN]: {
        path: ":category/:course/:chapter/:unit/:lesson",
        parse: {
          seed: Number,
        },
      },
      [START_CHALLENGE_QUIZ_SCREEN]: {
        path: ":category/:course/:chapter/:unit/:lesson/challenge/start",
        parse: {
          seed: Number,
        },
      },
      [CHALLENGE_QUIZ_SCREEN]: {
        path: ":category/:course/:chapter/:unit/:lesson/challenge",
        parse: {
          seed: Number,
        },
      },
    },
  },
};
