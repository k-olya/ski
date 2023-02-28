import React from "react";
import { Game } from "features/game";
import { Ui } from "features/ui";

const App = () => (
  <div className="w-screen h-screen select-none bg-gray-900">
    <Game />
    <Ui />
  </div>
);

export default App;
