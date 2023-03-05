import { useRef, useEffect } from "react";
import { add } from "config/quiz/add";
import { subtract } from "config/quiz/subtract";
import { multiply } from "config/quiz/multiply";
import { mapStrings } from "app/strings";

const strings = mapStrings(multiply);

export const Canvas2d = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d");
      ref.current.height = 40 * strings.length;
      ref.current.width = 75;
      if (ctx) {
        ctx.font = "38px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        console.log(strings);
        strings.forEach((s, i) => {
          ctx.fillText(s, 75 / 2, (i + 1) * 50);
        });
      }
    }
  }, []);
  return <canvas ref={ref}></canvas>;
};
