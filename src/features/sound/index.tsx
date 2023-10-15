import { useDispatch, useSelector } from "app/hooks";
import { Howl, HowlOptions } from "howler";
import { FC, useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { FileLoader } from "three";

import add from "config/sound/add-neutral.json";
import sub from "config/sound/sub-neutral.json";
import numbers from "config/sound/numbers-good.json";
import mul from "config/sound/mul-good.json";
import ui from "config/sound/ui-jahlib.json";
import { SoundLoadingState, finishLoading, startLoading } from "./slice";
import { AppDispatch } from "app/store";

const sounds = { add, sub, numbers, mul, ui };

const loadHowl = (
  howler: Record<string, Howl>,
  dispatch: AppDispatch,
  name: keyof SoundLoadingState
) => {
  howler[name] = new Howl(sounds[name] as unknown as HowlOptions);
  howler[name].on("load", () => {
    howler[name].volume(1.0);
    dispatch(finishLoading(name));
  });
  howler[name].on("stop", e => {
    console.log(e);
    // dispatch(setStopped(name));
  });
  dispatch(startLoading(name));
};

export const Sound: FC = () => {
  const dispatch = useDispatch();
  const { userInteracted, musicVolume, muted, loaded } = useSelector(
    s => s.sound
  );
  const { reverse, quizes } = useSelector(s => s.game.settings);
  const howlerRef = useRef<Record<string, Howl>>({});

  useEffect(() => {
    if (userInteracted) {
      const howler = howlerRef.current;
      if (reverse && !howler.numbers) {
        loadHowl(howler, dispatch, "numbers");
      }
      if (quizes.add && !howler.add) {
        loadHowl(howler, dispatch, "add");
      }
      if (quizes.subtract && !howler.sub) {
        loadHowl(howler, dispatch, "sub");
      }
      if (quizes.multiply && !howler.mul) {
        loadHowl(howler, dispatch, "mul");
      }
      if (!howler.ui) {
        loadHowl(howler, dispatch, "ui");
      }
    }
    console.log("sound update", howlerRef.current);
  }, [
    dispatch,
    userInteracted,
    reverse,
    quizes.add,
    quizes.subtract,
    quizes.multiply,
  ]);

  useEffect(() => {
    if (howlerRef.current.ui) {
      howlerRef.current.ui.play("UI_Confirm_Major");
    }
    // if (howlerRef.current.mul) {
    //   howlerRef.current.mul.play("2x2");
    // }
  }, [loaded.add, loaded.mul, loaded.numbers, loaded.sub, loaded.ui]);
  return null;
};

useLoader.preload(FileLoader, "./ui-jahlib.mp3");
useLoader.preload(FileLoader, "./mul-good.mp3");
useLoader.preload(FileLoader, "./numbers-good.mp3");
