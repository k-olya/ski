import { useSelector, useDispatch } from "app/hooks";
import { Flag } from "./flag";
import { SLOPE_TAN } from "config";

export const Flags = () => {
  const { flags } = useSelector((s) => s.game);
  return (
    <group>
      {flags.map((flag, i) => (
        <Flag
          key={i}
          position={[flag.x, flag.z * SLOPE_TAN, flag.z]}
          color="tomato"
          text={flag.text}
        />
      ))}
    </group>
  );
};
