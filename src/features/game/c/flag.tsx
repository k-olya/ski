import { FC } from "react";
import { Box } from "@react-three/drei";

interface Props {
  color: string | number;
  position: [number, number, number];
  text?: string;
}

export const Flag: FC<Props> = ({ color, position, text }) => (
  <group position={position} scale={[1, 1, 1]}>
    <Box scale={[0.05, 1, 0.05]} position={[-0.4, 0, 0]}>
      <meshPhongMaterial attach="material" color="gray" />
    </Box>
    <Box scale={[0.75, 0.4, 0.05]} position={[0, 0.3, 0]}>
      <meshPhongMaterial attach="material" color={color} />
    </Box>
    {/*!!text && (
      <Text position={[0, 0.26, 0.026]} scale={[0.4, 0.4, 0.4]}>
        {text}
      </Text>
    )*/}
    <Box scale={[0.05, 1, 0.05]} position={[0.4, 0, 0]}>
      <meshPhongMaterial attach="material" color="gray" />
    </Box>
  </group>
);
