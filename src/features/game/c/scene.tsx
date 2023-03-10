import { useState, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls, useGLTF } from "@react-three/drei";
import { useInterval } from "app/interval";
import { useSelector, useDispatch } from "app/hooks";
import { abs, clamp, lerp, PI } from "app/math";
import { useEventListener } from "app/event-listener";
import { tick, pause, unpause } from "../slice";
import { Debris } from "./debris";
import { Flags } from "./flags";
import { Slope } from "./slope";
import { Skybox } from "./skybox";
import { Ski } from "../models/Ski";
import {
  BORDER_ANGLE,
  CLOCK_DELTA,
  GAME_CLOCK_MS,
  SLOPE_WIDTH,
  SLOPE_ANGLE,
  EXTRA_PLAYER_PADDING,
} from "config";

import { add } from "config/quiz/add";
import { subtract, sub_reverse } from "config/quiz/subtract";
import { multiply, multiply_reverse } from "config/quiz/multiply";
import { regions, regions_reverse } from "config/quiz/regions-russia";

export const Scene = () => {
  const dispatch = useDispatch();
  const kb = useSelector((s) => s.kb);
  const { gameLoopActive, playerX, Xvelocity, velocity, steering, boost } =
    useSelector((s) => s.game);
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
      camera.rotation.x = -SLOPE_ANGLE / 2;
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

  const extraPosition = clamp(
    ((abs(playerX) - SLOPE_WIDTH / 2) / EXTRA_PLAYER_PADDING) * 2
  );
  const extraRotation =
    0.5 + 0.5 * (-(playerX / abs(playerX) || 0) * extraPosition);

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
      <group
        position={[
          playerX,
          lerp(0, 0.75, extraPosition) + boost * 0.1 - 0.1,
          0,
        ]}
        rotation={[
          0,
          -lerp(-BORDER_ANGLE / 4, BORDER_ANGLE / 4, extraRotation),
          -lerp(-BORDER_ANGLE / 2, BORDER_ANGLE / 2, extraRotation) -
            (steering * PI) / 120,
        ]}
      >
        <Skybox />
        <Slope />
        <Flags />
        <Debris position={[6.5, 1.35, 2]} />
        <Debris position={[9.5, 3.15, 2]} />
        <Debris position={[-6.5, 1.35, 2]} />
        <Debris position={[-9.5, 3.15, 2]} />
        <group
          rotation={[
            -SLOPE_ANGLE,
            0,
            lerp(-BORDER_ANGLE, BORDER_ANGLE, extraRotation),
          ]}
          position={[
            -playerX,
            lerp(0, 0.2, extraPosition),
            -lerp(0, 0.2, extraPosition),
          ]}
          scale={[0.5, 0.5, 0.5]}
        >
          <Ski
            position={[-0.15, -0.31, 0.5 + steering * 0.2]}
            rotation={[
              0,
              2 * Math.atan(clamp(steering * 2, -1, 1) / velocity),
              0,
            ]}
          />
          <Ski
            position={[0.15, -0.31, 0.5 - steering * 0.2]}
            rotation={[
              0,
              2 * Math.atan(clamp(steering * 2, -1, 1) / velocity),
              0,
            ]}
          />
        </group>
        {/*<PointerLockControls selector="canvas" />*/}
      </group>
    </>
  );
};
