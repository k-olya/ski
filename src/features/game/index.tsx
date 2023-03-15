import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./c/scene";
import { Loader } from "@react-three/drei";

export const Game = () => (
  <>
    <Canvas>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
    <Loader />
  </>
);
