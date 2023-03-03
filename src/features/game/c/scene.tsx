import { useState, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls, useGLTF } from "@react-three/drei";
import { useInterval } from "app/interval";
import { useSelector, useDispatch } from "app/hooks";
import { abs, clamp, lerp } from "app/math"
import { useEventListener } from "app/event-listener";
import { tick, pause, unpause } from "../slice";
import { Debris } from "./debris";
import { Flags } from "./flags";
import { Slope } from "./slope";
import { Skybox } from "./skybox";
import { BORDER_ANGLE, CLOCK_DELTA, GAME_CLOCK_MS, SLOPE_WIDTH, EXTRA_PLAYER_PADDING } from "config";

import { add } from "config/quiz/add";
import { subtract, sub_reverse } from "config/quiz/subtract";
import { multiply, multiply_reverse } from "config/quiz/multiply";
import { regions, regions_reverse } from "config/quiz/regions-russia";

export const Scene = () => {
  const dispatch = useDispatch();
  const kb = useSelector((s) => s.kb);
  const { gameLoopActive, playerX } = useSelector((s) => s.game);
  const { screen } = useSelector((s) => s.ui);
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

  const ifn = useCallback(
    (three: any, delta: number) => {
      if (delta < 0.3) {
        dispatch(tick({ delta, kb }));
      }
    },
    [dispatch, kb]
  );
  //useInterval(ifn, GAME_CLOCK_MS);
  useFrame(ifn);

  const extraPosition = clamp((abs(playerX) - SLOPE_WIDTH / 2) / EXTRA_PLAYER_PADDING * 2)
  const extraRotation = 0.5 + 0.5 * (- (playerX / abs(playerX) || 0) * extraPosition)

  const vfn = useCallback(() => {
    if (doc.current.visibilityState === "hidden" && gameLoopActive) {
      dispatch(pause());
    } else if (
      doc.current.visibilityState === "visible" &&
      ["game", "main"].includes(screen) &&
      !gameLoopActive
    ) {
      dispatch(unpause());
    }
  }, [dispatch, screen, gameLoopActive]);
  useEventListener("visibilitychange", vfn, doc);
  
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[2.5, 7.5, 2]} intensity={0.5} />
      <group position={[playerX, lerp(0, 1, extraPosition), 0]} rotation={[0, -lerp(- BORDER_ANGLE / 4, BORDER_ANGLE / 4, extraRotation), -lerp(- BORDER_ANGLE / 2, BORDER_ANGLE / 2, extraRotation)]}>
        <Skybox />
        <Slope />
        <Flags />
        <Debris position={[6.5, 1.35, 2]} />
        <Debris position={[9.5, 3.15, 2]} />
        <Debris position={[-6.5, 1.35, 2]} />
        <Debris position={[-9.5, 3.15, 2]} />
        {/* <PointerLockControls selector="canvas" /> */}
      </group>
    </>
  );
};
