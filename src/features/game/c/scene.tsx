import { useState, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls, useGLTF } from "@react-three/drei";
import { useInterval } from "app/interval";
import { useSelector, useDispatch } from "app/hooks";
import { useEventListener } from "app/event-listener";
import { tick, pause, unpause } from "../slice";
import { Debris } from "./debris";
import { Flag } from "./flag";
import { Slope } from "./slope";
import { Skybox } from "./skybox";
import { CLOCK_DELTA, GAME_CLOCK_MS } from "config";

import { add } from "config/quiz/add";
import { subtract, sub_reverse } from "config/quiz/subtract";
import { multiply, multiply_reverse } from "config/quiz/multiply";
import { regions, regions_reverse } from "config/quiz/regions-russia";

export const Scene = () => {
  const dispatch = useDispatch();
  const { gameLoopActive } = useSelector(s => s.game);
  const { screen } = useSelector(s => s.ui);
  const init = useRef(false);
  const doc = useRef(document);

  useThree(({ camera }) => {
    if (!init.current) {
      init.current = true;
      camera.near = 0.01;
      camera.far = 1000;
      camera.position.z = 0.0;
      camera.position.y = 0.0;
    }
  });
  
  const ifn = useCallback((three: any, delta: number) => { if (delta < 0.3) { dispatch(tick(delta)) } }, [dispatch]);
  //useInterval(ifn, GAME_CLOCK_MS);
  useFrame(ifn);

  const vfn = useCallback(() => {
    if (doc.current.visibilityState === "hidden" && gameLoopActive) {
      dispatch(pause());
    } else if (doc.current.visibilityState === "visible" && ['game', 'main'].includes(screen) && !gameLoopActive) {
      dispatch(unpause());
    }
  }, [dispatch, screen, gameLoopActive])
  useEventListener("visibilitychange", vfn, doc);

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[20, 20, 0]} intensity={0.5} />
      <Slope />
      <Skybox />
      {/* <Flag color="crimson" position={[1, -0.26, -2]} text="0" /> */}
      <Debris position={[5.5, 0.75, 2]} />
      <Debris position={[6.4, 1.2, 2]} />
      <Debris position={[-5.5, 0.74, 2]} />
      <Debris position={[-6.4, 1.2, 2]} />
      <PointerLockControls selector="canvas" />
    </>
  );
};
