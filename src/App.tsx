import React from "react";
import { Game } from "features/game";
import { Canvas2d } from "features/canvas2d";
import { Ui } from "features/ui";
import { Kb } from "features/kb";
import { Sound } from "features/sound";
import {DisableContextMenu} from "features/ui/c/disable-context-menu";

const App = () => (
  <div className="w-screen h-screen select-none bg-gray-900">
    <Game />
    <Ui />
    <Kb />
    <Sound />
    {/*<Canvas2d />*/}
    <DisableContextMenu />
  </div>
);

export default App;
