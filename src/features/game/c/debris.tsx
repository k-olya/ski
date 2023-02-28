import { FC, useRef } from "react";
import { Group } from "three"
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { irand, range } from "app/math";
import { V, SLOPE_ANGLE, SLOPE_TAN, SLOPE_LENGTH } from "config";
import { rand } from "app/math";

import { Fox } from "models/Fox"
import { TreeHolidayPineSnow } from "models/TreeHolidayPineSnow"
import { TreeHolidayPineSnowRound } from "models/TreeHolidayPineSnowRound"
import { TreeHolidayPineSnowed } from "models/TreeHolidayPineSnowed"
import { TreePine } from "models/TreePine"
import { TreePineSnow } from "models/TreePineSnow"


interface Props {
  position: [number, number, number],
}

interface ModelProps {
  name: string;
  offset: [number, number, number];
  rotation?: [number, number, number];
}

const Null = () => null

const models = [
Null,
TreeHolidayPineSnow,
TreeHolidayPineSnowRound,
TreeHolidayPineSnowed,
TreePine,
TreePineSnow,
]

const DENSITY = 20

const debris = range(DENSITY).map(x => irand(models.length));

export const Debris: FC<Props> = ({ position }) => {
  const ref = useRef<(Group | null)[]>([]);
  useFrame((three, delta) => {
    ref.current.filter(f => f).forEach(r => {
      const _r = r as unknown as Group;
      _r.position.z += delta * V;
      _r.position.y += delta * SLOPE_TAN * V;
      if (_r.position.z > 0) {
        _r.position.z = -SLOPE_LENGTH;
        _r.position.y = -SLOPE_LENGTH * SLOPE_TAN;
      }
    })
  })
  return <group position={position}>{
    debris.map((d, i) =>{
      const C = models[d];
      return <group key={i} ref={x => ref.current[i] = x} position={[rand(-0.2, 0.2), - i * SLOPE_TAN * 2, - i * SLOPE_LENGTH / DENSITY + rand(-0.4, 0.4)]}><C /></group>
    })}</group>
}
