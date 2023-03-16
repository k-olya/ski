import c from "classnames";
import { mobile } from "app/mobile";
import { TouchControl } from "./touch-control";
import {
  IoArrowBack,
  IoArrowForward,
  IoArrowUp,
  IoArrowDown,
} from "react-icons/io5";
import { GiRabbit, GiTurtle } from "react-icons/gi";

export const Controls = () => (
  <div className={c({ hidden: !mobile() })}>
    <TouchControl kbKey="ArrowLeft" className="bottom-28 left-4 p-4">
      <IoArrowBack className="h-16 w-16" />
    </TouchControl>
    <TouchControl
      toggle
      kbKey="ArrowDown"
      opposite="ArrowUp"
      className="bottom-8 left-10 p-2"
    >
      <GiTurtle className="h-8 w-8" />
    </TouchControl>
    <TouchControl kbKey="ArrowRight" className="bottom-28 right-4 p-4">
      <IoArrowForward className="h-16 w-16" />
    </TouchControl>
    <TouchControl
      toggle
      kbKey="ArrowUp"
      opposite="ArrowDown"
      className="bottom-8 right-10 p-2"
    >
      <GiRabbit className="h-8 w-8" />
    </TouchControl>
  </div>
);
