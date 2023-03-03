import { range } from "app/math";
import { reverseMap } from "app/reverse-map";

export const subtract = new Map<string, string>(
  range(1, 20).flatMap((i) =>
    range(i + 1, 21).map((j) => [`${j}-${i}`, `${j - i}`])
  )
);

export const sub_reverse = reverseMap(subtract);
