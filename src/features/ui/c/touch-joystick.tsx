import { FC, useState, useRef, ReactNode, RefObject } from "react";
import { useDispatch, useSelector } from "app/hooks";
import { updateKb } from "features/kb/slice";
import { useEventListener } from "app/event-listener";
import c from "classnames";
import ReactDOM from "react-dom";
import { clamp } from "app/math";
import { setSteeringWheelPosition } from "features/game/slice";

interface Props {
  className: string;
}

const getUpdate = (
  coords: RefObject<{ x: number; y: number }>,
  dispatch: Function
) => {
  if (coords.current) {
    const update: { [k: string]: any } = {};
    if (coords.current.x < window.innerWidth / 2) {
      update["ArrowLeft"] = true;
      update["ArrowRight"] = false;
    } else if (coords.current.x > window.innerWidth / 2) {
      update["ArrowLeft"] = false;
      update["ArrowRight"] = true;
    }
    if (
      coords.current.y < (3 * window.innerHeight) / 5 &&
      coords.current.y > (2 * window.innerHeight) / 5
    ) {
      // up
      update["ArrowUp"] = true;
      update["ArrowDown"] = false;
    } else if (coords.current.y > (4 * window.innerHeight) / 5) {
      // down
      update["ArrowUp"] = false;
      update["ArrowDown"] = true;
    } else {
      // nowhere
      update["ArrowUp"] = false;
      update["ArrowDown"] = false;
    }
    const steeringDivisor = 6;
    const offsetX = clamp(
      Math.abs(coords.current.x - window.innerWidth / 2),
      0,
      window.innerWidth / steeringDivisor
    );
    const normalizedOffset = offsetX / (window.innerWidth / steeringDivisor);
    // console.log(normalizedOffset);
    dispatch(setSteeringWheelPosition(normalizedOffset));
    dispatch(updateKb(update));
  }
  return {};
};

export const TouchJoystick: FC<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const kb = useSelector(s => s.kb);
  const ref = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);
  const touching = useRef(false);
  const coords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const keyDown = kb["ArrowLeft"] || kb["ArrowRight"];

  const down = (keys: string[]) => {
    const update: { [key: string]: any } = {};
    for (const key of keys) {
      update[key] = true;
    }
    dispatch(updateKb(update));
  };

  useEventListener(
    "touchstart",
    event => {
      touching.current = true;
      coords.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      updateKb(getUpdate(coords, dispatch));
      if (ball.current) {
        ball.current.style.left = `${coords.current.x}px`;
        ball.current.style.top = `${coords.current.y}px`;
        ball.current.style.display = "block";
      }
    },
    ref
  );
  useEventListener(
    "touchmove",
    event => {
      if (touching.current && ball.current) {
        coords.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };

        updateKb(getUpdate(coords, dispatch));

        ball.current.style.left = `${coords.current.x}px`;
        ball.current.style.top = `${coords.current.y}px`;
      }
    },
    ref
  );
  useEventListener(
    "touchend",
    () => {
      touching.current = false;
      dispatch(updateKb({ ArrowLeft: false, ArrowRight: false }));
      if (ball.current) {
        ball.current.style.display = "none";
      }
    },
    ref
  );
  useEventListener(
    "touchcancel",
    () => {
      touching.current = false;
      dispatch(updateKb({ ArrowLeft: false, ArrowRight: false }));
      if (ball.current) {
        ball.current.style.display = "none";
      }
    },
    ref
  );

  return (
    <div
      ref={ref}
      className="w-full fixed left-0 bottom-20 bg-transparent h-28"
    >
      <div
        className={c(
          "fixed text-white rounded-full w-20 h-20 bottom-24 left-1/2 transform -translate-x-1/2",
          className,
          {
            "bg-black bg-opacity-50": !keyDown,
            "bg-black bg-opacity-25": keyDown,
          }
        )}
      >
        {ReactDOM.createPortal(
          <div
            ref={ball}
            className={c(
              "fixed text-white rounded-full w-4 h-4 border opacity-25 bg-black transform -translate-x-1/2 -translate-y-1/2"
            )}
          ></div>,
          document.body
        )}
      </div>
    </div>
  );
};
