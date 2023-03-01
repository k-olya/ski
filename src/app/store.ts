import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import game from "features/game/slice";
import ui from "features/ui/slice";

export const store = configureStore({
  reducer: { game, ui },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
