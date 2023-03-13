import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { abs, clamp, lerp, sqrt, pow, rand, irand } from "app/math";
import { mapStrings } from "app/strings";
import { KbState } from "features/kb/slice";

import {
  A,
  V,
  Vx,
  Vboost,
  Vslow,
  CLOCK_DELTA,
  SLOPE_LENGTH,
  SLOPE_WIDTH,
  EXTRA_PLAYER_PADDING,
  CORRECT_PERCENT,
} from "config";
import { multiply, multiply_reverse } from "config/quiz/multiply";
import { add } from "config/quiz/add";

const mul_keys = Array.from(multiply.keys());
const add_keys = Array.from(add.keys());

const quiz = add,
  quiz_keys = add_keys;

export interface Flag {
  text?: string;
  x: number;
  z: number;
}

export interface GameState {
  start: number;
  activeQuestion: [string, string | string[]];
  gameLoopActive: boolean;
  velocity: number;
  Xvelocity: number;
  distance: number;
  steering: number;
  score: number;
  inARow: number;
  shakes: number;
  gameState: "starting" | "playing";
  flags: Flag[];
  delta: number;
  ticks: number;
  playerX: number;
  boost: number;
  settings: {
    "tutor-mode": boolean;
    v: number;
    density: number;
  };
}

const initialState: GameState = {
  start: 0,
  activeQuestion: ["", "СТАРТ"],
  gameLoopActive: true,
  velocity: 0,
  Xvelocity: 0,
  distance: 0,
  steering: 0,
  score: 0,
  inARow: 0,
  shakes: 0,
  gameState: "starting",
  flags: [
    {
      text: "СТАРТ",
      x: -2,
      z: -SLOPE_LENGTH / 6,
    },
    {
      text: "СТАРТ",
      x: 2,
      z: (-2 * SLOPE_LENGTH) / 6,
    },
    {
      text: "СТАРТ",
      x: 3,
      z: (-3 * SLOPE_LENGTH) / 6,
    },
    {
      text: "СТАРТ",
      x: -2,
      z: (-4 * SLOPE_LENGTH) / 6,
    },
    {
      text: "СТАРТ",
      x: -3,
      z: (-5 * SLOPE_LENGTH) / 6,
    },
    {
      text: "СТАРТ",
      x: 3,
      z: (-6 * SLOPE_LENGTH) / 6,
    },
  ],
  delta: 0,
  ticks: 0,
  playerX: 0,
  boost: 0,
  settings: {
    "tutor-mode": false,
    v: 1,
    density: 1,
  },
};

export const flagHitTest = (flag: Flag, playerX: number): boolean => {
  return (
    flag.z > 0 && clamp(-playerX, flag.x - 0.55, flag.x + 0.55) === -playerX
  );
};

const CONTROL_MAP: Record<string, string[]> = {
  ArrowUp: ["ArrowUp", "KeyW", "Space"],
  ArrowLeft: ["ArrowLeft", "KeyA", "ShiftLeft"],
  ArrowDown: ["ArrowDown", "KeyS", "AltLeft", "AltRight"],
  ArrowRight: ["ArrowRight", "KeyD", "ShiftRight"],
};

export const kbToControls = (kb: KbState): KbState => {
  const r: KbState = {};
  for (let x in CONTROL_MAP) {
    r[x] = CONTROL_MAP[x].map((y) => kb[y]).some((z) => z);
  }
  return r;
};

