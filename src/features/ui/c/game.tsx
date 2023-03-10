import { useState, useEffect } from "react";
import c from "classnames";
import { useSelector } from "app/hooks";
import { PauseButton } from "./pause-button";
import { Timer } from "./timer";
import { Controls } from "./controls";

export const Game = () => {
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
    <div className="fixed top-0 left-0 w-screen h-screen">
      <PauseButton />{" "}
      <div className="fixed w-full flex top-2 md:top-4 justify-center items-center">
        <div
          className={c(
            "bg-black text-white bg-opacity-25 rounded px-3 py-2 text-lg md:w-64",
            { shakeX }
          )}
        >
          <div className="hidden lg:block">
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
          </div>
          <p>Очков: {game.score}</p>
          <p>Подряд: {game.inARow}</p>
          <p className={c("text-7xl text-center py-3", { pulse })}>
            {game.activeQuestion[0]}
          </p>
        </div>
      </div>
      <Controls />
    </div>
  );
};
