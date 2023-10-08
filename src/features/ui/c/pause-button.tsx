import { useCallback } from "react";
import { useDispatch } from "app/hooks";
import { IoPause } from "react-icons/io5";
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
    <Button className="p-4 text-4xl cursor-pointer" onClick={cb}>
      <IoPause className="transform scale-x-125" />
    </Button>
  );
};
