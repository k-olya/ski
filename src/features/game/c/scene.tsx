import { useState, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { PointerLockControls, useGLTF } from "@react-three/drei";
import { useSelector, useDispatch } from "app/hooks";
import { Debris } from "./debris";
import { Flag } from "./flag";
import { Slope } from "./slope";
import { Skybox } from "./skybox";

import { add } from "config/quiz/add";
import { subtract, sub_reverse } from "config/quiz/subtract";
import { multiply, multiply_reverse } from "config/quiz/multiply";
import { regions, regions_reverse } from "config/quiz/regions-russia";

export const Scene = () => {
  const init = useRef(false);
  console.log(regions_reverse);

  useThree(({ camera }) => {
    if (!init.current) {
      init.current = true;
      camera.near = 0.01;
      camera.far = 1000;
      camera.position.z = 0.0;
      camera.position.y = 0.0;
    }
  });
  const tree = useGLTF('/treeHolidayPineSnow.glb');

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[20, 20, 0]} intensity={0.5} />
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
