import { useState, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { RoundedBox, PointerLockControls, useCursor } from "@react-three/drei";
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

  const [hover, setHover] = useState(false);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 2, 5]} intensity={1.2} />
      <RoundedBox
        position={[0, 0, -3]}
        rotation={[-1, 0, 0]}
        radius={0.05}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
        smoothness={4}
      >
        <meshPhongMaterial color={hover ? "orange" : "limegreen"} />
      </RoundedBox>
      <Skybox />
      <PointerLockControls selector="canvas" />
    </>
  );
};
