// ─────────────────────────────────────────────────────────────────────────────
// Turkey Parts — Type Library
//
// All parts live in a shared 200×200 viewBox coordinate space.
// Anchor points below define where parts connect within that space.
//
// STAGE 8 (THUNDERBIRD) ANCHORS
//   featherPivot  (100, 132)  rotation center for all tail-fan feathers
//   bodyCenter    (100, 132)  center of main body ellipse
//   bodyTop       (100, 100)  top of body / base of neck
//   bodyBottom    (100, 164)  bottom of body ellipse
//   headCenter    (100, 100)  center of head circle
//   browLeft      ( 92,  91)  midpoint of left eyebrow arc
//   browRight     (108,  91)  midpoint of right eyebrow arc
//   eyeLeft       ( 92, 100)  center of left eye
//   eyeRight      (108, 100)  center of right eye
//   beakBase      (100, 110)  where beak attaches to head
//   beakTip       (100, 120)  tip of standard beak
//   gobbleBase    ( 96, 120)  wattle attachment (left of beak tip)
//   crownBase     ( 86,  84)  base of crown shape
//   crownPeak     (100,  62)  topmost crown point
//   feetLeft      ( 88, 168)  left leg root
//   feetRight     (112, 168)  right leg root
//   collarPoint   (100, 106)  top of shirt/collar area (suits)
//
// For other stages, scale anchors proportionally to the body ellipse size.
// ─────────────────────────────────────────────────────────────────────────────

export type TurkeyStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Body width variants — scales the body ellipse rx. */
export type BodySize = "slim" | "medium" | "large";

/** Beak silhouette types — more may be added. */
export type BeakShape = "standard";

/** Wattle/gobble silhouette types. */
export type GobbleShape = "single-curl";

/** Foot silhouette types. */
export type FeetShape = "standard";

/** Facial expression presets. */
export type ExpressionType = "neutral" | "grumpy" | "happy" | "smug";

// ─── Part configs ────────────────────────────────────────────────────────────

export interface FeatherConfig {
  /**
   * Fill colors for each feather position, indexed by slot.
   * Wraps (modulo) if shorter than the fan count.
   * Pass a single-element array to make all feathers the same color.
   */
  colors: string[];
  /** Outer fan count. Default: 11 for stage 8. */
  outerCount?: number;
  /** Inner fan count. Default: 7 for stage 8. */
  innerCount?: number;
}

export interface GobbleConfig {
  shape?: GobbleShape;
  color: string;
  /** Scale factor relative to default size. Default: 1. */
  scale?: number;
}

export interface FeetConfig {
  shape?: FeetShape;
  color: string;
  /** Scale factor relative to default size. Default: 1. */
  scale?: number;
}

export interface BeakConfig {
  shape?: BeakShape;
  color: string;
}

/** Suit outfit overlay — drawn on top of the body ellipse. */
export interface SuitOutfit {
  type: "suit";
  jacketColor: string;
  shirtColor: string;
  tieColor: string;
}

export type OutfitConfig = SuitOutfit;

// ─── Top-level turkey config ─────────────────────────────────────────────────

export interface TurkeyConfig {
  stage: TurkeyStage;
  bodySize: BodySize;

  /** Override feather colors. Defaults to the stage's natural palette. */
  feathers?: FeatherConfig;
  gobble?: GobbleConfig;
  feet?: FeetConfig;
  beak?: BeakConfig;
  expression?: ExpressionType;

  /** Outfit drawn on top of the body. null = no outfit. */
  outfit?: OutfitConfig | null;

  // Rendering
  sizePx?: number;
  animate?: boolean;
  className?: string;
}

// ─── Body size scale factors ─────────────────────────────────────────────────

export const BODY_SCALE: Record<BodySize, number> = {
  slim:   0.80,
  medium: 1.00,
  large:  1.25,
};
