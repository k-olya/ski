import { useLoader, useThree } from "@react-three/fiber";
import { useSelector } from "app/hooks";
import { useEffect, useRef } from "react";
import {
  AudioListener,
  AudioLoader,
  PositionalAudio,
  Audio,
  Group,
} from "three";

export const Music = () => {
  //   const ref = useRef<Group>(null);
  const init = useRef(false);
  const audio = useRef<Audio>();
  const listener = useRef<AudioListener>();
  const { userInteracted, muted, musicVolume } = useSelector(s => s.sound);
  const camera = useThree(({ camera }) => {
    if (
      userInteracted &&
      !camera.children.some(child => child instanceof AudioListener)
    ) {
      listener.current = new AudioListener();
      camera.add(listener.current);
    }
    return camera;
  });
  const data = useLoader(
    AudioLoader,
    "./evgeny-bardyuzha-password-infinity.mp3"
  );
  useEffect(() => {
    if (listener.current /* && ref.current */ && !init.current) {
      init.current = true;
      audio.current = new Audio(listener.current);
      audio.current.setBuffer(data);
      audio.current.setLoop(true);
      audio.current.setVolume(musicVolume);
      audio.current.play();
      //   ref.current.add(audio.current);
    }
  }, [listener.current, /*ref.current,*/ init.current]);

  useEffect(() => {
    if (audio.current) {
      if (muted) {
        audio.current.setVolume(0);
      } else {
        audio.current.setVolume(musicVolume);
      }
    }
  }, [audio.current, muted, musicVolume]);

  return <></>; //<group ref={ref}></group>; //<positionalAudio ref={sound} args={[listener]} />;
};

useLoader.preload(AudioLoader, "./evgeny-bardyuzha-password-infinity.mp3");
