import { ParameterName, ParameterLevel } from "./parameters";

export type DifficultyPreset = Record<ParameterName, ParameterLevel>;

export const DIFFICULTY_PRESETS: Record<string, DifficultyPreset> = {
  "Friendly Cluck": {
    participation: 3,
    expression: 2,
    reason_giving: 3,
    listening: 5,
    self_interrogation: 4,
    disagreement: 2,
    abrasiveness: 1,
    persuadability: 4,
  },
  "Spirited Strut": {
    participation: 4,
    expression: 4,
    reason_giving: 4,
    listening: 3,
    self_interrogation: 3,
    disagreement: 4,
    abrasiveness: 3,
    persuadability: 2,
  },
  "Full Gobble": {
    participation: 5,
    expression: 5,
    reason_giving: 3,
    listening: 2,
    self_interrogation: 1,
    disagreement: 5,
    abrasiveness: 5,
    persuadability: 1,
  },
};

export function getPresetForDifficulty(difficulty: string): DifficultyPreset {
  return DIFFICULTY_PRESETS[difficulty] ?? DIFFICULTY_PRESETS["Spirited Strut"];
}
