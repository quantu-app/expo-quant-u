import { ICategory } from "./interfaces";

const CATEGORIES: Record<string, ICategory> =
  (global as any).__GLOBAL_CATEGORIES_INSTANCE__ ||
  ((global as any).__GLOBAL_CATEGORIES_INSTANCE__ = {});

export function addCategory(category: ICategory) {
  if (hasCategory(category.name)) {
    throw new Error(`${category.name} already exists`);
  }
  CATEGORIES[category.name] = category;
}

export function hasCategory(name: string): boolean {
  return CATEGORIES.hasOwnProperty(name);
}

export function getCategory(name: string): ICategory {
  if (hasCategory(name)) {
    return CATEGORIES[name];
  } else {
    throw new Error(`${name} doesn't exists`);
  }
}

export function getCategories(): ICategory[] {
  return Object.values(CATEGORIES);
}
