import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { abs, clamp, lerp, sqrt, pow, rand, irand } from "app/math";
import { reverseMap } from "app/reverse-map";
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
  SCORE_MULTIPLIER,
} from "config";
import { trees } from "./models";
import { multiply, multiply_reverse } from "config/quiz/multiply";
import { add } from "config/quiz/add";
import { subtract } from "config/quiz/subtract";

const QUIZES = { add, subtract, multiply };
const QUIZ_A = Object.keys(QUIZES) as unknown[] as Quizes[];
const QUIZ_KEYS = Object.fromEntries(
  QUIZ_A.map(q => [q, Array.from(QUIZES[q].keys())])
);
const REVERSE_QUIZES = Object.fromEntries(
  QUIZ_A.map(q => [q, reverseMap(QUIZES[q])])
);
const REVERSE_QUIZ_KEYS = Object.fromEntries(
  QUIZ_A.map(q => [q, Array.from(REVERSE_QUIZES[q].keys())])
);
type Quizes = "add" | "subtract" | "multiply";

export interface Flag {
  text?: string;
  modelIndex?: number;
  x: number;
  z: number;
}

export interface GameState {
  start: number;
  activeQuestion: [string, string | string[]];
  activeQuiz: Quizes;
  activeReverse: boolean;
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
  debris: Flag[];
  trampolines: Flag[];
  trampolineEventTime: number;
  delta: number;
  ticks: number;
  playerX: number;
  boost: number;
  settings: {
    "tutor-mode": boolean;
    v: number;
    density: number;
    reverse: boolean;
    quizes: {
      add: boolean;
      subtract: boolean;
      multiply: boolean;
    };
  };
}

const initialState: GameState = {
  start: 0,
  activeQuestion: ["", "СТАРТ"],
  activeQuiz: "multiply",
  activeReverse: false,
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
  debris: [
    {
      x: -3.3,
      z: (-2.5 * SLOPE_LENGTH) / 6,
    },
  ],
  trampolines: [
    {
      x: 3.3,
      z: (-5.25 * SLOPE_LENGTH) / 6,
    },
  ],
  trampolineEventTime: 0,
  delta: 0,
  ticks: 0,
  playerX: 0,
  boost: 0,
  settings: {
    "tutor-mode": false,
    v: 1,
    density: 1,
    reverse: false,
    quizes: {
      add: false,
      subtract: false,
      multiply: true,
    },
  },
};

export const flagHitTest = (
  flag: Flag,
  playerX: number,
  w: number = 1.1
): boolean => {
  return (
    flag.z > 0 &&
    clamp(-playerX, flag.x - w * 0.5, flag.x + w * 0.5) === -playerX
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
    r[x] = CONTROL_MAP[x].map(y => kb[y]).some(z => z);
  }
  return r;
};

export const isCorrectFlag = (
  activeQuestion: [string, string | string[]],
  hitFlag: Flag
): boolean => {
  if (activeQuestion[1] === "СТАРТ") {
    return true;
  }
  // fill in every possible answer to avoid confusion
  const question: [string, string[]] = [
    activeQuestion[0],
    QUIZ_A.flatMap(q =>
      [QUIZES[q].get(activeQuestion[0]) || ""]
        .concat(REVERSE_QUIZES[q].get(activeQuestion[0]) || [])
        .concat(
          // 2 * 2 === 2 + 2
          typeof activeQuestion[1] === "string"
            ? REVERSE_QUIZES[q].get(activeQuestion[1]) || []
            : []
        )
    ),
  ];
  return question[1].includes(hitFlag.text || "");
};

