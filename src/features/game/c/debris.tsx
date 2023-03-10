import { FC, ReactNode, useRef, useEffect } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { irand, rand, range } from "app/math";
import {
  V,
  CLOCK_DELTA,
  SLOPE_ANGLE,
  SLOPE_TAN,
  BORDER_TAN,
  SLOPE_LENGTH,
} from "config";
import { tick } from "../slice";
import { useSelector, useDispatch } from "app/hooks";
import { mobile } from "app/mobile";

import { TreeHolidayPine } from "../models/TreeHolidayPine";
import { TreeHolidayPineSnow } from "../models/TreeHolidayPineSnow";
import { TreeHolidayPineSnowRound } from "../models/TreeHolidayPineSnowRound";
import { TreeHolidayPineSnowed } from "../models/TreeHolidayPineSnowed";
import { TreePine } from "../models/TreePine";
import { TreePineSnow } from "../models/TreePineSnow";

interface Props {
  position: [number, number, number];
}

const models = [
  TreeHolidayPine,
  TreeHolidayPineSnow,
  TreeHolidayPineSnowRound,
  TreeHolidayPineSnowed,
  TreePine,
  TreePineSnow,
];

export const Debris: FC<Props> = ({ position }) => {
  const DENSITY = mobile() ? 20 : 60;
  const { gameLoopActive, velocity, ticks, delta } = useSelector((s) => s.game);
  const debris = useRef<ReactNode[]>([]);
  const sign = position[0] >= 0 ? 1 : -1;
  const positions = useRef<number[][]>([]);

  useEffect(() => {
    debris.current = range(DENSITY).map((x) => {
      const C = models[irand(models.length)];
      return <C />;
    });
    positions.current = debris.current.map((x) => [
      rand(-1.5, 1.5),
      rand(-0.05, 0.0),
      rand(-3.5, 3.5),
    ]);
  }, []);

  const ref = useRef<(Group | null)[]>([]);
  useEffect(() => {
    if (gameLoopActive && document.visibilityState === "visible") {
      ref.current
        .filter((f) => f)
        .forEach((r) => {
          const _r = r as unknown as Group;
          _r.position.z += delta * velocity;
          _r.position.y += delta * SLOPE_TAN * velocity;
          if (_r.position.z > 0) {
            _r.position.z -= SLOPE_LENGTH;
            _r.position.y -= SLOPE_LENGTH * SLOPE_TAN;
          }
        });
    }
  }, [gameLoopActive, velocity, ticks, delta]);
  return (
    <group position={position}>
      {debris.current.map((d, i) => {
        return (
          <group
            key={i}
            ref={(x) => (ref.current[i] = x)}
            position={[
              positions.current[i][0],
              positions.current[i][1] +
                sign * positions.current[i][0] * BORDER_TAN +
                (positions.current[i][2] - (i * SLOPE_LENGTH) / DENSITY) *
                  SLOPE_TAN,
              (-i * SLOPE_LENGTH) / DENSITY + positions.current[i][2],
            ]}
          >
            {d}
          </group>
        );
      })}
    </group>
  );
};
