/**
 * Compute Robert's ideology key by "flipping" the user's onboarding belief.
 *
 * The user's belief comes from the onboarding survey (a BeliefKey on User).
 * Robert is meant to push the *opposite* perspective so the user practices
 * across the aisle. Center users get a small randomization either way.
 *
 * Add this file alongside `beliefs.ts`.
 */

import { BeliefKey, BELIEF_KEYS, IDEOLOGY_OPTIONS } from "./beliefs";

const FLIP: Record<BeliefKey, BeliefKey> = {
  left: "right",
  "lean-left": "lean-right",
  center: "lean-right", // default opposing nudge; tweak as desired
  "lean-right": "lean-left",
  right: "left",
};

/** Robert's belief = opposite of user's onboarding belief. */
export function flipBelief(userBelief: BeliefKey | null | undefined): BeliefKey {
  if (!userBelief) return "lean-right";
  return FLIP[userBelief] ?? "center";
}

/** Human-readable description of why Robert's running the politics he is today. */
export function describeFlip(userBelief: BeliefKey | null | undefined): string {
  if (!userBelief) {
    return "Robert is leaning conservative — set so you practice across the aisle.";
  }
  const target = flipBelief(userBelief);
  const userLabel   = IDEOLOGY_OPTIONS.find((o) => o.key === userBelief)?.label ?? "moderate";
  const robertLabel = IDEOLOGY_OPTIONS.find((o) => o.key === target)?.label ?? "moderate";
  return `You're ${userLabel.toLowerCase()}, so he's leaning ${robertLabel.toLowerCase()} — set from your onboarding profile.`;
}
