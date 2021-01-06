import { ICategory } from "./interfaces";

const CATEGORIES: Record<string, ICategory> =
  (global as any).__GLOBAL_CATEGORIES_INSTANCE__ ||
  ((global as any).__GLOBAL_CATEGORIES_INSTANCE__ = {});

export function addCategory(category: ICategory) {
  if (hasCategory(category.url)) {
    throw new Error(`${category.url} already exists`);
  }
  CATEGORIES[category.url] = category;
}

export function hasCategory(url: string): boolean {
  return CATEGORIES.hasOwnProperty(url);
}

export function getCategory(url: string): ICategory {
  if (hasCategory(url)) {
    return CATEGORIES[url];
  } else {
    throw new Error(`${url} doesn't exists`);
  }
}

export function getCategories(): ICategory[] {
  return Object.values(CATEGORIES);
}
