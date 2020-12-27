export const LARGE_WIDTH = 1080;
export const SMALL_WIDTH = 640;

export function isLargeScreen(width: number) {
  return width >= LARGE_WIDTH;
}

export function isSmallScreen(width: number) {
  return width <= SMALL_WIDTH;
}
