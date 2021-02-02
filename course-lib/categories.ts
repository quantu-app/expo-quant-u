import { ICategory, IChapter, ICourse, ILesson, IUnit } from "./interfaces";

const CATEGORIES: Record<string, ICategory> = {};

export function addCategory(category: ICategory) {
  if (hasCategory(category.url)) {
    throw new Error(`${category.url} already exists`);
  }
  CATEGORIES[category.url] = category;
}

export function hasCategory(category: string): boolean {
  return CATEGORIES.hasOwnProperty(category);
}

export function getCategory(category: string): ICategory {
  return CATEGORIES[category];
}

export function getCategories(): ICategory[] {
  return Object.values(CATEGORIES);
}

export function getCourses(category: string): Promise<ICourse[]> {
  return Promise.all(
    getCategory(category).courses.map((promise) =>
      promise.then((module) => module.course)
    )
  );
}

export function getCourse(category: string, course: string): Promise<ICourse> {
  return getCategory(category).courseMap[course].then(
    (module) => module.course
  );
}

export async function getChapters(
  category: string,
  course: string
): Promise<IChapter[]> {
  return getCourse(category, course).then((course) => course.chapters);
}

export function getChapter(
  category: string,
  course: string,
  chapter: string
): Promise<IChapter> {
  return getCourse(category, course).then(
    (course) => course.chapterMap[chapter]
  );
}

export async function getUnits(
  category: string,
  course: string,
  chapter: string
): Promise<IUnit[]> {
  return getChapter(category, course, chapter).then((chapter) => chapter.units);
}

export function getUnit(
  category: string,
  course: string,
  chapter: string,
  unit: string
): Promise<IUnit> {
  return getChapter(category, course, chapter).then(
    (chapter) => chapter.unitMap[unit]
  );
}

export async function getLessons(
  category: string,
  course: string,
  chapter: string,
  unit: string
): Promise<ILesson[]> {
  return getUnit(category, course, chapter, unit).then((unit) => unit.lessons);
}

export function getLesson<T extends ILesson = ILesson>(
  category: string,
  course: string,
  chapter: string,
  unit: string,
  lesson: string
): Promise<T> {
  return getUnit(category, course, chapter, unit).then(
    (unit) => unit.lessonMap[lesson] as T
  );
}
