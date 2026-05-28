import type { TurkeyConfig } from "./types";

// ─── Politician party mapping ─────────────────────────────────────────────────
// Keyed by the values used in the politician_ranking survey response.

type Party = "dem" | "rep" | "ind";

export const POLITICIAN_PARTIES: Record<string, Party> = {
  aoc:     "dem",
  bush:    "rep",
  hillary: "dem",
  trump:   "rep",
  biden:   "dem",
  harris:  "dem",
  vance:   "rep",
  schumer: "dem",
  bernie:  "ind",
};

// ─── Party color palettes ─────────────────────────────────────────────────────

export interface PartyPalette {
  feather:  string;  // main feather / fan color
  featherLight: string;
  tie:      string;
  tieDark:  string;
  crown:    string;
}

export const PARTY_PALETTES: Record<Party, PartyPalette> = {
  dem: {
    feather:      "#2563EB",
    featherLight: "#93C5FD",
    tie:          "#1E40AF",
    tieDark:      "#1E3A8A",
    crown:        "#3B82F6",
  },
  rep: {
    feather:      "#DC2626",
    featherLight: "#FCA5A5",
    tie:          "#B91C1C",
    tieDark:      "#991B1B",
    crown:        "#EF4444",
  },
  ind: {
    feather:      "#7C3AED",
    featherLight: "#C4B5FD",
    tie:          "#6D28D9",
    tieDark:      "#5B21B6",
    crown:        "#8B5CF6",
  },
};

// ─── The President config factory ────────────────────────────────────────────

/**
 * Derives The President's TurkeyConfig from a politician key.
 *
 * The politician key should be the last item in the user's
 * `politician_ranking` survey response array — i.e. the person
 * they were least excited to talk to.
 */
export function getPresidentConfig(
  politicianKey: string,
  sizePx = 160,
): TurkeyConfig {
  const party = POLITICIAN_PARTIES[politicianKey] ?? "dem";
  const pal = PARTY_PALETTES[party];

  return {
    stage: 8,
    bodySize: "large",
    sizePx,
    animate: false,

    feathers: {
      // Single color makes all feathers uniform party color.
      colors: [pal.feather],
    },

    beak: {
      shape: "standard",
      color: "#F5B73D",
    },

    gobble: {
      shape: "single-curl",
      color: "#B82914",
      scale: 1.2,
    },

    feet: {
      shape: "standard",
      color: "#1C1C2E",
      scale: 1.0,
    },

    expression: "grumpy",

    outfit: {
      type: "suit",
      jacketColor: "#1C1C2E",
      shirtColor:  "#F0EEE9",
      tieColor:    pal.tie,
    },
  };
}

/**
 * Given the raw JSON value of survey_responses.politician_ranking,
 * returns the politicianKey that should be used for The President.
 * Returns "trump" as fallback.
 */
export function getLeastFavoritePolitician(rankingJson: unknown): string {
  try {
    const arr = typeof rankingJson === "string"
      ? (JSON.parse(rankingJson) as unknown[])
      : (rankingJson as unknown[]);
    if (Array.isArray(arr) && arr.length > 0) {
      return String(arr[arr.length - 1]);
    }
  } catch {
    /* fall through */
  }
  return "trump";
}
