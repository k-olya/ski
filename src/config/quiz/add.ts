import { range } from "app/math";

export const add = new Map<string, string>(range(1, 10).flatMap(i => range(1, 10).map(j => [`${i}+${j}`, `${i + j}`])))
