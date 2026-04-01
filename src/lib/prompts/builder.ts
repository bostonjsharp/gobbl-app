import { MASTER_TEMPLATE } from "./template";
import { BELIEFS, BeliefKey } from "./beliefs";
import { PARAMETERS, ParameterName } from "./parameters";
import { getPresetForDifficulty } from "./presets";

const PLACEHOLDER_MAP: Record<string, ParameterName> = {
  "{participation}": "participation",
  "{expression}": "expression",
  "{reason_giving}": "reason_giving",
  "{listening}": "listening",
  "{self_interrogation}": "self_interrogation",
  "{disagreement}": "disagreement",
  "{abrasiveness}": "abrasiveness",
  "{persuadability}": "persuadability",
};

/**
 * Assembles the full SAIL Lab system prompt by combining:
 * 1. The difficulty preset → 8 parameter values
 * 2. Each parameter value → its full prompt text
 * 3. User-chosen belief set (ideology)
 * 4. Everything interpolated into the master template
 *
 * Mirrors generate_full_prompt() from sail.py.
 */
export function buildSystemPrompt(difficulty: string, beliefKey: BeliefKey): string {
  const preset = getPresetForDifficulty(difficulty);
  const beliefText = BELIEFS[beliefKey];

  let prompt = MASTER_TEMPLATE.replace("{beliefs}", beliefText);

  for (const [placeholder, paramName] of Object.entries(PLACEHOLDER_MAP)) {
    const level = preset[paramName];
    const paramText = PARAMETERS[paramName][level];
    prompt = prompt.replace(placeholder, paramText);
  }

  if (difficulty === "Full Gobble") {
    prompt += `

GOBBL — FULL GOBBLE MODE (mandatory):
The baseline "friendly" demeanor at the top of this prompt does NOT apply in this mode. The user is practicing civil discourse under maximum hostility. If they are polite, respectful, or constructive, do NOT soften, thank them, or match their tone with warmth — Abrasiveness level 5 requires you to stay dismissive and combative regardless. Politeness from the challenger is the exercise; it is not a signal to become nicer.`;
  }

  return prompt;
}
