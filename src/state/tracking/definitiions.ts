import { IJSONObject } from "@aicacia/json";
import { Record as ImmutableRecord, RecordOf, List, Map } from "immutable";

export interface IBaseTracking {
  viewed: boolean;
}

export interface IBaseTrackingLesson extends IBaseTracking {
  type: string;
}

export interface ITrackingQuestion {
  attempt: number;
  explained: boolean;
  correct: boolean;
  total: number;
  points: number;
  start: number;
  end: number;
}

export const TrackingQuestion = ImmutableRecord<ITrackingQuestion>({
  attempt: 0,
  explained: false,
  correct: false,
  total: 0,
  points: 0,
  start: 0,
  end: 0,
});

export interface ITrackingQuizSession {
  seed: number;
  results: List<RecordOf<ITrackingQuestion>>;
}

export const TrackingQuizSession = ImmutableRecord<ITrackingQuizSession>({
  seed: 0,
  results: List(),
});

export interface ITrackingQuiz extends IBaseTrackingLesson {
  type: "quiz";
  sessions: Map<number, RecordOf<ITrackingQuizSession>>;
}

export type ITrackingLesson = ITrackingQuiz;

export const TrackingQuiz = ImmutableRecord<ITrackingQuiz>({
  viewed: false,
  type: "quiz",
  sessions: Map(),
});

export function createFromType<T extends IBaseTrackingLesson = ITrackingLesson>(
  type: string
): RecordOf<T> {
  if (type === "quiz") {
    return TrackingQuiz() as any;
  } else {
    throw new TypeError(`Invalid type ${type}`);
  }
}

export function lessonFromJSON(
  lessonJSON: IJSONObject
): RecordOf<ITrackingLesson> {
  if (lessonJSON.type === "quiz") {
    return TrackingQuiz({
      viewed: lessonJSON.viewed === true,
    });
  } else {
    throw new TypeError(`Invalid type ${lessonJSON.type}`);
  }
}

export interface ITrackingUnit extends IBaseTracking {
  lessons: Map<string, RecordOf<ITrackingLesson>>;
}

export const TrackingUnit = ImmutableRecord<ITrackingUnit>({
  viewed: false,
  lessons: Map(),
});

export function unitFromJSON(unitJSON: IJSONObject): RecordOf<ITrackingUnit> {
  const lessonsJSON: Record<string, IJSONObject> = (unitJSON.lessons ||
    {}) as any;

  return TrackingUnit({
    lessons: Object.keys(lessonsJSON).reduce(
      (acc, key) => acc.set(key, lessonFromJSON(lessonsJSON[key])),
      Map<string, RecordOf<ITrackingLesson>>()
    ),
    viewed: unitJSON.viewed === true,
  });
}

export interface ITrackingChapter extends IBaseTracking {
  units: Map<string, RecordOf<ITrackingUnit>>;
}

export const TrackingChapter = ImmutableRecord<ITrackingChapter>({
  viewed: false,
  units: Map(),
});

export function chapterFromJSON(
  chapterJSON: IJSONObject
): RecordOf<ITrackingChapter> {
  const unitsJSON: Record<string, IJSONObject> = (chapterJSON.units ||
    {}) as any;

  return TrackingChapter({
    units: Object.keys(unitsJSON).reduce(
      (acc, key) => acc.set(key, unitFromJSON(unitsJSON[key])),
      Map<string, RecordOf<ITrackingUnit>>()
    ),
    viewed: chapterJSON.viewed === true,
  });
}

export interface ITrackingCourse extends IBaseTracking {
  chapters: Map<string, RecordOf<ITrackingChapter>>;
}

export const TrackingCourse = ImmutableRecord<ITrackingCourse>({
  viewed: false,
  chapters: Map(),
});

export function courseFromJSON(
  courseJSON: IJSONObject
): RecordOf<ITrackingCourse> {
  const chaptersJSON: Record<string, IJSONObject> = (courseJSON.chapters ||
    {}) as any;

  return TrackingCourse({
    chapters: Object.keys(chaptersJSON).reduce(
      (acc, key) => acc.set(key, chapterFromJSON(chaptersJSON[key])),
      Map<string, RecordOf<ITrackingChapter>>()
    ),
    viewed: courseJSON.viewed === true,
  });
}

export interface ITrackingCategory extends IBaseTracking {
  courses: Map<string, RecordOf<ITrackingCourse>>;
}

export const TrackingCategory = ImmutableRecord<ITrackingCategory>({
  courses: Map(),
  viewed: false,
});

export function categoryFromJSON(
  categoryJSON: IJSONObject
): RecordOf<ITrackingCategory> {
  const coursesJSON: Record<string, IJSONObject> = (categoryJSON.courses ||
    {}) as any;

  return TrackingCategory({
    courses: Object.keys(coursesJSON).reduce(
      (acc, key) => acc.set(key, courseFromJSON(coursesJSON[key])),
      Map<string, RecordOf<ITrackingCourse>>()
    ),
    viewed: categoryJSON.viewed === true,
  });
}

export interface ITracking {
  categories: Map<string, RecordOf<ITrackingCategory>>;
}

export const Tracking = ImmutableRecord<ITracking>({
  categories: Map(),
});

export function fromJSON(json: IJSONObject): RecordOf<ITracking> {
  const categoriesJSON: Record<string, IJSONObject> = (json.categories ||
    {}) as any;

  return Tracking({
    categories: Object.keys(categoriesJSON).reduce(
      (acc, key) => acc.set(key, categoryFromJSON(categoriesJSON[key])),
      Map<string, RecordOf<ITrackingCategory>>()
    ),
  });
}

export const STORE_NAME = "tracking";
export const INITIAL_STATE = Tracking();
