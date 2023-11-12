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
import {
  SoundLoadingState,
  finishLoading,
  setActiveSfx,
  setActiveSpeech,
  startLoading,
} from "./slice";
import { AppDispatch } from "app/store";

const sounds = { add, sub, numbers, mul, ui };

const speechLookupMap = new Map<string, keyof SoundLoadingState>();

for (let library in sounds) {
  if (library === "ui") continue;
  const l = library as unknown as keyof SoundLoadingState;
  for (let sound in sounds[l].sprite) {
    speechLookupMap.set(sound, l);
  }
}

const loadHowl = (
  howler: Record<string, Howl>,
  dispatch: AppDispatch,
  name: keyof SoundLoadingState,
  type: "speech" | "sfx" = "speech"
) => {
  howler[name] = new Howl(sounds[name] as unknown as HowlOptions);
  howler[name].on("load", () => {
    howler[name].volume(1.0);
    dispatch(finishLoading(name));
  });
  howler[name].on("end", e => {
    dispatch(type === "speech" ? setActiveSpeech("") : setActiveSfx(""));
  });
  dispatch(startLoading(name));
};

export const Sound: FC = () => {
  const dispatch = useDispatch();
  const {
    userInteracted,
    musicVolume,
    muted,
    loaded,
    activeSpeech,
    activeSfx,
  } = useSelector(s => s.sound);
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
        loadHowl(howler, dispatch, "ui", "sfx");
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
    // if (howlerRef.current.ui) {
    //   howlerRef.current.ui.play("UI_Confirm_Major");
    // }
    // if (howlerRef.current.mul) {
    //   howlerRef.current.mul.play("2x2");
    // }
  }, [loaded.add, loaded.mul, loaded.numbers, loaded.sub, loaded.ui]);

  // speech
  useEffect(() => {
    if (activeSpeech && !muted) {
      const l = speechLookupMap.get(activeSpeech);
      if (l && howlerRef.current[l]) {
        howlerRef.current[l].play(activeSpeech);
      }
    }
    // console.log("active speech", activeSpeech);
  }, [activeSpeech]);
  // sfx
  useEffect(() => {
    if (activeSfx && !muted && howlerRef.current.ui) {
      howlerRef.current.ui.play(activeSfx);
    }
  }, [activeSfx]);

  return null;
};

useLoader.preload(FileLoader, "./ui-jahlib.mp3");
useLoader.preload(FileLoader, "./mul-good.mp3");
useLoader.preload(FileLoader, "./numbers-good.mp3");
