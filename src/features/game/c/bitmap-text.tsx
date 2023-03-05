import { FC, useRef, useMemo } from "react";
import { Vector2, Mesh } from "three";
import { useTexture } from "@react-three/drei";
import { multiply } from "config/quiz/multiply";
import { mapStrings, offsetLookup } from "app/strings";

const strings = mapStrings(multiply);
const offsets = offsetLookup(strings, 1 / strings.length);

const repeat = new Vector2(1, 1 / strings.length);

interface Props {
  children: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const BitmapText: FC<Props> = ({ children, ...props }) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(null);
  // Hold state for hovered and clicked events

  const colorMap = useTexture("/mul.png");
  colorMap.repeat = repeat;
  const clone = useMemo(() => {
    let x = colorMap.clone();
    x.offset = new Vector2(0, offsets.get(children));
    console.log(
      (offsets.get(children) || 0) * strings.length,
      children,
      strings.length
    );
    x.needsUpdate = true;
    return x;
  }, [colorMap, children]);
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[0.75, 0.4, 0.2]} />
      <meshBasicMaterial attach="material" map={clone} transparent />
    </mesh>
  );
};
