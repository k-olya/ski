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
import { IoEarth, IoHomeOutline } from "react-icons/io5";
import { GiHollowCat } from "react-icons/gi";
import { mobile } from "app/mobile";

export const Attributions = () => {
  const dispatch = useDispatch();
  return (
    <div className="fixed top-0 w-full h-full p-4 flex justify-center items-center">
      <div
        className={c(
          "w-full h-full rounded-lg bg-opacity-75 bg-black text-white px-6 py-5 flex flex-col justify-start items-center",
          { "overflow-y-scroll": mobile() }
        )}
      >
        <h2 className="text-3xl w-full pb-2">Авторы контента</h2>
        <hr className="border-b-2 border-white w-full rounded-lg mb-auto" />
        <h2 className="text-xl mt-8 md:mt-2">Дизайн и программирование</h2>
        <div className="mt-2 italic">
          <a
            href="/"
            target="_blank"
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="mr-1">kolay</span>
            <GiHollowCat className="transform scale-110" />
          </a>
        </div>
        <h2 className="text-xl mt-8">Деревья и трамплины</h2>
        <div className="mt-2 italic">
          <a
            href="https://kenney.nl/"
            target="_blank"
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="mr-1">kenney.nl</span>
            <IoEarth />
          </a>
        </div>
        <h2 className="text-xl mt-8">Скайбокс</h2>
        <div className="mt-2 italic">
          <a
            href="mailto:jacobwindecker@hotmail.com"
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="mr-1">jacobwindecker@hotmail.com</span>
            <IoEarth />
          </a>
        </div>
        <h2 className="text-xl mt-8">Модель лыжи</h2>
        <div className="mt-2 italic">
          <a
            href="https://sketchfab.com/grimren13"
            target="_blank"
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="mr-1">grimren13</span>
            <IoEarth />
          </a>
        </div>
        <h2 className="text-xl mt-8">Звукорежиссер</h2>
        <div className="mt-2 italic">
          <a
            href="https://soundcloud.com/jahlib"
            target="_blank"
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="mr-1">jahlib</span>
            <IoEarth />
          </a>
        </div>
        <h2 className="text-xl mt-8">Музыкальная тема</h2>
        <div className="mt-2 italic">
          <a
            href="https://pixabay.com/users/evgeny_bardyuzha-25235210"
            target="_blank"
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="mr-1 text-center">
              Evgeny Bardyuzha - Password Infinity
            </span>
            <IoEarth />
          </a>
        </div>
        <h2 className="text-xl mt-8">Иконки</h2>
        <div className="mt-2 mb-0 italic">
          <a
            href="https://ionic.io/ionicons/"
            target="_blank"
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="mr-1">ionicons</span>
            <IoEarth />
          </a>
        </div>
        <div className="mt-1 italic">
          <a
            href="https://game-icons.net/"
            target="_blank"
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="mr-1">game-icons</span>
            <IoEarth />
          </a>
        </div>
        <div className="mt-1 italic">
          <a
            href="https://github.com/tailwindlabs/heroicons"
            target="_blank"
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="mr-1">heroicons 2</span>
            <IoEarth />
          </a>
        </div>
        <div className="mt-16 md:mt-auto mb-8 italic">Спасибо за игру ♥</div>
        <div className="flex flex-col md:flex-row-reverse mt-auto justify-end">
          <Button
            className="text-2xl py-2 px-3 mb-0 md:mr-4"
            onClick={() => {
              dispatch(setScreen("settings"));
            }}
          >
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};
