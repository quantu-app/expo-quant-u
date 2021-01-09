export const MAX_LENGTH = 128;

export function excerpt(string: string) {
  if (string.length <= MAX_LENGTH) {
    return string;
  } else {
    return string.slice(0, MAX_LENGTH) + "...";
  }
}
