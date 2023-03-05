import React, { FC } from "react";
import { useSelector } from "app/hooks";
import { UiScreen } from "./slice";
import { Main } from "./c/main";
import { Game } from "./c/game";
import { Settings } from "./c/settings";

const components: Partial<Record<UiScreen, FC>> = {
  main: Main,
  game: Game,
  settings: Settings,
};

export function Ui() {
  const { screen } = useSelector((s) => s.ui);
  const C = components[screen];
  if (C) return <C />;
  return null;
}
