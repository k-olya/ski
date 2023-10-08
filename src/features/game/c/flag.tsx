import { FC } from "react";
import { useLoader } from "@react-three/fiber";
import { Box, Text } from "@react-three/drei";
import { FileLoader } from "three";

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
    {!!text && (
      <Text
        font="Roboto-Regular.ttf"
        position={[0, 0.26, 0.05]}
        scale={[(0.4 / Math.max(text.length, 3)) * 3, 0.4, 0.4]}
      >
        {text}
      </Text>
    )}
    <Box scale={[0.05, 1, 0.05]} position={[0.4, 0, 0]}>
      <meshPhongMaterial attach="material" color="gray" />
    </Box>
  </group>
);

useLoader.preload(FileLoader, "Roboto-Regular.ttf");
