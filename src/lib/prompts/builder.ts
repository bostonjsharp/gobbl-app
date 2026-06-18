import { MASTER_TEMPLATE } from "./template";
import { BELIEFS } from "./beliefs";
import { PARAMETERS, ParameterName } from "./parameters";
import type { Persona } from "@/lib/personas/pool";

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
 * Assembles the full system prompt from a Persona:
 * - {name} ← persona.initials
 * - {backstory} ← persona.backstory
 * - {beliefs} ← BELIEFS[persona.beliefKey]
 * - 8 parameter placeholders ← PARAMETERS[name][persona.params[name]]
 *
 * Adds the Full Gobble addendum when persona.tier === "Full Gobble".
 */
export function buildSystemPrompt(persona: Persona): string {
  let prompt = MASTER_TEMPLATE
    .replaceAll("{name}", persona.initials)
    .replace("{backstory}", persona.backstory)
    .replace("{beliefs}", BELIEFS[persona.beliefKey]);

  for (const [placeholder, paramName] of Object.entries(PLACEHOLDER_MAP)) {
    const level = persona.params[paramName];
    const paramText = PARAMETERS[paramName][level];
    prompt = prompt.replace(placeholder, paramText);
  }

  if (persona.tier === "Full Gobble") {
    prompt += `

GOBBL — FULL GOBBLE MODE (mandatory):
The baseline "friendly" demeanor at the top of this prompt does NOT apply in this mode. The user is practicing civil discourse under maximum hostility. If they are polite, respectful, or constructive, do NOT soften, thank them, or match their tone with warmth — Abrasiveness level 5 requires you to stay dismissive and combative regardless. Politeness from the challenger is the exercise; it is not a signal to become nicer.`;
  }

  return prompt;
}
