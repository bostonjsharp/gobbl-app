"use client";

import { FlatTurkey } from "@/components/gamification/FlatTurkey";
import { BODY_SCALE, type TurkeyConfig, type OutfitConfig, type FeatherConfig } from "@/lib/turkey-parts/types";

// ─── Default colors (fall back when parts aren't overridden) ─────────────────
const D = {
  body:      "#C0461C",
  bodyDark:  "#8E2F11",
  belly:     "#E4A547",
  fan1:      "#E4A547",
  fan2:      "#C0461C",
  fan3:      "#7A2916",
  fan4:      "#1F4937",
  beak:      "#F5B73D",
  wattle:    "#B82914",
  eye:       "#1A1612",
  white:     "#FFFFFF",
  feet:      "#7A2916",
  crown:     "#E4A547",
};

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * ComposableTurkey — assembles a turkey from discrete, swappable parts.
 *
 * Stage 8 (Thunderbird) is fully parameterised: body size, feather colors,
 * expression, outfit overlay, gobble, feet, and beak are all driven by config.
 *
 * Stages 1–7 delegate to FlatTurkey with optional feather color overrides;
 * full parameterisation for those stages can be added here over time.
 */
export function ComposableTurkey(config: TurkeyConfig) {
  const {
    stage,
    sizePx = 160,
    animate = false,
    className,
  } = config;

  // Stages 1–7: delegate to FlatTurkey with optional feather tint
  if (stage < 8) {
    const firstColor = config.feathers?.colors?.[0];
    return (
      <FlatTurkey
        stage={stage}
        size={sizePx}
        animate={animate}
        className={className}
        palette={firstColor ? {
          fan1: firstColor,
          fan2: firstColor,
          fan3: firstColor,
          fan4: firstColor,
        } : undefined}
      />
    );
  }

  // Stage 8 — full custom render
  return renderThunderbird(config);
}

// ─── Stage 8 renderer ─────────────────────────────────────────────────────────

function renderThunderbird(config: TurkeyConfig) {
  const { sizePx = 160, animate = false, className, bodySize = "medium" } = config;

  const scale = BODY_SCALE[bodySize];
  const bodyRx = 36 * scale;          // base rx=36 for Thunderbird
  const bodyRy = 32;                  // ry stays constant

  // Part configs with defaults
  const beakColor  = config.beak?.color  ?? D.beak;
  const gobbleColor = config.gobble?.color ?? D.wattle;
  const feetColor  = config.feet?.color  ?? D.feet;
  const expression = config.expression ?? "neutral";

  const idleClass = animate ? "animate-float" : "";
  const svgClass  = [idleClass, className].filter(Boolean).join(" ");

  return (
    <svg
      viewBox="0 0 200 200"
      width={sizePx}
      height={sizePx}
      className={svgClass}
      aria-label="The President"
      role="img"
    >
      {/* Background aura */}
      {renderAura(config.feathers)}

      {/* Tail feather fans — rendered behind body */}
      {renderOuterFan(config.feathers)}
      {renderInnerFan(config.feathers)}

      {/* Body */}
      {config.outfit?.type === "suit"
        ? renderSuitBody(bodyRx, bodyRy, config.outfit)
        : renderStandardBody(bodyRx, bodyRy)}

      {/* Head */}
      <circle cx="100" cy="100" r="22" fill={D.body} />
      <ellipse cx="92" cy="92" rx="8" ry="6" fill={D.belly} opacity="0.35" />

      {/* Crown — authority symbol in feather color or default crown color */}
      {renderCrown(config.feathers?.colors?.[0] ?? D.crown)}

      {/* Expression layer (eyebrows) */}
      {renderExpression(expression)}

      {/* Eyes */}
      {renderEyes()}

      {/* Beak */}
      {renderBeak(beakColor, expression)}

      {/* Gobble / wattle */}
      {renderGobble(gobbleColor, config.gobble?.scale ?? 1)}

      {/* Feet */}
      {renderFeet(feetColor, config.feet?.scale ?? 1)}
    </svg>
  );
}

// ─── Part renderers ───────────────────────────────────────────────────────────