export const slice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame: (state) => {
      console.log("starting game");
      state.start = Date.now();
      state.distance = 0;
      state.gameState = "playing";
      state.gameLoopActive = true;
      slice.caseReducers.genQuestion(state);
    },
    toggleSetting: (state, { payload }: PayloadAction<"tutor-mode">) => {
      state.settings["tutor-mode"] = !state.settings["tutor-mode"];
    },
    setNumberSetting: (
      state,
      {
        payload: { setting, value },
      }: PayloadAction<{ setting: "density" | "v"; value: number }>
    ) => {
      state.settings[setting] = value;
    },
    genQuestion: (state) => {
      let key = quiz_keys[irand(quiz_keys.length)];
      while (key === state.activeQuestion[0])
        key = quiz_keys[irand(quiz_keys.length)];
      state.activeQuestion = [key, quiz.get(key) || ""];
      state.flags = state.flags.map((flag) => {
        if (flag.z < -SLOPE_LENGTH / 5) {
          let text = "";
          const correct = irand(100) < CORRECT_PERCENT;
          if (correct) {
            const pool =
              typeof state.activeQuestion[1] === "string"
                ? [state.activeQuestion[1]]
                : state.activeQuestion[1];
            text = pool[irand(pool.length)];
          } else {
            let key = quiz_keys[irand(quiz_keys.length)];
            while (key === state.activeQuestion[0])
              key = quiz_keys[irand(quiz_keys.length)];
            quiz.get(key) || console.log(key);
            text = quiz.get(key) || "";
          }
          return { ...flag, text };
        } else return flag;
      });
    },
    pause: (state) => {
      state.gameLoopActive = false;
    },
    unpause: (state) => {
      state.gameLoopActive = true;
    },
    reset: (state) => initialState,
    tick: (
      state,
      { payload }: PayloadAction<{ delta: number; kb: KbState }>
    ) => {
      if (state.gameLoopActive) {
        const { delta, kb } = payload;
        const controls = kbToControls(kb);
        state.delta = delta;
        state.boost = clamp(
          state.boost +
            3 *
              delta *
              (Number(controls.ArrowUp || 0) - Number(controls.ArrowDown || 0)),
          -1,
          1
        );
        if (!controls.ArrowUp && !controls.ArrowDown) {
          state.boost *= 0.9;
          if (abs(state.boost) < 0.01) state.boost = 0;
        }
        const a =
          A +
          2 *
            A *
            Number(controls.ArrowUp || controls.ArrowDown || 0) *
            state.settings.v;
        const Vmax = Math.max(
          state.settings.v *
            (controls.ArrowUp ? Vboost : controls.ArrowDown ? Vslow : V),
          state.velocity - delta * a * state.settings.v
        );
        state.velocity = clamp(
          state.velocity + delta * a * state.settings.v,
          0,
          Vmax
        );
        state.ticks++;
        const extraPosition = sqrt(
          clamp(
            ((abs(state.playerX) - SLOPE_WIDTH / 2) / EXTRA_PLAYER_PADDING) * 2,
            0.0,
            0.65
          )
        );
        const sign = state.playerX / abs(state.playerX) || 0;
        const gravity = extraPosition
          ? -pow(1 - extraPosition, 1.5) * sign * 0.025
          : 0;
        const lastX = state.playerX;
        state.playerX = clamp(
          state.playerX +
            (gravity +
              Vx *
                (1 - extraPosition) *
                delta *
                (Number(controls.ArrowLeft || 0) -
                  Number(controls.ArrowRight || 0))) *
              state.settings.v,
          -(SLOPE_WIDTH + EXTRA_PLAYER_PADDING) / 2,
          (SLOPE_WIDTH + EXTRA_PLAYER_PADDING) / 2
        );
        state.Xvelocity = (state.playerX - lastX) / delta;
        state.steering = clamp(
          state.steering +
            (Number(controls.ArrowLeft || 0) -
              Number(controls.ArrowRight || 0)) *
              delta *
              3,
          -1,
          1
        );
        if (!controls.ArrowLeft && !controls.ArrowRight) {
          state.steering *= 0.8;
          if (abs(state.steering) < 0.01) state.steering = 0;
        }

        const hitFlag = state.flags.find((flag) =>
          flagHitTest(flag, state.playerX)
        );
        if (hitFlag) {
          if (hitFlag.text === state.activeQuestion[1]) {
            if (state.gameState === "starting") {
              slice.caseReducers.startGame(state);
            } else {
              // where we count score
              state.score++;
              state.inARow++;
              slice.caseReducers.genQuestion(state);
            }
          } else if (hitFlag.text !== "СТАРТ") {
            state.inARow = 0;
            state.shakes++;
          }
        }
        state.flags = state.flags.map((flag) => {
          if (flag.z > 0) {
            if (
              !hitFlag &&
              flag.text === state.activeQuestion[1] &&
              flag.text !== "СТАРТ"
            ) {
              state.inARow = 0;
              state.shakes++;
            }
            let flagx = 0,
              text = "";
            if (state.gameState === "starting") {
              text = "СТАРТ";
            } else {
              const correct = irand(100) < CORRECT_PERCENT;
              if (correct) {
                const pool =
                  typeof state.activeQuestion[1] === "string"
                    ? [state.activeQuestion[1]]
                    : state.activeQuestion[1];
                text = pool[irand(pool.length)];
              } else {
                let key = quiz_keys[irand(quiz_keys.length)];
                while (key === state.activeQuestion[0])
                  key = quiz_keys[irand(quiz_keys.length)];
                quiz.get(key) || console.log(key);
                text = quiz.get(key) || "";
              }
            }
            while (flagHitTest({ x: flagx, z: flag.z }, state.playerX))
              flagx = rand(-SLOPE_WIDTH / 2, SLOPE_WIDTH / 2);
            return { text, x: flagx, z: -SLOPE_LENGTH };
          } else return { ...flag, z: flag.z + state.velocity * delta };
        });
        state.distance += state.velocity * delta;
      }
    },
  },
});

export const {
  startGame,
  pause,
  unpause,
  reset,
  tick,
  toggleSetting,
  setNumberSetting,
} = slice.actions;

export default slice.reducer;
