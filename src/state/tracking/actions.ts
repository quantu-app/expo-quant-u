import {
  ITracking,
  ITrackingCategory,
  ITrackingChapter,
  ITrackingCourse,
  ITrackingUnit,
  STORE_NAME,
  TrackingCategory,
  TrackingCourse,
  TrackingChapter,
  TrackingUnit,
  IBaseTrackingLesson,
  createFromType,
  ITrackingLesson,
  TrackingQuizSession,
  ITrackingQuizSession,
} from "./definitions";
import { state } from "../lib/state";
import { Map, RecordOf } from "immutable";

export const store = state.getStore(STORE_NAME);

export function viewCategory(category: string) {
  store.update((state) =>
    updateCategory(state, category, (category) => category.set("viewed", true))
  );
}

export function viewCourse(category: string, course: string) {
  store.update((state) =>
    updateCourse(state, category, course, (course) =>
      course.set("viewed", true)
    )
  );
}

export function viewChapter(category: string, course: string, chapter: string) {
  store.update((state) =>
    updateChapter(state, category, course, chapter, (chapter) =>
      chapter.set("viewed", true)
    )
  );
}

export function viewUnit(
  category: string,
  course: string,
  chapter: string,
  unit: string
) {
  store.update((state) =>
    updateUnit(state, category, course, chapter, unit, (unit) =>
      unit.set("viewed", true)
    )
  );
}

export function viewLesson(
  category: string,
  course: string,
  chapter: string,
  unit: string,
  lesson: string,
  type: string
) {
  store.update((state) =>
    updateLesson(
      state,
      category,
      course,
      chapter,
      unit,
      lesson,
      type,
      (lesson) => lesson.set("viewed", true)
    )
  );
}

export function updateQuizSession(
  category: string,
  course: string,
  chapter: string,
  unit: string,
  lesson: string,
  seed: number,
  updater: (
    quizSession: RecordOf<ITrackingQuizSession>
  ) => RecordOf<ITrackingQuizSession>
) {
  store.update((state) =>
    updateLesson(
      state,
      category,
      course,
      chapter,
      unit,
      lesson,
      "quiz",
      (quiz) =>
        quiz.update("sessions", (sessions) =>
          (
            sessions || Map<number, RecordOf<ITrackingQuizSession>>()
          ).update(seed, (quizSession) =>
            updater(quizSession || TrackingQuizSession({ seed }))
          )
        )
    )
  );
}

function updateCategory(
  state: RecordOf<ITracking>,
  category: string,
  updater: (
    category: RecordOf<ITrackingCategory>
  ) => RecordOf<ITrackingCategory>
) {
  return state.update("categories", (categories) =>
    categories.update(category, (category) =>
      updater(category || TrackingCategory())
    )
  );
}

function updateCourse(
  state: RecordOf<ITracking>,
  category: string,
  course: string,
  updater: (course: RecordOf<ITrackingCourse>) => RecordOf<ITrackingCourse>
) {
  return updateCategory(state, category, (category) =>
    category.update("courses", (courses) =>
      courses.update(course, (course) => updater(course || TrackingCourse()))
    )
  );
}

function updateChapter(
  state: RecordOf<ITracking>,
  category: string,
  course: string,
  chapter: string,
  updater: (course: RecordOf<ITrackingChapter>) => RecordOf<ITrackingChapter>
) {
  return updateCourse(state, category, course, (course) =>
    course.update("chapters", (chapters) =>
      chapters.update(chapter, (chapter) =>
        updater(chapter || TrackingChapter())
      )
    )
  );
}

function updateUnit(
  state: RecordOf<ITracking>,
  category: string,
  course: string,
  chapter: string,
  unit: string,
  updater: (unit: RecordOf<ITrackingUnit>) => RecordOf<ITrackingUnit>
) {
  return updateChapter(state, category, course, chapter, (chapter) =>
    chapter.update("units", (units) =>
      units.update(unit, (unit) => updater(unit || TrackingUnit()))
    )
  );
}

function updateLesson<T extends IBaseTrackingLesson = ITrackingLesson>(
  state: RecordOf<ITracking>,
  category: string,
  course: string,
  chapter: string,
  unit: string,
  lesson: string,
  type: string,
  updater: (lesson: RecordOf<T>) => RecordOf<T>
) {
  return updateUnit(state, category, course, chapter, unit, (unit) =>
    unit.update("lessons", (lessons) =>
      lessons.update(
        lesson,
        (lesson) => updater((lesson as any) || createFromType<T>(type)) as any
      )
    )
  );
}
