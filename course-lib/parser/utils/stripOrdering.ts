export function stripOrdering(name: string) {
  return name.replace(/^\d+[\-|_]/gi, "");
}
