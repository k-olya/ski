import { FC, ReactNode, useRef, useEffect } from "react";
import { Group, InstancedMesh, Object3D } from "three";
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

// import { trees as models } from "../models";

const modelFilenames = [
  "treeHolidayPine.glb",
  "treeHolidayPineSnow.glb",
  "treeHolidayPineSnowed.glb",
  "treeHolidayPineSnowRound.glb",
  "treePine.glb",
  "treePineSnow.glb",
];

useGLTF.preload(modelFilenames);

interface Props {
  position: [number, number, number];
  model: keyof typeof modelFilenames;
  count: number;
  gameLoopActive: boolean;
}

const temp = new Object3D();

export const InstancedTree: FC<Props> = ({
  position,
  model,
  count,
  gameLoopActive,
}) => {
  const debris = useRef<ReactNode[]>([]);
  const sign = position[0] >= 0 ? 1 : -1;
  const positions = useRef<number[][]>([]);

  useEffect(() => {
    for (let x of range(count)) {
      const p0 = rand(-1.5, 1.5);
      const p2 =  rand(-3.5, 3.5) + (-x * SLOPE_LENGTH) / count ;
      const p1 = rand(-0.05, 0.0) + sign * p0 * BORDER_TAN +
                (p2 - (x * SLOPE_LENGTH) / count) *
                  SLOPE_TAN;
      temp.position.set(p0, p1, p2)
      temp.updateMatrix()
      if (ref.current) {
        ref.current.setMatrixAt(x, temp.matrix)
      }
    }
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true
    }
  }, [count]);

  const ref = useRef<InstancedMesh>(null);
  const group = useRef<Group>(null);
  const time = useRef(0);
  useFrame((three, delta) => {
    if (
      gameLoopActive &&
      document.visibilityState === "visible" &&
      group.current
    ) {
      time.current += delta;
    }
  });
  useEffect(() => {
    if (group.current) {
      group.current.position.set(...position);
    }
  }, []);
  return (
    <group position={position} ref={group}>
      <instancedMesh ref={ref}
    </group>
  );
};
