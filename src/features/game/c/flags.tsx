import { useSelector, useDispatch } from "app/hooks";
import { Flag } from "./flag";
import { SLOPE_TAN } from "config";

export const Flags = () => {
  const { flags, settings, activeQuestion } = useSelector((s) => s.game);
  return (
    <group>
      {flags.map((flag, i) => (
        <Flag
          key={i}
          position={[flag.x, flag.z * SLOPE_TAN, flag.z]}
          color={
            settings["tutor-mode"] && activeQuestion[1] === flag.text
              ? "mediumseagreen"
              : "tomato"
          }
          text={flag.text}
        />
      ))}
    </group>
  );
};
