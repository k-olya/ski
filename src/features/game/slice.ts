import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { abs, clamp, lerp, sqrt, pow, rand } from "app/math";
import { KbState } from "features/kb/slice";

import { A, V, Vx, Vboost, Vslow, CLOCK_DELTA, SLOPE_LENGTH, SLOPE_WIDTH, EXTRA_PLAYER_PADDING } from "config";
import { add } from "config/quiz/add";

export interface Flag {
  correct: boolean;
  text: string;
  x: number;
  z: number;
}

export interface GameState {
  start: number;
  activeQuestion: [string, string | string[]];
  gameLoopActive: boolean;
  velocity: number;
  score: number;
  inARow: number;
  flags: Flag[];
  delta: number;
  ticks: number;
  playerX: number;
}

const initialState: GameState = {
  start: 0,
  activeQuestion: ["", ""],
  gameLoopActive: true,
  velocity: 0,
  score: 0,
  inARow: 0,
  flags: [{
    correct: false,
    text: "2×2",
    x: -1, z: -SLOPE_LENGTH
  },
  {
    correct: true,
    text: "SAS",
    x: 1, z: -SLOPE_LENGTH / 6
  },
  {
    correct: false,
    text: "4",
    x: 2, z: - 2 * SLOPE_LENGTH / 6
  },
  {
    correct: false,
    text: "3",
    x: 3, z: - 3 * SLOPE_LENGTH / 6
  },
  {
    correct: false,
    text: "2",
    x: 3, z: - 4 * SLOPE_LENGTH / 6
  },
  {
    correct: true,
    text: "1",
    x: 3, z: - 5 * SLOPE_LENGTH / 6
  }],
  delta: 0,
  ticks: 0,
  playerX: 0,
};

export const slice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame: (state) => {
      state.start = Date.now();
      state.gameLoopActive = true;
    },
    pause: (state) => {
      state.gameLoopActive = false;
    },
    unpause: (state) => {
      state.gameLoopActive = true;
    },
    reset: (state) => initialState,
    tick: (
      state,
      { payload }: PayloadAction<{ delta: number; kb: KbState }>
    ) => {
      if (state.gameLoopActive) {
        const { delta, kb } = payload;
        state.delta = delta;
        const Vmax = Math.max(kb.ArrowUp ? Vboost : kb.ArrowDown ? Vslow : V, state.velocity - delta * A);
        state.velocity = clamp(state.velocity + delta * A, 0, Vmax);
        state.ticks++;
        const extraPosition = sqrt(clamp((abs(state.playerX) - SLOPE_WIDTH / 2) / EXTRA_PLAYER_PADDING * 2, 0.0, 0.65));
        const sign = (state.playerX / abs(state.playerX) || 0)
        const gravity = extraPosition ? - pow(1 - extraPosition, 1.5) * sign * 0.025 : 0;
        state.playerX = clamp(
          state.playerX + gravity + Vx * (state.velocity / V) * (1 - extraPosition) * delta * (Number(kb.ArrowLeft || 0) - Number(kb.ArrowRight || 0)), -(SLOPE_WIDTH + EXTRA_PLAYER_PADDING) / 2, (SLOPE_WIDTH + EXTRA_PLAYER_PADDING) / 2
        );
        state.flags = state.flags.map(flag => ({...flag, x: flag.z > 0 ? rand(- SLOPE_WIDTH / 2, SLOPE_WIDTH / 2) : flag.x, z: flag.z > 0 ? -SLOPE_LENGTH : flag.z + state.velocity * delta }))
      }
    },
  },
});

export const { startGame, pause, unpause, reset, tick } = slice.actions;

export default slice.reducer;
