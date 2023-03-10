import { useSelector, useDispatch } from "app/hooks";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { setScreen } from "../slice";
import { unpause, toggleSetting } from "features/game/slice";

export const Settings = () => {
  const dispatch = useDispatch();
  const tutorMode = useSelector((s) => s.game.settings["tutor-mode"]);

  return (
    <div className="fixed top-0 w-full h-full p-4 flex justify-center items-center">
      <div className="w-full h-full rounded-lg bg-opacity-50 bg-black text-white px-6 py-5 flex flex-col">
        <h2 className="text-3xl w-full pb-2">Настройки</h2>
        <hr className="border-b-2 border-white w-full" />
        <Checkbox
          checked={tutorMode}
          onClick={() => dispatch(toggleSetting("tutor-mode"))}
        >
          показывать правильные ответы
        </Checkbox>
        <Button
          className="text-2xl py-2 px-3 mx-auto mb-0 mt-auto"
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
