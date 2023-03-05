import { useState, useEffect } from "react";
import {
  IoPause,
  IoArrowBack,
  IoArrowForward,
  IoArrowUp,
  IoArrowDown,
} from "react-icons/io5";
import c from "classnames";
import { useSelector, useDispatch } from "app/hooks";
import { Button } from "./button";
import { Timer } from "./timer";
import { TouchControl } from "./touch-control";
import { setScreen } from "../slice";
import { pause } from "features/game/slice";

export const Game = () => {
  const dispatch = useDispatch();
  const game = useSelector((s) => s.game);
  const [shakeX, setShake] = useState(false);
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    setShake(Boolean(game.shakes));
    setTimeout(() => setShake(false), 300);
  }, [game.shakes, setShake]);
  useEffect(() => {
    setPulse(Boolean(game.score));
    setTimeout(() => setPulse(false), 300);
  }, [game.score, setPulse]);

  return (
    <div className="fixed top-0 left-0">
      <Button
        className="fixed top-2 right-2 p-4 text-4xl"
        onClick={() => {
          dispatch(setScreen("settings"));
          dispatch(pause());
        }}
      >
        <IoPause className="transform scale-x-125" />
      </Button>
      <div
        className={c(
          "fixed bg-black text-white bg-opacity-25 top-2 left-2 rounded px-3 py-2 text-lg w-64",
          { shakeX }
        )}
      >
        <p>
          Время: <Timer start={game.start} />
        </p>
        <p>
          Расстояние:{" "}
          {(game.distance > 1000
            ? game.distance / 1000
            : game.distance
          ).toFixed(2)}
          {game.distance > 1000 ? "км" : "м"}
        </p>

        <p>Скорость: {game.velocity.toFixed(0)}м/с</p>
        <p>Набрано очков: {game.score}</p>
        <p>Подряд: {game.inARow}</p>
        <p className={c("text-7xl text-center py-3", { pulse })}>
          {game.activeQuestion[0]}
        </p>
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
