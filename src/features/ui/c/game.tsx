import { useState, useEffect } from "react";
import { IoPause } from "react-icons/io5";
import c from "classnames";
import { useSelector, useDispatch } from "app/hooks";
import { Button } from "./button";
import { Timer } from "./timer";
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
          "fixed bg-black text-white bg-opacity-25 top-4 left-4 rounded px-3 py-2 text-lg w-80",
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
        <p className={c("text-5xl", { pulse })}>{game.activeQuestion[0]}</p>
      </div>
    </div>
  );
};
