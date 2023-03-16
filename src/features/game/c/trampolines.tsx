import { useSelector, useDispatch } from "app/hooks";
import { BlockSnowSlopeHalf } from "../models/BlockSnowSlopeHalf";
import { SLOPE_TAN } from "config";

export const Trampolines = () => {
  const { trampolines, settings } = useSelector((s) => s.game);
  if (!settings.trampolines) return null;

  return (
    <group>
      {trampolines.map((d, i) => {
        return (
          <BlockSnowSlopeHalf
            key={i}
            position={[d.x, d.z * SLOPE_TAN - 0.65, d.z - 1]}
            scale={[1, 1, -1]}
          />
        );
      })}
    </group>
  );
};
