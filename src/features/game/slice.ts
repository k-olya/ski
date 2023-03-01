import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { add } from "config/quiz/add";

export interface GameState {
  start: number;
  activeQuestion: [string, string]
}

const initialState: GameState = {
  start: 0,
  activeQuestion: ['', '']
};

export const slice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame: (state) => {
      state.start = Date.now();
    },
  },
});

export const { startGame } = slice.actions;

export default slice.reducer;
