import { useState, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { PointerLockControls, useGLTF } from "@react-three/drei";
import { Debris } from "./debris";
import { Flag } from "./flag";
import { Slope } from "./slope";
import { Skybox } from "./skybox";

export const Scene = () => {
  const init = useRef(false);

  useThree(({ camera }) => {
    if (!init.current) {
      init.current = true;
      camera.near = 0.01;
      camera.far = 256;
      camera.position.z = 0.0;
      camera.position.y = 0.0;
    }
  });
  const tree = useGLTF('/treeHolidayPineSnow.glb');

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 2, 5]} intensity={1.2} />
      <Slope />
      <Skybox />
      {/* <Flag color="crimson" position={[1, -0.26, -2]} text="0" /> */}
      <Debris position={[5.5, 0.6, 2]} />
      <Debris position={[6, 1, 2]} />
      <Debris position={[-5.5, 0.6, 2]} />
      <Debris position={[-6, 1, 2]} />
      <PointerLockControls selector="canvas" />
    </>
  );
};
