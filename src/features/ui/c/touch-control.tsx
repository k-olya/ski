import { FC, useState, useRef, ReactNode } from "react";
import { useDispatch, useSelector } from "app/hooks";
import { updateKb } from "features/kb/slice";
import { useEventListener } from "app/event-listener";
import c from "classnames";

interface Props {
  className: string;
  kbKey: string;
  opposite?: string;
  toggle?: boolean;
  children?: ReactNode;
}

export const TouchControl: FC<Props> = ({
  className,
  kbKey,
  children,
  toggle,
  opposite,
}) => {
  const dispatch = useDispatch();
  const kb = useSelector((s) => s.kb);
  const ref = useRef<HTMLButtonElement>(null);

  useEventListener(
    "touchstart",
    () => {
      let update = { [kbKey]: toggle ? !kb[kbKey] : true };
      if (opposite) update = { ...update, [opposite]: false };
      dispatch(updateKb(update));
    },
    ref
  );
  useEventListener(
    "touchend",
    () => {
      !toggle && dispatch(updateKb({ [kbKey]: false }));
    },
    ref
  );
  useEventListener(
    "touchcancel",
    () => {
      !toggle && dispatch(updateKb({ [kbKey]: false }));
    },
    ref
  );

  return (
    <button
      ref={ref}
      className={c("fixed text-white rounded-lg", className, {
        "bg-black bg-opacity-50": !kb[kbKey],
        "bg-white bg-opacity-25": kb[kbKey],
      })}
    >
      {children}
    </button>
  );
};
