import { useEffect } from "react";
import { useSelector, useDispatch } from "app/hooks";
import { IoPause } from "react-icons/io5";
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
    </div>
  );
};
