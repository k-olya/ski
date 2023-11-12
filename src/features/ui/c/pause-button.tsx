import { useCallback } from "react";
import { useDispatch } from "app/hooks";
import { IoPause, IoSettingsSharp } from "react-icons/io5";
import { Button } from "./button";
import { setScreen } from "../slice";
import { pause } from "features/game/slice";

export const PauseButton = () => {
  const dispatch = useDispatch();
  const cb = useCallback(() => {
    dispatch(setScreen("settings"));
    dispatch(pause());
  }, [dispatch]);
  return (
    <Button className="p-2 text-3xl cursor-pointer" onClick={cb}>
      <IoSettingsSharp />
    </Button>
  );
};
