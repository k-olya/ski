import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clamp } from "app/math";

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
  activeSfx: string | null;
  activeSpeech: string | null;
};

const initialState: SoundState = {
  userInteracted: false,
  muted: true,
  musicVolume: 1.0,
  speechVolume: 1.0,
  sfxVolume: 1.0,
  activeSfx: null,
  activeSpeech: null,
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
      state.muted = payload || false;
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
    setActiveSfx: (state, { payload }: PayloadAction<string | null>) => {
      state.activeSfx = payload;
    },
    setActiveSpeech: (state, { payload }: PayloadAction<string | null>) => {
      state.activeSpeech = payload;
    },
    setMusicVolume: (state, { payload }: PayloadAction<number>) => {
      state.musicVolume = clamp(payload);
    },
    setSfxVolume: (state, { payload }: PayloadAction<number>) => {
      state.sfxVolume = clamp(payload);
    },
    setSpeechVolume: (state, { payload }: PayloadAction<number>) => {
      state.speechVolume = clamp(payload);
    },
  },
});

export const {
  setUserInteracted,
  mute,
  unmute,
  startLoading,
  finishLoading,
  setActiveSpeech,
  setActiveSfx,
  setMusicVolume,
  setSpeechVolume,
  setSfxVolume,
} = slice.actions;

export default slice.reducer;
