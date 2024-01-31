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
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

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

type GLTFResult = GLTF & {
  nodes: {
    Mesh_treePine: THREE.Mesh;
    Mesh_treePine_1: THREE.Mesh;
  };
  materials: {
    wood: THREE.ShaderMaterial;
    leaves: THREE.ShaderMaterial;
  };
};

interface Props {
  position: [number, number, number];
}

const temp = new Object3D();

export const InstancedTree: FC<Props> = ({ position }) => {
  const {
    gameLoopActive,
    velocity,
    ticks,
    delta,
    settings: { density },
  } = useSelector(s => s.game);
  const debris = useRef<ReactNode[]>([]);
  const sign = position[0] >= 0 ? 1 : -1;
  const positions = useRef<number[][]>([]);
  const { nodes, materials } = useGLTF("treeHolidayPine.glb") as GLTFResult;
  const DENSITY = 2 * Math.round(density * (mobile() ? 8 : 24));

  useEffect(() => {
    for (let x of range(DENSITY)) {
      const p0 = rand(-3.0, 3.0);
      const p2 = rand(-3.5, 3.5);
      const p1 = rand(-0.05, 0.0);
      temp.position.set(
        p0,
        p1 +
          sign * p0 * BORDER_TAN +
          (p2 - (x * SLOPE_LENGTH) / DENSITY) * SLOPE_TAN,
        (-x * SLOPE_LENGTH) / DENSITY + p2
      );
      temp.updateMatrix();
      if (ref.current && ref2.current && ref3.current && ref4.current) {
        ref.current.setMatrixAt(x, temp.matrix);
        ref2.current.setMatrixAt(x, temp.matrix);
        ref3.current.setMatrixAt(x, temp.matrix);
        ref4.current.setMatrixAt(x, temp.matrix);
      }
    }
    if (ref.current && ref2.current && ref3.current && ref4.current) {
      ref.current.instanceMatrix.needsUpdate = true;
      ref2.current.instanceMatrix.needsUpdate = true;
      ref3.current.instanceMatrix.needsUpdate = true;
      ref4.current.instanceMatrix.needsUpdate = true;
    }
  }, [DENSITY]);

  const ref = useRef<InstancedMesh>(null);
  const ref2 = useRef<InstancedMesh>(null);
  const ref3 = useRef<InstancedMesh>(null);
  const ref4 = useRef<InstancedMesh>(null);
  const group = useRef<Group>(null);
  const group2 = useRef<Group>(null);
  useEffect(() => {
    if (
      gameLoopActive &&
      document.visibilityState === "visible" &&
      group.current &&
      group2.current
    ) {
      [group.current, group2.current].forEach(g => {
        g.position.z += delta * velocity;
        g.position.y += delta * SLOPE_TAN * velocity;
        if (g.position.z > SLOPE_LENGTH) {
          g.position.z -= SLOPE_LENGTH * 2;
          g.position.y -= SLOPE_LENGTH * 2 * SLOPE_TAN;
        }
      });
    }
  }, [gameLoopActive, velocity, ticks, delta]);
  useEffect(() => {
    if (group.current) {
      group.current.position.set(...position);
    }
    if (group2.current) {
      group2.current.position.set(
        position[0],
        position[1] + SLOPE_LENGTH * SLOPE_TAN,
        position[2] + SLOPE_LENGTH
      );
    }
  }, position);
  return (
    <>
      <group ref={group}>
        <instancedMesh
          ref={ref}
          args={[nodes.Mesh_treePine.geometry, materials.wood, DENSITY]}
        />
        <instancedMesh
          ref={ref2}
          args={[nodes.Mesh_treePine_1.geometry, materials.leaves, DENSITY]}
        />
      </group>
      <group ref={group2}>
        <instancedMesh
          ref={ref3}
          args={[nodes.Mesh_treePine.geometry, materials.wood, DENSITY]}
        />
        <instancedMesh
          ref={ref4}
          args={[nodes.Mesh_treePine_1.geometry, materials.leaves, DENSITY]}
        />
      </group>
    </>
  );
};

useGLTF.preload("treeHolidayPine.glb");
