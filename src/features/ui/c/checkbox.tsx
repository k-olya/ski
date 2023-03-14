import { FC, ReactNode } from "react";
import c from "classnames";

interface Props {
  checked?: boolean;
  children?: ReactNode;
  className?: string;
  small?: boolean;
  onClick?: Function;
}

export const Checkbox: FC<Props> = ({
  checked,
  children,
  className,
  onClick,
  small,
}) => (
  <div
    className={c("checkbox cursor-pointer my-2", { checked }, className)}
    onClick={() => onClick && onClick()}
  >
    <svg
      className={c("inline-block mr-2 relative", {
        "h-8 bottom-0.5": !small,
        "h-6": small,
      })}
      viewBox="-1 -1 12 12"
    >
      <rect
        x="0"
        y="0"
        width="10"
        height="10"
        rx="2.5"
        stroke="currentColor"
        fill="transparent"
        strokeWidth="1.25"
      />
      <path
        d="M 2 5.5 L 4.5 8 L 8 2"
        fill="transparent"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        strokeDasharray="20"
        strokeDashoffset="20"
      />
    </svg>
    <span className={c({ "text-lg": !small, "text-sm": small })}>
      {children}
    </span>
  </div>
);
