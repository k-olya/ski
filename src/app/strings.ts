import uniq from "lodash.uniq";

export const mapStrings = (x: Map<string, string>): string[] =>
  uniq(Array.from(x.entries()).flatMap((y) => y)).sort();

export function offsetLookup(
  strings: string[],
  o: number = 1
): Map<string, number> {
  return new Map(strings.map((s, i) => [s, o * i]));
}
