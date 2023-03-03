import { rad, PI } from "app/math";

export const BORDER_ANGLE = PI / 6
export const BORDER_TAN = Math.tan(BORDER_ANGLE);
export const SLOPE_ANGLE = rad(12)
export const SLOPE_TAN = Math.tan(SLOPE_ANGLE)
export const SLOPE_LENGTH = 210
export const PLAYER_POSITION = -104

export const A = 3
export const V = 9

export const GAME_CLOCK_MS = 14
export const CLOCK_DELTA = 0.001 * GAME_CLOCK_MS
