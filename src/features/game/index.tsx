import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./c/scene";
import { Loader } from "@react-three/drei";
import { Music } from "features/sound/c/music";

export const Game = () => (
  <>
    <Canvas>
      <Suspense fallback={null}>
        <Scene />
        <Music />
      </Suspense>
    </Canvas>
    <Loader />
  </>
);
