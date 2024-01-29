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
  gameLoopActive: boolean;
  density: number;
}

const temp = new Object3D();

export const InstancedTree: FC<Props> = ({
  position,
  gameLoopActive,
  density,
}) => {
  const debris = useRef<ReactNode[]>([]);
  const sign = position[0] >= 0 ? 1 : -1;
  const positions = useRef<number[][]>([]);
  const { nodes, materials } = useGLTF("treeHolidayPine.glb") as GLTFResult;
  const DENSITY = Math.round(density * (mobile() ? 8 : 24));

  useEffect(() => {
    for (let x of range(DENSITY)) {
      const p0 = rand(-1.5, 1.5);
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
      if (ref.current && ref2.current) {
        ref.current.setMatrixAt(x, temp.matrix);
        ref2.current.setMatrixAt(x, temp.matrix);
      }
    }
    if (ref.current && ref2.current) {
      ref.current.instanceMatrix.needsUpdate = true;
      ref2.current.instanceMatrix.needsUpdate = true;
    }
  }, [DENSITY]);

  // add onbeforecompile hook to shader
  useEffect(() => {
    Object.values(materials).forEach(material => {
      material.uniforms = { time: { value: 0 } };
      material.onBeforeCompile = shader => {
        shader.uniforms.time = { value: 0 };
        shader.vertexShader = shader.vertexShader.replace(
          "#include <common>",
          `
          #include <common>
          uniform float time;
uniform float opacity;
        `
        );
        shader.vertexShader = shader.vertexShader.replace(
          "#include <project_vertex>",
          `
         
 vec4 mvPosition = vec4( transformed, 1.0 );

#ifdef USE_BATCHING

	mvPosition = batchingMatrix * mvPosition;

#endif

#ifdef USE_INSTANCING
          mat4 _instanceMatrix = instanceMatrix;
          _instanceMatrix[3][2] += -${SLOPE_LENGTH.toFixed(
            1
          )} + mod(opacity * 100., ${SLOPE_LENGTH.toFixed(1)});
	mvPosition = _instanceMatrix * mvPosition;

#endif

mvPosition = modelViewMatrix * mvPosition;


gl_Position = projectionMatrix * mvPosition;
        `
        );
      };
    });
  }, []);

  const ref = useRef<InstancedMesh>(null);
  const ref2 = useRef<InstancedMesh>(null);
  const group = useRef<Group>(null);
  const time = useRef(0);
  useFrame((three, delta) => {
    if (
      gameLoopActive &&
      document.visibilityState === "visible" &&
      group.current
    ) {
      time.current += delta;
      Object.values(materials).forEach(material => {
        // material.uniforms.time.value = time.current;
        material.opacity = time.current;
        material.uniformsNeedUpdate = true;
      });
    }
  });
  useEffect(() => {
    if (group.current) {
      group.current.position.set(...position);
    }
  }, []);
  return (
    <group position={position} ref={group}>
      <instancedMesh
        ref={ref}
        args={[nodes.Mesh_treePine.geometry, materials.wood, DENSITY]}
      />
      <instancedMesh
        ref={ref2}
        args={[nodes.Mesh_treePine_1.geometry, materials.leaves, DENSITY]}
      />
    </group>
  );
};

useGLTF.preload("treeHolidayPine.glb");
