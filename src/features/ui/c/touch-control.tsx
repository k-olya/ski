import { FC, useState, useRef, ReactNode } from "react";
import { useDispatch, useSelector } from "app/hooks";
import { updateKb } from "features/kb/slice";
import { useEventListener } from "app/event-listener";
import c from "classnames";

interface Props {
  className: string;
  kbKey: string;
  children?: ReactNode;
}

export const TouchControl: FC<Props> = ({ className, kbKey, children }) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEventListener(
    "touchstart",
    () => {
      setActive(true);
      dispatch(updateKb({ [kbKey]: true }));
    },
    ref
  );
  useEventListener(
    "touchend",
    () => {
      setActive(false);
      dispatch(updateKb({ [kbKey]: false }));
    },
    ref
  );
  useEventListener(
    "touchcancel",
    () => {
      setActive(false);
      dispatch(updateKb({ [kbKey]: false }));
    },
    ref
  );

  return (
    <button
      ref={ref}
      className={c("fixed text-white rounded-lg", className, {
        "bg-black bg-opacity-50": !active,
        "bg-white bg-opacity-25": active,
      })}
    >
      {children}
    </button>
  );
};
