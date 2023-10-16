import { useCallback } from "react";
import { useDispatch, useSelector } from "app/hooks";
import {
  IoMusicalNotes,
  IoPause,
  IoVolumeHigh,
  IoVolumeMute,
} from "react-icons/io5";
import { Button } from "./button";
import { setScreen } from "../slice";
import { pause } from "features/game/slice";
import { mute, setUserInteracted } from "features/sound/slice";

export const SoundButton = () => {
  const dispatch = useDispatch();
  const muted = useSelector(s => s.sound.muted);
  const cb = useCallback(() => {
    dispatch(mute(!muted));
  }, [dispatch, muted]);
  return (
    <Button className="p-4 text-4xl cursor-pointer" onClick={cb}>
      {!muted ? <IoVolumeHigh /> : <IoVolumeMute className="text-yellow-300" />}
    </Button>
  );
};