function renderAura(feathers?: FeatherConfig) {
  const color = feathers?.colors?.[0] ?? D.fan1;
  return <circle cx="100" cy="100" r="96" fill={color} opacity="0.06" />;
}

function renderOuterFan(feathers?: FeatherConfig) {
  const count  = feathers?.outerCount ?? 11;
  const colors = feathers?.colors ?? [D.fan3, D.fan2, D.fan1, D.fan4, D.fan1, D.fan2, D.fan3, D.fan2, D.fan1, D.fan3, D.fan2];
  const spread = 180;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const deg = -spread / 2 + (i * spread) / (count - 1);
        const fill = colors[i % colors.length];
        return (
          <g key={`outer-${i}`} transform={`rotate(${deg} 100 132)`}>
            {/* Feather body */}
            <ellipse cx="100" cy="34" rx="13" ry="50" fill={fill} />
            {/* Feather tip highlight — always a soft white sheen */}
            <ellipse cx="100" cy="14" rx="7" ry="14" fill="white" opacity="0.20" />
          </g>
        );
      })}
    </>
  );
}

function renderInnerFan(feathers?: FeatherConfig) {
  const count  = feathers?.innerCount ?? 7;
  const colors = feathers?.colors ?? [D.fan2, D.fan1, D.fan3, D.belly, D.fan3, D.fan1, D.fan2];

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const deg = -55 + (i * 110) / (count - 1);
        const fill = colors[i % colors.length];
        return (
          <g key={`inner-${i}`} transform={`rotate(${deg} 100 132)`}>
            <ellipse cx="100" cy="72" rx="9" ry="32" fill={fill} />
          </g>
        );
      })}
    </>
  );
}

function renderStandardBody(rx: number, ry: number) {
  return (
    <>
      <ellipse cx="102" cy="134" rx={rx} ry={ry} fill={D.bodyDark} />
      <ellipse cx="100" cy="132" rx={rx} ry={ry} fill={D.body} />
      <ellipse cx="100" cy="142" rx={rx * 0.67} ry="15" fill={D.belly} opacity="0.9" />
      <ellipse cx="100" cy="122" rx="14" ry="6" fill={D.bodyDark} opacity="0.3" />
    </>
  );
}

function renderSuitBody(rx: number, ry: number, outfit: OutfitConfig & { type: "suit" }) {
  const { jacketColor, shirtColor, tieColor } = outfit;

  // Tie dark = 20% darker than tieColor — we approximate by hardcoding at 80% opacity on black mix
  const tieDark = tieColor;

  // Anchor: body top ≈ 132 - 32 = 100; collar sits at y≈106 (just below head/neck join)
  // Shirt strip: narrow V from collar down through body center
  // Lapels: dark jacket triangles flanking the shirt strip

  return (
    <>
      {/* Jacket base */}
      <ellipse cx="102" cy="134" rx={rx} ry={ry} fill="#0C0C1A" />
      <ellipse cx="100" cy="132" rx={rx} ry={ry} fill={jacketColor} />

      {/* White shirt strip — center vertical panel */}
      <path
        d={`M94,106 L106,106 L108,164 L92,164 Z`}
        fill={shirtColor}
      />

      {/* Left lapel — covers left portion of shirt, exposes shirt on right */}
      <path
        d={`M94,106 L${100 - rx * 0.60},126 L${100 - rx * 0.54},164 L92,164 Z`}
        fill={jacketColor}
      />

      {/* Right lapel */}
      <path
        d={`M106,106 L${100 + rx * 0.60},126 L${100 + rx * 0.54},164 L108,164 Z`}
        fill={jacketColor}
      />

      {/* Left collar point */}
      <path
        d={`M94,106 Q87,111 86,119 L97,117 Z`}
        fill={shirtColor}
      />

      {/* Right collar point */}
      <path
        d={`M106,106 Q113,111 114,119 L103,117 Z`}
        fill={shirtColor}
      />

      {/* Tie knot */}
      <path d="M97,117 L103,117 L101,122 L99,122 Z" fill={tieDark} opacity="0.85" />

      {/* Tie body (trapezoid narrowing to point) */}
      <path d="M99,122 L101,122 L103,142 L100,148 L97,142 Z" fill={tieColor} />

      {/* Tie highlight — subtle sheen on upper half */}
      <path d="M99.5,122 L100.5,122 L101.5,132 L100,133 L98.5,132 Z" fill="white" opacity="0.15" />
    </>
  );
}

