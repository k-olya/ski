import { useEffect } from "react";
import c from "classnames"
import { mobile } from "app/mobile";
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
      <div className="fixed bg-black text-white bg-opacity-25 top-2 left-2 md:top-4 md:left-4 rounded px-3 py-1 text-lg w-48 sm:w-64 md:w-96">
        <p>Собери флаг СТАРТ для начала игры</p>
        <div className={c({"hidden": mobile()})}><p>&nbsp;</p>
        <p>Влево: A, Левый Shift</p>
        <p>Вправо: D, Правый Shift</p>
        <p>Ускорение: W, Пробел</p>
        <p>Замедление: S, Alt</p></div>
      </div>
      <Controls />
    </div>
  );
};
