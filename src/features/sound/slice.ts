import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type SoundState = {
  userInteracted: boolean;
  muted: boolean;
  musicVolume: number;
};

const initialState: SoundState = {
  userInteracted: false,
  muted: true,
  musicVolume: 1.0,
};

export const preventedDefaultKeys = [
  "AltLeft",
  "AltRight",
  "ShiftLeft",
  "ShiftRight",
];

export const slice = createSlice({
  name: "kb",
  initialState,
  reducers: {
    setUserInteracted: state => {
      state.userInteracted = true;
      state.muted = false;
    },
    mute: (state, { payload }: PayloadAction<boolean>) => {
      state.userInteracted = true;
      state.muted = payload;
    },
    unmute: state => {
      state.muted = false;
    },
  },
});

export const { setUserInteracted, mute, unmute } = slice.actions;

export default slice.reducer;