function renderCrown(color: string) {
  return (
    <>
      {/* Crown shape */}
      <path
        d="M82 78 L88 64 L100 76 L112 64 L118 78 L114 84 L86 84 Z"
        fill={color}
        opacity="0.95"
      />
      {/* Crown shadow/depth */}
      <path
        d="M86 84 L100 76 L114 84 Z"
        fill="black"
        opacity="0.12"
      />
      {/* Crown gem highlights at each point */}
      <circle cx="88"  cy="64" r="2.5" fill="white" opacity="0.6" />
      <circle cx="100" cy="62" r="3"   fill="white" opacity="0.6" />
      <circle cx="112" cy="64" r="2.5" fill="white" opacity="0.6" />
    </>
  );
}

function renderExpression(expression: string) {
  if (expression === "grumpy") {
    return (
      <>
        {/*
          Furrowed brows: inner corners angled DOWN toward bridge of nose.
          Left brow: outer-high (84,90) → inner-low (96,95)
          Right brow: outer-high (116,90) → inner-low (104,95)
          Creates the classic stern/angry V-shape.
        */}
        <path
          d="M84,90 Q90,88 96,94"
          stroke={D.eye}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M116,90 Q110,88 104,94"
          stroke={D.eye}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Brow furrow shadow between inner brows */}
        <path
          d="M97,94 Q100,92 103,94"
          stroke={D.eye}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.45"
        />
        {/* Heavy upper eyelid lines — aging/stern look */}
        <path d="M87,97 Q92,95 97,97" stroke={D.bodyDark} strokeWidth="1.6" fill="none" opacity="0.4" />
        <path d="M113,97 Q108,95 103,97" stroke={D.bodyDark} strokeWidth="1.6" fill="none" opacity="0.4" />
      </>
    );
  }

  if (expression === "happy") {
    return (
      <>
        {/* Raised outer brow corners */}
        <path d="M84,92 Q90,87 96,91" stroke={D.eye} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M116,92 Q110,87 104,91" stroke={D.eye} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </>
    );
  }

  if (expression === "smug") {
    return (
      <>
        <path d="M84,92 Q90,90 96,92" stroke={D.eye} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M116,91 Q110,90 104,92" stroke={D.eye} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </>
    );
  }

  // neutral — no extra marks
  return null;
}

function renderEyes() {
  return (
    <>
      <circle cx="92"  cy="100" r="5.5" fill={D.white} />
      <circle cx="108" cy="100" r="5.5" fill={D.white} />
      <circle cx="92"  cy="101" r="3.5" fill={D.eye} />
      <circle cx="108" cy="101" r="3.5" fill={D.eye} />
      <circle cx="93"  cy="100" r="1.2" fill={D.white} />
      <circle cx="109" cy="100" r="1.2" fill={D.white} />
    </>
  );
}

function renderBeak(color: string, expression: string) {
  if (expression === "grumpy") {
    // Beak angled slightly — corners of mouth drawn down
    return (
      <>
        <path d="M93,110 L107,110 L100,120 Z" fill={color} />
        {/* Downturned mouth line */}
        <path d="M95,114 Q100,112 105,114" stroke={D.bodyDark} strokeWidth="1.2" fill="none" opacity="0.3" />
      </>
    );
  }
  return <path d="M93,110 L107,110 L100,120 Z" fill={color} />;
}

function renderGobble(color: string, scale: number) {
  const sw = 4 * scale;
  return (
    <path
      d="M100 120 Q106 130 96 134"
      stroke={color}
      strokeWidth={sw}
      fill="none"
      strokeLinecap="round"
    />
  );
}

function renderFeet(color: string, _scale: number) {
  return (
    <path
      d="M88 168 L84 178 M96 168 L96 178 M104 168 L104 178 M112 168 L116 178"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
    />
  );
}
