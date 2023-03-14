import { useSelector, useDispatch } from "app/hooks";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Slider } from "./slider";
import { setScreen } from "../slice";
import {
  unpause,
  toggleSetting,
  toggleQuizSetting,
  setNumberSetting,
} from "features/game/slice";
import { BsTreeFill } from "react-icons/bs";
import { IoSpeedometerOutline } from "react-icons/io5";
import { GiRabbit, GiTurtle } from "react-icons/gi";
import { mobile } from "app/mobile";

export const Settings = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector(s => s.game);
  const { "tutor-mode": tutorMode, density, v, quizes, reverse } = settings;

  return (
    <div className="fixed top-0 w-full h-full p-4 flex justify-center items-center">
      <div className="w-full h-full rounded-lg bg-opacity-50 bg-black text-white px-6 py-5 flex flex-col">
        <h2 className="text-3xl w-full pb-2">Настройки</h2>
        <hr className="border-b-2 border-white w-full rounded-lg" />
        <h2 className="text-xl mt-2">Наборы заданий</h2>
        <div className="text-sm my-1">Должен быть выбран хотя бы один</div>
        <Checkbox
          checked={quizes.add}
          onClick={() => dispatch(toggleQuizSetting("add"))}
        >
          сложение
        </Checkbox>
        <Checkbox
          checked={quizes.subtract}
          onClick={() => dispatch(toggleQuizSetting("subtract"))}
        >
          вычитание
        </Checkbox>
        <Checkbox
          checked={quizes.multiply}
          onClick={() => dispatch(toggleQuizSetting("multiply"))}
        >
          умножение
        </Checkbox>
        <hr className="border-b-1 border-white w-full md:w-1/2 lg:w-1/3 rounded-lg" />
        <Checkbox
          checked={reverse}
          small
          onClick={() => dispatch(toggleSetting("reverse"))}
        >
          иногда менять местами примеры и ответы
        </Checkbox>

        {/* <h2 className="text-xl mt-2">Показывать правильные ответы</h2>
        <Checkbox
          checked={tutorMode}
          onClick={() => dispatch(toggleSetting("tutor-mode"))}
        >
          {tutorMode ? "показывать зелеными флагами" : "не показывать"}
  </Checkbox>*/}
        <h2 className="text-xl mt-2 mb-1">Количество деревьев</h2>
        <div className="flex w-full justify-between items-center">
          <div>
            <BsTreeFill className="" />
          </div>
          <Slider
            min={mobile() ? 0.2 : 0.1}
            max={mobile() ? 5.0 : 2.0}
            step={0.1}
            value={density}
            className="mx-3"
            onChange={v => {
              dispatch(setNumberSetting({ setting: "density", value: v }));
            }}
          />
          <div className="relative flex items-baseline">
            <BsTreeFill className="text-lg" />
            <BsTreeFill className="text-xl" />
            <BsTreeFill className="text-2xl" />
          </div>
        </div>
        <h2 className="text-xl mt-2 mb-1">Скорость игры</h2>
        <div className="flex w-full justify-between items-center">
          <div>
            <GiTurtle className="text-xl" />
          </div>
          <Slider
            min={0.25}
            max={3}
            step={0.25}
            value={v}
            className="mx-3"
            onChange={v => {
              dispatch(setNumberSetting({ setting: "v", value: v }));
            }}
          />
          <div className="">
            <GiRabbit className="text-xl" />
          </div>
        </div>

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
