import { useDispatch } from "app/hooks";
import { Button } from "./button";
import { setScreen } from "../slice";
import { unpause } from "features/game/slice";

export const Settings = () => {
  const dispatch = useDispatch();
  return (
    <div className="fixed top-0 w-full h-full p-16 flex justify-center items-center">
      <div className="w-full h-full rounded-lg bg-opacity-50 bg-black text-white px-6 py-5 flex flex-col">
        <h2 className="text-5xl w-full pb-2">Настройки</h2>
        <hr className="border-b-2 border-white w-full" />
        <Button
          className="text-4xl py-2 px-3 mx-auto mb-0 mt-auto"
          onClick={() => {
            dispatch(setScreen("main"));
            dispatch(unpause());
          }}
        >
          Сохранить и выйти
        </Button>
      </div>
    </div>
  );
};
