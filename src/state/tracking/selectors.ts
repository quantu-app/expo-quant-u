import { IState } from "../lib/state";
import {
  IBaseTrackingLesson,
  ITrackingLesson,
  TrackingCategory,
  TrackingCourse,
  TrackingUnit,
  createFromType,
  TrackingChapter,
} from "./definitions";

export function selectCategories(state: IState) {
  return state.tracking.categories;
}

export function selectCategory(state: IState, category: string) {
  return state.tracking.categories.get(category, TrackingCategory());
}

export function selectCourse(state: IState, category: string, course: string) {
  return selectCategory(state, category).courses.get(course, TrackingCourse());
}

export function selectChapter(
  state: IState,
  category: string,
  course: string,
  chapter: string
) {
  return selectCourse(state, category, course).chapters.get(
    chapter,
    TrackingChapter()
  );
}

export function selectUnit(
  state: IState,
  category: string,
  course: string,
  chapter: string,
  unit: string
) {
  return selectChapter(state, category, course, chapter).units.get(
    unit,
    TrackingUnit()
  );
}

export function selectLesson<T extends IBaseTrackingLesson = ITrackingLesson>(
  state: IState,
  category: string,
  course: string,
  chapter: string,
  unit: string,
  lesson: string,
  type: string
) {
  return selectUnit(state, category, course, chapter, unit).lessons.get(
    lesson,
    createFromType<T>(type)
  );
}
