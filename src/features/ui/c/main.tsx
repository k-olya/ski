import { useEffect } from "react";
import { useSelector, useDispatch } from "app/hooks";
import {
  IoPause,
  IoArrowBack,
  IoArrowForward,
  IoArrowUp,
  IoArrowDown,
} from "react-icons/io5";
import { TouchControl } from "./touch-control";
import { Button } from "./button";
import { setScreen } from "../slice";
import { pause } from "features/game/slice";

export const Main = () => {
  const dispatch = useDispatch();
  const { gameState } = useSelector((s) => s.game);
  useEffect(() => {
    if (gameState === "playing") {
      dispatch(setScreen("game"));
    }
  }, [gameState]);
  return (
    <div className="fixed">
      <Button
        className="fixed top-2 right-2 p-4 text-4xl"
        onClick={() => {
          dispatch(setScreen("settings"));
          dispatch(pause());
        }}
      >
        <IoPause className="transform scale-x-125" />
      </Button>
      <div className="fixed bg-black text-white bg-opacity-25 top-4 left-4 rounded px-3 py-1 text-lg">
        Собери флаг СТАРТ для начала
      </div>

      <div>
        <TouchControl kbKey="ArrowLeft" className="bottom-24 left-4 p-4">
          <IoArrowBack className="h-12 w-12" />
        </TouchControl>
        <TouchControl kbKey="ArrowDown" className="bottom-8 left-9 p-2">
          <IoArrowDown className="h-6 w-6" />
        </TouchControl>
        <TouchControl kbKey="ArrowRight" className="bottom-24 right-4 p-4">
          <IoArrowForward className="h-12 w-12" />
        </TouchControl>
        <TouchControl kbKey="ArrowUp" className="bottom-8 right-9 p-2">
          <IoArrowUp className="h-6 w-6" />
        </TouchControl>
      </div>
    </div>
  );
};
