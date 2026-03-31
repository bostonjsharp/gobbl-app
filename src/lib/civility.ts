export interface CivilityDimensions {
  respectfulTone: number;
  evidenceBased: number;
  empathy: number;
  constructiveFraming: number;
  activeListening: number;
}

export interface CivilityResult {
  dimensions: CivilityDimensions;
  overall: number;
  feedback: string;
}

export function averageDimensions(dimensions: CivilityDimensions): number {
  const vals = Object.values(dimensions);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function civilityLabel(score: number): string {
  if (score >= 8) return "Magnificent Plumage";
  if (score >= 6) return "Bright Feathers";
  if (score >= 4) return "Ruffled";
  return "Molting";
}

export function civilityColor(score: number): string {
  if (score >= 8) return "text-emerald-500";
  if (score >= 6) return "text-golden-500";
  if (score >= 4) return "text-gobbl-500";
  return "text-plume-500";
}

export function reputationFromScore(score: number): number {
  return Math.round(score * 10);
}

export const DIMENSION_LABELS: Record<keyof CivilityDimensions, string> = {
  respectfulTone: "Respectful Tone",
  evidenceBased: "Evidence-Based Reasoning",
  empathy: "Empathy",
  constructiveFraming: "Constructive Framing",
  activeListening: "Active Listening",
};
