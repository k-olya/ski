import c from "classnames";
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
import {
  IoSpeedometerOutline,
  IoVolumeHigh,
  IoVolumeMute,
} from "react-icons/io5";
import { GiRabbit, GiTurtle } from "react-icons/gi";
import { mobile } from "app/mobile";
import {
  setMusicVolume,
  setSfxVolume,
  setSpeechVolume,
} from "features/sound/slice";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export const Settings = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector(s => s.game);
  const { musicVolume, speechVolume, sfxVolume } = useSelector(s => s.sound);
  const {
    "tutor-mode": tutorMode,
    density,
    v,
    quizes,
    reverse,
    debris,
    fastTrees,
    trampolines,
  } = settings;

  return (
    <div className="fixed top-0 w-full h-full p-4 flex justify-center items-center">
      <div
        className={c(
          "w-full h-full rounded-lg bg-opacity-75 bg-black text-white px-3 py-5 flex flex-col"
        )}
      >
        <div className="px-3">
          <h2 className="text-3xl w-full pb-2">Настройки</h2>
          <hr className="border-b-2 border-white w-full rounded-lg" />
        </div>
        <OverlayScrollbarsComponent className="w-full h-full mt-2">
          <div className="flex flex-col justify-start items-start h-full px-3">
            <h2 className="text-xl">Наборы заданий</h2>
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

            <h2 className="text-xl mt-2">Показывать правильные ответы</h2>
            <Checkbox
              checked={tutorMode}
              onClick={() => dispatch(toggleSetting("tutor-mode"))}
            >
              {tutorMode ? "показывать зелеными флагами" : "не показывать"}
            </Checkbox>
            {/* <h2 className="text-xl mt-2"></h2>
        <Checkbox
          checked={fastTrees}
          onClick={() => dispatch(toggleSetting("fastTrees"))}
        >
          быстрые деревья
        </Checkbox> */}
            <h2 className="text-xl mt-2 mb-1">Количество деревьев</h2>
            <div className="flex w-full justify-between items-center">
              <div>
                <BsTreeFill className="" />
              </div>
              <Slider
                min={mobile() ? 0.5 : 0.2}
                max={mobile() ? 10.0 : 4.0}
                step={mobile() ? 0.5 : 0.2}
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
                max={2.75}
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
            <h2 className="text-xl mt-4 mb-1">Громкость музыки</h2>
            <div className="flex w-full justify-between items-center">
              <div>
                <IoVolumeMute className="text-xl" />
              </div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={musicVolume}
                className="mx-3"
                onChange={v => {
                  dispatch(setMusicVolume(v));
                }}
              />
              <div className="">
                <IoVolumeHigh className="text-xl" />
              </div>
            </div>
            <h2 className="text-xl mt-2 mb-1">Громкость речи</h2>
            <div className="flex w-full justify-between items-center">
              <div>
                <IoVolumeMute className="text-xl" />
              </div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={speechVolume}
                className="mx-3"
                onChange={v => {
                  dispatch(setSpeechVolume(v));
                }}
              />
              <div className="">
                <IoVolumeHigh className="text-xl" />
              </div>
            </div>
            <h2 className="text-xl mt-2 mb-1">Громкость эффектов</h2>
            <div className="flex w-full justify-between items-center">
              <div>
                <IoVolumeMute className="text-xl" />
              </div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={sfxVolume}
                className="mx-3"
                onChange={v => {
                  dispatch(setSfxVolume(v));
                }}
              />
              <div className="">
                <IoVolumeHigh className="text-xl" />
              </div>
            </div>
            <Checkbox
              checked={debris}
              className="mt-5"
              onClick={() => dispatch(toggleSetting("debris"))}
            >
              препятствия
            </Checkbox>
            <Checkbox
              checked={trampolines}
              className="mb-4"
              onClick={() => dispatch(toggleSetting("trampolines"))}
            >
              трамплины
            </Checkbox>
            <div className="flex flex-col md:flex-row-reverse mt-auto justify-end">
              <Button
                className="text-2xl py-2 px-3 mb-2 md:mb-0 mt-auto"
                onClick={() => {
                  dispatch(setScreen("attributions"));
                }}
              >
                Показать авторов
              </Button>
              <Button
                className="text-2xl py-2 px-3 mb-0 md:mr-4"
                onClick={() => {
                  dispatch(setScreen("main"));
                  dispatch(unpause());
                }}
              >
                Продолжить игру
              </Button>
            </div>
          </div>
        </OverlayScrollbarsComponent>
      </div>
    </div>
  );
};
