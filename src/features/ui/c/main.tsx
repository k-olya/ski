import { useEffect } from "react";
import { useSelector, useDispatch } from "app/hooks";
import { Controls } from "./controls";
import { PauseButton } from "./pause-button";
import { setScreen } from "../slice";

export const Main = () => {
  const dispatch = useDispatch();
  const { gameState } = useSelector((s) => s.game);
  useEffect(() => {
    if (gameState === "playing") {
      dispatch(setScreen("game"));
    }
  }, [gameState, dispatch]);
  return (
    <div className="fixed">
    <PauseButton />
      <div className="fixed bg-black text-white bg-opacity-25 top-2 left-2 md:top-4 md:left-4 rounded px-3 py-1 text-lg w-48 md:w-64">
        Собери флаг СТАРТ для начала игры
      </div>
      <Controls />
    </div>
  );
};
