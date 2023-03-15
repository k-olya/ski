import { useSelector, useDispatch } from "app/hooks";
import { Flag } from "./flag";
import { SLOPE_TAN } from "config";
import { trees } from "../models";

export const Debris = () => {
  const { debris, settings } = useSelector(s => s.game);
  if (!settings.debris) return null;

  return (
    <group>
      {debris.map((d, i) => {
        const C = trees[d.modelIndex || 0];
        return <C key={i} position={[d.x, d.z * SLOPE_TAN - 0.57, d.z]} />;
      })}
    </group>
  );
};
