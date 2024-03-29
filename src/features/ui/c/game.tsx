import { useState, useEffect } from "react";
import c from "classnames";
import { useDispatch, useSelector } from "app/hooks";
import { PauseButton } from "./pause-button";
import { Timer } from "./timer";
import { Controls } from "./controls";
import { pow, sqrt } from "app/math";
import { SoundButton } from "./sound-button";
import { setActiveSfx, setActiveSpeech } from "features/sound/slice";
import { FullscreenButton } from "./fullscreen-button";

export const Game = () => {
  const game = useSelector(s => s.game);
  const dispatch = useDispatch();
  const [shakeX, setShake] = useState(false);
  const [pulse, setPulse] = useState(false);

  // wrong answer effect
  useEffect(() => {
    setShake(Boolean(game.shakes));
    dispatch(setActiveSfx("UI_Error_01"));
    setTimeout(() => setShake(false), 300);
  }, [game.shakes, setShake]);

  // right answer effect
  useEffect(() => {
    setPulse(Boolean(game.score));
    dispatch(setActiveSfx("UI_Pause_01"));
    setTimeout(() => setPulse(false), 300);
  }, [game.score, setPulse]);

  // question change sfx
  useEffect(() => {
    setTimeout(() => {
      dispatch(setActiveSpeech(game.activeQuestion[0].replace("×", "x")));
    }, 300);
  }, [dispatch, game.activeQuestion[0]]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <div className="fixed w-full flex top-2 md:top-4 justify-center items-center">
        <div
          className={c(
            "bg-black text-white bg-opacity-25 rounded px-2 py-1 md:px-3 md:py-2 text-lg md:w-64",
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
            <p>Правильно подряд: {game.inARow}</p>
          </div>
          <p>Скорость: {game.velocity.toFixed(0)}м/с</p>
          <p>
            Очки: {(game.score / pow(Date.now() - game.start, 0.5)).toFixed(0)}
          </p>
          <p
            className={c("text-7xl text-center md:py-2", {
              pulse,
            })}
          >
            {game.activeQuestion[0]}
          </p>
        </div>
      </div>
      <div className="fixed top-2 right-2 md:top-4 md:right-4 space-y-2">
        <PauseButton />
        <SoundButton />
        <FullscreenButton />
      </div>
      <Controls />
    </div>
  );
};
