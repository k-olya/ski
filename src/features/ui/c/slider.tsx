import { FC, ReactNode } from "react";
import RcSlider from "rc-slider";
import c from "classnames";
import "slider.css";

interface Props {
  min: number;
  max: number;
  value: number;
  step: number;
  className?: string;
  onChange?: (x: number) => void;
}

export const Slider: FC<Props> = ({
  onChange,
  className,
  value,
  min,
  max,
  step,
}) => (
  <div className={c("flex-grow", className)}>
    <RcSlider
      min={min}
      max={max}
      step={step}
      defaultValue={value}
      onChange={(e) => onChange && typeof e === "number" && onChange(e)}
    />
  </div>
);