export const slice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame: state => {
      console.log("starting game");
      state.start = Date.now();
      state.distance = 0;
      state.gameState = "playing";
      state.gameLoopActive = true;
      slice.caseReducers.genQuestion(state);
    },
    toggleSetting: (
      state,
      { payload }: PayloadAction<"tutor-mode" | "reverse">
    ) => {
      state.settings[payload] = !state.settings[payload];
    },
    toggleQuizSetting: (state, { payload }: PayloadAction<Quizes>) => {
      state.settings.quizes[payload] = !state.settings.quizes[payload];

      // prevent having an empty list
      if (QUIZ_A.every(q => !state.settings.quizes[q])) {
        state.settings.quizes[payload] = true;
      }
    },
    setNumberSetting: (
      state,
      {
        payload: { setting, value },
      }: PayloadAction<{ setting: "density" | "v"; value: number }>
    ) => {
      state.settings[setting] = value;
    },
    genQuestion: state => {
      const activeSets = QUIZ_A.filter(
        x => state.settings.quizes[x as unknown as Quizes]
      );
      state.activeQuiz = activeSets[irand(activeSets.length)];
      state.activeReverse = state.settings.reverse && Boolean(irand(2));
      const quiz = (state.activeReverse ? REVERSE_QUIZES : QUIZES)[
          state.activeQuiz
        ],
        quiz_keys = (state.activeReverse ? REVERSE_QUIZ_KEYS : QUIZ_KEYS)[
          state.activeQuiz
        ];
      let key = quiz_keys[irand(quiz_keys.length)];
      while (key === state.activeQuestion[0]) {
        key = quiz_keys[irand(quiz_keys.length)];
      }
      state.activeQuestion = [key, quiz.get(key) || ""];
      state.flags = state.flags.map(flag => {
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
            const pool = quiz.get(key) || "";
            text = typeof pool === "string" ? pool : pool[irand(pool.length)];
          }
          return { ...flag, text };
        } else return flag;
      });
    },
    pause: state => {
      state.gameLoopActive = false;
    },
    unpause: state => {
      state.gameLoopActive = true;
    },
    reset: state => initialState,
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

        // flags
        const hitFlag = state.flags.find(flag =>
          flagHitTest(flag, state.playerX)
        );
        if (hitFlag) {
          if (isCorrectFlag(state.activeQuestion, hitFlag)) {
            if (state.gameState === "starting") {
              slice.caseReducers.startGame(state);
            } else {
              // where we count score
              state.inARow++;
              const activeSets = QUIZ_A.filter(
                x => state.settings.quizes[x as unknown as Quizes]
              ).length;
              state.score +=
                SCORE_MULTIPLIER *
                pow(state.inARow, 0.25) *
                activeSets *
                (state.settings.reverse ? 1.5 : 1);
              slice.caseReducers.genQuestion(state);
            }
          } else {
            state.inARow = 0;
            state.shakes++;
          }
        }
        state.flags = state.flags.map(flag => {
          if (flag.z > 0) {
            if (
              !hitFlag &&
              isCorrectFlag(state.activeQuestion, flag) &&
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
                const activeQuizKeys = (
                  state.activeReverse ? REVERSE_QUIZ_KEYS : QUIZ_KEYS
                )[state.activeQuiz];
                let key = activeQuizKeys[irand(activeQuizKeys.length)];
                while (key === state.activeQuestion[0]) {
                  key = activeQuizKeys[irand(activeQuizKeys.length)];
                }
                const pool =
                  (state.activeReverse ? REVERSE_QUIZES : QUIZES)[
                    state.activeQuiz
                  ].get(key) || "";
                text =
                  typeof pool === "string" ? pool : pool[irand(pool.length)];
              }
            }
            while (flagHitTest({ x: flagx, z: flag.z }, state.playerX))
              flagx = rand(-SLOPE_WIDTH / 2, SLOPE_WIDTH / 2);
            return { text, x: flagx, z: -SLOPE_LENGTH };
          } else return { ...flag, z: flag.z + state.velocity * delta };
        });

        // debris
        const hitDebris = state.debris.find(d =>
          flagHitTest(d, state.playerX, 0.4)
        );
        if (hitDebris) {
          if (state.gameState === "playing") {
            state.start = Date.now();
          }
          state.distance = 0;
          state.velocity = 0;
          state.inARow = 0;
          state.score = 0;
        }
        state.debris = state.debris.map(d => {
          if (d.z > 0) {
            const dx = rand(-SLOPE_WIDTH / 2, SLOPE_WIDTH / 2);
            return { modelIndex: irand(trees.length), x: dx, z: -SLOPE_LENGTH };
          } else return { ...d, z: d.z + state.velocity * delta };
        });
        // trampolines
        const hitTrampoline = state.trampolines.find(d =>
          flagHitTest(d, state.playerX, 1)
        );
        if (hitTrampoline) {
          state.trampolineEventTime = Date.now();
        }
        state.trampolines = state.trampolines.map(d => {
          if (d.z > 0) {
            const dx = rand(-SLOPE_WIDTH / 2, SLOPE_WIDTH / 2);
            return { x: dx, z: -SLOPE_LENGTH };
          } else return { ...d, z: d.z + state.velocity * delta };
        });

        // distance
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
  toggleQuizSetting,
  setNumberSetting,
} = slice.actions;

export default slice.reducer;
