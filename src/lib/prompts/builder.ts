import { MASTER_TEMPLATE } from "./template";
import { BELIEFS } from "./beliefs";
import { PARAMETERS, ParameterName } from "./parameters";
import { getPresetForDifficulty, getBeliefForCategory } from "./presets";

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
 * 3. The topic category → an opposing belief set
 * 4. Everything interpolated into the master template
 *
 * Mirrors generate_full_prompt() from sail.py.
 */
export function buildSystemPrompt(difficulty: string, category: string): string {
  const preset = getPresetForDifficulty(difficulty);
  const beliefKey = getBeliefForCategory(category);
  const beliefText = BELIEFS[beliefKey];

  let prompt = MASTER_TEMPLATE.replace("{beliefs}", beliefText);

  for (const [placeholder, paramName] of Object.entries(PLACEHOLDER_MAP)) {
    const level = preset[paramName];
    const paramText = PARAMETERS[paramName][level];
    prompt = prompt.replace(placeholder, paramText);
  }

  return prompt;
}
