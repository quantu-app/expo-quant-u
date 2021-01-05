import { RecordOf, OrderedSet } from "immutable";
import { ICourse } from "./Course";

const COURSES: Record<string, Promise<RecordOf<ICourse>>> =
  (global as any).__GLOBAL_COURSES_INSTANCE__ ||
  ((global as any).__GLOBAL_COURSES_INSTANCE__ = {});

export function addCourse(name: string, generator: Promise<RecordOf<ICourse>>) {
  if (hasCourse(name)) {
    throw new Error(`${name} already exists`);
  }
  COURSES[name] = generator;
}

export function hasCourse(name: string): boolean {
  return COURSES.hasOwnProperty(name);
}

export function getCourse(name: string): Promise<RecordOf<ICourse>> {
  if (hasCourse(name)) {
    return COURSES[name];
  } else {
    throw new Error(`${name} doesn't exists`);
  }
}

export function getCourses(): OrderedSet<RecordOf<ICourse>> {
  return COURSES[name];
}
