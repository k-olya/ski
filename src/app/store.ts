import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import game from "features/game/slice";
import ui from "features/ui/slice";
import kb from "features/kb/slice";
import sound from "features/sound/slice";

export const store = configureStore({
  reducer: { game, ui, kb, sound },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
