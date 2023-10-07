import { useEffect } from "react";
import { useDispatch, useSelector } from "app/hooks";
import { updateKb, KbState, preventedDefaultKeys } from "./slice";

export const Kb = () => {
  const dispatch = useDispatch();
  const kb = useSelector<KbState>(s => s.kb);
  useEffect(() => {
    const downListener = (e: KeyboardEvent) => {
      if (e.code && !kb[e.code]) {
        dispatch(updateKb({ [e.code]: true }));
        if (preventedDefaultKeys.includes(e.code)) {
          e.preventDefault();
        }
      }
    };
    const upListener = (e: KeyboardEvent) => {
      dispatch(updateKb({ [e.code]: false }));
    };

    const mouseDownListener = (e: MouseEvent) => {
      dispatch(updateKb({ [`MB${e.button || 0}`]: true }));
    };
    const mouseUpListener = (e: MouseEvent) => {
      dispatch(updateKb({ [`MB${e.button || 0}`]: false }));
    };

    window.addEventListener("keydown", downListener);
    window.addEventListener("keyup", upListener);
    window.addEventListener("mousedown", mouseDownListener);
    window.addEventListener("mouseup", mouseUpListener);
    return () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
      window.removeEventListener("mousedown", mouseDownListener);
      window.removeEventListener("mouseup", mouseUpListener);
    };
  }, []);
  return <></>;
};
