import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SoundLoadingState = {
  ui: boolean;
  add: boolean;
  sub: boolean;
  mul: boolean;
  numbers: boolean;
};

export type SoundState = {
  userInteracted: boolean;
  muted: boolean;
  musicVolume: number;
  speechVolume: number;
  sfxVolume: number;
  loading: SoundLoadingState;
  loaded: SoundLoadingState;
};

const initialState: SoundState = {
  userInteracted: false,
  muted: true,
  musicVolume: 0.1,
  speechVolume: 1.0,
  sfxVolume: 0.5,
  loading: {
    ui: false,
    add: false,
    sub: false,
    mul: false,
    numbers: false,
  },
  loaded: {
    ui: false,
    add: false,
    sub: false,
    mul: false,
    numbers: false,
  },
};

export const slice = createSlice({
  name: "sound",
  initialState,
  reducers: {
    setUserInteracted: state => {
      state.userInteracted = true;
    },
    mute: (state, { payload }: PayloadAction<boolean>) => {
      state.userInteracted = true;
      state.muted = payload;
    },
    unmute: state => {
      state.muted = false;
    },
    startLoading: (
      state,
      { payload }: PayloadAction<keyof SoundLoadingState>
    ) => {
      state.loading[payload] = true;
    },
    finishLoading: (
      state,
      { payload }: PayloadAction<keyof SoundLoadingState>
    ) => {
      state.loading[payload] = false;
      state.loaded[payload] = true;
    },
  },
});

export const { setUserInteracted, mute, unmute, startLoading, finishLoading } =
  slice.actions;

export default slice.reducer;
