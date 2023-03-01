import { range } from "app/math";
import { reverseMap } from "app/reverse-map";

export const multiply = new Map<string, string>(range(2, 10).flatMap(i => range(2, 10).map(j => [`${j}×${i}`, `${j * i}`])))

export const multiply_reverse = reverseMap(multiply)
