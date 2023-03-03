import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clamp, lerp } from "app/math";

import { A, V, CLOCK_DELTA, SLOPE_LENGTH } from "config";
import { add } from "config/quiz/add";

export interface Flag {
  correct: boolean;
  text: string;
  x: number;
  y: number;
}

export interface GameState {
  start: number;
  activeQuestion: [string, string | string[]]
  gameLoopActive: boolean;
  velocity: number;
  score: number;
  inARow: number;
  flags: Flag[];
  delta: number;
  ticks: number;
}

const initialState: GameState = {
  start: 0,
  activeQuestion: ['', ''],
  gameLoopActive: true,
  velocity: 0,
  score: 0,
  inARow: 0,
  flags: [],
  delta: 0,
  ticks: 0
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
      state.gameLoopActive = false
    },
    unpause: (state) => {
      state.gameLoopActive = true
    },
    reset: (state) => initialState,
    tick: (state, { payload }: PayloadAction<number>) => {
      if (state.gameLoopActive) {
        const delta = payload
        state.delta = delta
        state.velocity = clamp(state.velocity + delta * A, 0, V);
        state.ticks++;
      }
    }
  }
});

export const { startGame, pause, unpause, reset, tick } = slice.actions;

export default slice.reducer;
