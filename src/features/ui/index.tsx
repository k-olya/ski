import React, { FC, useEffect } from "react";
import { useSelector, useDispatch } from "app/hooks";
import { UiScreen, setScreen } from "./slice";
import { Main } from "./c/main";
import { Game } from "./c/game";
import { Settings } from "./c/settings";
import { pause, unpause } from "features/game/slice";
import { Attributions } from "./c/attributions";
import { useProgress } from "@react-three/drei";

const components: Partial<Record<UiScreen, FC>> = {
  main: Main,
  game: Game,
  settings: Settings,
  attributions: Attributions,
};

export function Ui() {
  const dispatch = useDispatch();
  const { loaded, total } = useProgress();
  const { screen } = useSelector((s) => s.ui);
  const { gameState } = useSelector((s) => s.game);
  const kb = useSelector((s) => s.kb);

  useEffect(() => {
    if (kb.Escape) {
      if (screen !== "settings") {
        dispatch(pause());
        dispatch(setScreen("settings"));
      } else {
        dispatch(unpause());
        dispatch(setScreen(gameState === "playing" ? "game" : "main"));
      }
    }
  }, [dispatch, kb]);

  const C = components[screen];
  if (loaded && loaded === total && C) return <C />;
  return null;
}
