import { Box } from "@react-three/drei"
import { PI } from "app/math"
import { BORDER_ANGLE, SLOPE_ANGLE, SLOPE_LENGTH, PLAYER_POSITION } from "config"

export const Slope = () => <group name="slope" rotation={[- SLOPE_ANGLE, 0, 0]}>
      <Box
      position={[0, -1, PLAYER_POSITION]}
      scale={[10, 1, SLOPE_LENGTH]}
      >
        <meshPhongMaterial color="white" />
      </Box>
      <Box
        position={[-4, -1, PLAYER_POSITION]}
        scale={[8, 1, SLOPE_LENGTH]}
        rotation={[0, 0, - PI / 6]}
      >
        <meshPhongMaterial color="white" />
      </Box>
      <Box
        position={[4, -1, PLAYER_POSITION]}
        scale={[8, 1, SLOPE_LENGTH]}
        rotation={[0, 0, PI / 6]}
      >
        <meshPhongMaterial color="white" />
      </Box>
      </group>

