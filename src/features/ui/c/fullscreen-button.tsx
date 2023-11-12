import { useCallback } from "react";
import { useDispatch, useSelector } from "app/hooks";
import {
  IoContract,
  IoExpand,
  IoMusicalNotes,
  IoPause,
  IoVolumeHigh,
  IoVolumeMute,
} from "react-icons/io5";
import { HiArrowsPointingIn, HiArrowsPointingOut } from "react-icons/hi2";
import { Button } from "./button";
import { setScreen } from "../slice";
import { pause } from "features/game/slice";
import { mute, setUserInteracted } from "features/sound/slice";

export const FullscreenButton = () => {
  const fullscreen = window.document.fullscreenElement;
  return (
    <Button
      className="p-2 text-3xl cursor-pointer"
      onClick={() =>
        !fullscreen
          ? window.document.documentElement.requestFullscreen()
          : window.document.exitFullscreen()
      }
    >
      {!fullscreen ? <HiArrowsPointingOut /> : <HiArrowsPointingIn />}
    </Button>
  );
};
