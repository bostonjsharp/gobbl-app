"use client";

import React from "react";
import type { SlotOffset } from "@/lib/avatarAnchors";

// ─── Hat items ────────────────────────────────────────────────────────────────

function HatMortarboard() {
  return (
    <g>
      <rect x="80" y="62" width="40" height="14" rx="2" fill="#1A1612"/>
      <rect x="80" y="72" width="40" height="4" fill="#2A2620"/>
      <path d="M62 62 L100 50 L138 62 L100 72 Z" fill="#1A1612"/>
      <path d="M62 62 L100 72 L138 62" stroke="#2A2620" strokeWidth="0.8" fill="none"/>
      <circle cx="100" cy="61" r="2.5" fill="#E4A547"/>
      <path d="M100 61 Q120 70 132 84" stroke="#E4A547" strokeWidth="1.4" fill="none"/>
      <ellipse cx="133" cy="86" rx="3" ry="5" fill="#E4A547"/>
      <ellipse cx="133" cy="86" rx="2" ry="3.5" fill="#C48838"/>
    </g>
  );
}

function HatCrown() {
  return (
    <g>
      <path d="M76 76 L82 60 L92 72 L100 54 L108 72 L118 60 L124 76 Z" fill="#E4A547"/>
      <rect x="76" y="74" width="48" height="6" fill="#C48838"/>
      <circle cx="84" cy="68" r="1.8" fill="#1F4937"/>
      <circle cx="100" cy="62" r="2.2" fill="#C0461C"/>
      <circle cx="116" cy="68" r="1.8" fill="#1F4937"/>
      <path d="M80 76 L84 66" stroke="#FFD86B" strokeWidth="1.2" strokeLinecap="round" opacity="0.9"/>
    </g>
  );
}

function HatBeanie() {
  return (
    <g>
      <path d="M76 78 Q76 52 100 50 Q124 52 124 78 Z" fill="#7A2916"/>
      <path d="M82 78 L83 60 M92 78 L93 55 M100 78 L100 53 M108 78 L107 55 M118 78 L117 60"
            stroke="#5A1810" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <rect x="74" y="74" width="52" height="8" rx="2" fill="#E4A547"/>
      <path d="M74 78 L126 78" stroke="#C48838" strokeWidth="0.8"/>
      <circle cx="100" cy="46" r="6" fill="#F4E3D5"/>
      <circle cx="98" cy="44" r="2" fill="#fff" opacity="0.7"/>
    </g>
  );
}

function HatTopHat() {
  return (
    <g>
      <ellipse cx="100" cy="76" rx="34" ry="4.5" fill="#1A1612"/>
      <path d="M82 76 L82 46 Q82 42 86 42 L114 42 Q118 42 118 46 L118 76 Z" fill="#1A1612"/>
      <ellipse cx="100" cy="44" rx="16" ry="2.5" fill="#2A2620"/>
      <rect x="82" y="66" width="36" height="6" fill="#C0461C"/>
      <rect x="86" y="46" width="2" height="22" fill="#3A2A1F" opacity="0.7"/>
    </g>
  );
}

function HatWizard() {
  return (
    <g>
      <ellipse cx="100" cy="78" rx="36" ry="5" fill="#1F4937"/>
      <path d="M80 78 Q92 78 102 30 Q118 78 120 78 Z" fill="#1F4937"/>
      <path d="M80 78 Q92 78 102 30" stroke="#15392C" strokeWidth="0.8" fill="none"/>
      <path d="M84 76 Q100 80 116 76 L114 70 Q100 74 86 70 Z" fill="#E4A547"/>
      <circle cx="98" cy="60" r="1.6" fill="#FFD86B"/>
      <circle cx="106" cy="52" r="1.2" fill="#FFD86B"/>
      <circle cx="100" cy="42" r="1" fill="#FFD86B"/>
      <path d="M93 67 L94 65 L95 67 L94 69 Z" fill="#FFD86B"/>
    </g>
  );
}

function HatBeret() {
  return (
    <g>
      <ellipse cx="98" cy="64" rx="26" ry="14" fill="#7A2916" transform="rotate(-8 98 64)"/>
      <path d="M76 70 Q98 80 124 70 Q120 78 100 80 Q80 78 76 70 Z" fill="#5A1810"/>
      <path d="M118 50 L122 44" stroke="#5A1810" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="124" cy="42" r="2" fill="#5A1810"/>
      <ellipse cx="86" cy="60" rx="9" ry="3" fill="#E4A547" opacity="0.3" transform="rotate(-12 86 60)"/>
    </g>
  );
}

function HatBaseball() {
  return (
    <g>
      <path d="M76 76 Q76 54 100 52 Q124 54 124 76 Z" fill="#1F4937"/>
      <path d="M88 76 Q90 56 100 52 M112 76 Q110 56 100 52" stroke="#15392C" strokeWidth="1" fill="none"/>
      <circle cx="100" cy="52" r="1.8" fill="#E4A547"/>
      <path d="M98 76 Q130 78 142 92 Q140 96 122 92 Q108 86 98 84 Z" fill="#15392C"/>
      <path d="M94 64 L106 64 L108 72 L92 72 Z" fill="#E4A547"/>
      <path d="M97 66 L103 66 M97 70 L103 70" stroke="#C48838" strokeWidth="1"/>
    </g>
  );
}

function HatPumpkin() {
  return (
    <g>
      <ellipse cx="100" cy="66" rx="26" ry="18" fill="#C0461C"/>
      <ellipse cx="90" cy="66" rx="9" ry="17" fill="#8E2F11"/>
      <ellipse cx="110" cy="66" rx="9" ry="17" fill="#8E2F11"/>
      <ellipse cx="100" cy="66" rx="6" ry="17" fill="#E4A547" opacity="0.35"/>
      <path d="M98 50 Q102 42 108 44" stroke="#1F4937" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M108 44 Q116 42 118 48 Q112 50 108 44 Z" fill="#1F4937"/>
      <ellipse cx="100" cy="82" rx="26" ry="3" fill="#000" opacity="0.12"/>
    </g>
  );
}

// ─── Face items ───────────────────────────────────────────────────────────────

function FaceAviators() {
  return (
    <g>
      <path d="M99 92 L101 92" stroke="#E4A547" strokeWidth="2" strokeLinecap="round"/>
      <path d="M83 90 Q83 86 92 86 Q102 86 101 90 Q100 102 92 102 Q84 102 83 90 Z" fill="#1A1612"/>
      <path d="M99 90 Q98 86 108 86 Q117 86 117 90 Q116 102 108 102 Q98 102 99 90 Z" fill="#1A1612"/>
      <path d="M85 88 Q92 85 100 87" stroke="#E4A547" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M100 87 Q108 85 115 88" stroke="#E4A547" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="88" cy="91" rx="2.5" ry="1.4" fill="#fff" opacity="0.55"/>
      <ellipse cx="104" cy="91" rx="2.5" ry="1.4" fill="#fff" opacity="0.55"/>
    </g>
  );
}

function FaceRoundGlasses() {
  return (
    <g>
      <circle cx="92" cy="96" r="7.5" fill="rgba(255,255,255,0.18)" stroke="#1A1612" strokeWidth="1.8"/>
      <circle cx="108" cy="96" r="7.5" fill="rgba(255,255,255,0.18)" stroke="#1A1612" strokeWidth="1.8"/>
      <path d="M99.5 96 L100.5 96" stroke="#1A1612" strokeWidth="2"/>
      <path d="M88 93 Q90 91 92 92" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M104 93 Q106 91 108 92" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7"/>
    </g>
  );
}

function FaceMonocle() {
  return (
    <g>
      <circle cx="108" cy="96" r="9" fill="rgba(255,255,255,0.22)" stroke="#E4A547" strokeWidth="2"/>
      <path d="M108 105 Q108 116 96 122" stroke="#E4A547" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M104 92 Q106 90 109 91" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.8"/>
    </g>
  );
}

function FaceEyePatch() {
  return (
    <g>
      <path d="M82 86 Q88 88 100 87" stroke="#1A1612" strokeWidth="1.4" fill="none"/>
      <path d="M100 87 Q108 86 118 88 L116 100 Q108 105 100 102 Q102 95 100 87 Z" fill="#1A1612"/>
      <path d="M114 90 L112 96" stroke="#3A2A1F" strokeWidth="1" fill="none"/>
    </g>
  );
}

function FaceStarShades() {
  return (
    <g>
      <path d="M99 94 L101 94" stroke="#C0461C" strokeWidth="2"/>
      <g transform="translate(92 95)">
        <path d="M0 -7 L2 -2 L7.5 -2 L3 1.5 L5 7 L0 3.5 L-5 7 L-3 1.5 L-7.5 -2 L-2 -2 Z" fill="#C0461C"/>
      </g>
      <g transform="translate(108 95)">
        <path d="M0 -7 L2 -2 L7.5 -2 L3 1.5 L5 7 L0 3.5 L-5 7 L-3 1.5 L-7.5 -2 L-2 -2 Z" fill="#C0461C"/>
      </g>
      <circle cx="90" cy="93" r="1.2" fill="#fff" opacity="0.7"/>
      <circle cx="106" cy="93" r="1.2" fill="#fff" opacity="0.7"/>
    </g>
  );
}

// ─── Neck items ───────────────────────────────────────────────────────────────

function NeckBowTie() {
  return (
    <g>
      <path d="M84 115 L84 127 L98 121 Z" fill="#7A2916"/>
      <path d="M116 115 L116 127 L102 121 Z" fill="#7A2916"/>
      <rect x="96" y="117" width="8" height="8" rx="1.5" fill="#5A1810"/>
      <circle cx="88" cy="119" r="1" fill="#E4A547"/>
      <circle cx="90" cy="123" r="1" fill="#E4A547"/>
      <circle cx="112" cy="119" r="1" fill="#E4A547"/>
      <circle cx="110" cy="123" r="1" fill="#E4A547"/>
    </g>
  );
}

function NeckScarf() {
  return (
    <g>
      <path d="M74 116 Q100 126 126 116 L126 124 Q100 134 74 124 Z" fill="#1F4937"/>
      <path d="M82 119 L82 130 M94 121 L94 132 M106 121 L106 132 M118 119 L118 130"
            stroke="#E4A547" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M118 124 L124 152 L114 152 L112 124 Z" fill="#1F4937"/>
      <path d="M114 152 L124 152" stroke="#E4A547" strokeWidth="2"/>
      <path d="M114 122 Q116 126 120 124" stroke="#15392C" strokeWidth="1" fill="none"/>
    </g>
  );
}

function NeckPearls() {
  return (
    <g>
      <path d="M80 120 Q100 134 120 120" stroke="#F4E3D5" strokeWidth="0.5" fill="none"/>
      {[80, 86, 92, 98, 104, 110, 116, 120].map((x, i) => {
        const y = 120 + Math.sin((i / 7) * Math.PI) * 12;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="2.2" fill="#F4E3D5"/>
            <circle cx={x - 0.6} cy={y - 0.6} r="0.7" fill="#fff" opacity="0.9"/>
          </g>
        );
      })}
      <path d="M100 136 L96 142 L100 148 L104 142 Z" fill="#E4A547"/>
      <circle cx="100" cy="142" r="1.8" fill="#C0461C"/>
    </g>
  );
}

// ─── Chest items ──────────────────────────────────────────────────────────────

function ChestSheriff() {
  return (
    <g transform="translate(100 142)">
      <path d="M0 -10 L2.4 -3 L10 -3 L4 1.6 L6.2 9.5 L0 4.8 L-6.2 9.5 L-4 1.6 L-10 -3 L-2.4 -3 Z"
            fill="#E4A547" stroke="#8B5A18" strokeWidth="0.8"/>
      <path d="M0 -10 L2.4 -3 L10 -3 L4 1.6 L6.2 9.5 L0 4.8 L-6.2 9.5 L-4 1.6 L-10 -3 L-2.4 -3 Z"
            fill="none" stroke="#FFD86B" strokeWidth="0.4" opacity="0.7"/>
      <circle cx="0" cy="0" r="1.6" fill="#8B5A18"/>
    </g>
  );
}

function ChestMedal() {
  return (
    <g>
      <path d="M92 116 L96 138 L100 134 L104 138 L108 116 Z" fill="#C0461C"/>
      <path d="M92 116 L100 134 M108 116 L100 134" stroke="#8E2F11" strokeWidth="0.6"/>
      <circle cx="100" cy="146" r="9" fill="#E4A547" stroke="#8B5A18" strokeWidth="1.2"/>
      <circle cx="100" cy="146" r="6" fill="none" stroke="#C48838" strokeWidth="0.8"/>
      <text x="100" y="150" textAnchor="middle" fill="#8B5A18" fontFamily="serif" fontWeight="700" fontSize="9">1</text>
    </g>
  );
}

// ─── Cape items ───────────────────────────────────────────────────────────────

function CapeHero() {
  return (
    <g>
      <path d="M66 110 Q100 102 134 110 L144 174 Q100 184 56 174 Z" fill="#C0461C"/>
      <path d="M66 110 Q100 102 134 110 L132 118 Q100 110 68 118 Z" fill="#E4A547"/>
      <path d="M78 124 L72 170 M100 122 L100 178 M122 124 L128 170"
            stroke="#8E2F11" strokeWidth="1.4" fill="none" opacity="0.6"/>
      <circle cx="84" cy="115" r="3" fill="#E4A547"/>
      <circle cx="116" cy="115" r="3" fill="#E4A547"/>
      <path d="M84 115 L116 115" stroke="#E4A547" strokeWidth="1.4"/>
    </g>
  );
}

function CapeWings() {
  return (
    <g>
      <path d="M62 116 Q40 124 30 156 Q56 152 76 132 Z" fill="#1F4937"/>
      <path d="M138 116 Q160 124 170 156 Q144 152 124 132 Z" fill="#1F4937"/>
      <path d="M50 132 Q40 140 36 150 M62 124 Q52 132 48 142" stroke="#15392C" strokeWidth="1" fill="none"/>
      <path d="M150 132 Q160 140 164 150 M138 124 Q148 132 152 142" stroke="#15392C" strokeWidth="1" fill="none"/>
      <path d="M58 124 Q48 134 42 148" stroke="#E4A547" strokeWidth="1" fill="none" opacity="0.6"/>
      <path d="M142 124 Q152 134 158 148" stroke="#E4A547" strokeWidth="1" fill="none" opacity="0.6"/>
    </g>
  );
}

// ─── Background items ─────────────────────────────────────────────────────────

function BgForest() {
  return (
    <g>
      <rect width="200" height="200" fill="#D5DFD4"/>
      <rect y="120" width="200" height="80" fill="#B6C9B0"/>
      <circle cx="156" cy="58" r="14" fill="#FBE9C4"/>
      {[20, 48, 168, 184].map((x, i) => (
        <g key={i} transform={`translate(${x} 0)`}>
          <rect x="-3" y="120" width="6" height="20" fill="#7A2916"/>
          <path d="M-16 124 L0 80 L16 124 Z" fill="#1F4937"/>
          <path d="M-13 110 L0 70 L13 110 Z" fill="#1F4937"/>
        </g>
      ))}
      <path d="M0 152 Q10 148 20 152 Q30 150 40 152" stroke="#1F4937" strokeWidth="1.5" fill="none"/>
      <path d="M160 152 Q170 148 180 152 Q190 150 200 152" stroke="#1F4937" strokeWidth="1.5" fill="none"/>
    </g>
  );
}

function BgSunset() {
  return (
    <g>
      <defs>
        <linearGradient id="sunset-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A2916"/>
          <stop offset="40%" stopColor="#C0461C"/>
          <stop offset="75%" stopColor="#E4A547"/>
          <stop offset="100%" stopColor="#FBE9C4"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#sunset-grad)"/>
      <circle cx="100" cy="130" r="28" fill="#FFD86B" opacity="0.95"/>
      <circle cx="100" cy="130" r="36" fill="#FFD86B" opacity="0.25"/>
      <rect y="150" width="200" height="50" fill="#7A2916" opacity="0.55"/>
      <path d="M30 60 Q34 56 38 60 Q42 56 46 60" stroke="#1A1612" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M150 80 Q154 76 158 80 Q162 76 166 80" stroke="#1A1612" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </g>
  );
}

function BgCosmic() {
  return (
    <g>
      <defs>
        <radialGradient id="cosmic-grad" cx="50%" cy="60%">
          <stop offset="0%" stopColor="#3A2D5C"/>
          <stop offset="60%" stopColor="#1F1838"/>
          <stop offset="100%" stopColor="#0F0A20"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#cosmic-grad)"/>
      {[[20,30],[38,18],[58,42],[170,28],[182,68],[160,12],[14,82],[12,140],[188,118],
        [176,160],[28,170],[80,16],[120,12],[44,68],[154,84]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.6 : 0.9} fill="#FFD86B" opacity={0.6 + (i % 3) * 0.15}/>
      ))}
      <g transform="translate(168 44)">
        <path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z" fill="#FFD86B"/>
      </g>
      <circle cx="34" cy="48" r="9" fill="#F4E3D5"/>
      <circle cx="38" cy="46" r="7" fill="#3A2D5C"/>
    </g>
  );
}

function BgGrid() {
  return (
    <g>
      <rect width="200" height="200" fill="#F4ECDD"/>
      <defs>
        <pattern id="bg-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#C0461C" opacity="0.35"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#bg-dots)"/>
    </g>
  );
}

function BgConfetti() {
  return (
    <g>
      <rect width="200" height="200" fill="#1F4937"/>
      {[[30,40,"#E4A547"],[60,20,"#FFD86B"],[100,52,"#C0461C"],[150,32,"#F4E3D5"],
        [180,72,"#E4A547"],[20,110,"#FFD86B"],[170,140,"#C0461C"],[40,160,"#F4E3D5"],
        [120,178,"#E4A547"],[80,100,"#FFD86B"],[140,108,"#F4E3D5"],[16,68,"#C0461C"]].map(([x,y,c],i) => (
        <rect key={i} x={x as number} y={y as number} width="6" height="2.5" rx="1" fill={c as string}
          transform={`rotate(${(i * 37) % 180} ${(x as number) + 3} ${(y as number) + 1})`}/>
      ))}
    </g>
  );
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const ITEM_RENDERERS: Record<string, React.FC> = {
  mortarboard: HatMortarboard,
  crown:       HatCrown,
  beanie:      HatBeanie,
  tophat:      HatTopHat,
  wizard:      HatWizard,
  beret:       HatBeret,
  baseball:    HatBaseball,
  pumpkin:     HatPumpkin,
  aviators:    FaceAviators,
  round:       FaceRoundGlasses,
  monocle:     FaceMonocle,
  eyepatch:    FaceEyePatch,
  starshades:  FaceStarShades,
  bowtie:      NeckBowTie,
  scarf:       NeckScarf,
  pearls:      NeckPearls,
  sheriff:     ChestSheriff,
  medal:       ChestMedal,
  cape:        CapeHero,
  wings:       CapeWings,
  forest:      BgForest,
  sunset:      BgSunset,
  cosmic:      BgCosmic,
  dots:        BgGrid,
  confetti:    BgConfetti,
};

// ─── ItemLayer ────────────────────────────────────────────────────────────────

export function ItemLayer({ id, translate }: { id: string; translate?: SlotOffset }) {
  const Render = ITEM_RENDERERS[id];
  if (!Render) return null;
  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
    >
      <g transform={translate ? `translate(${translate.x} ${translate.y})` : undefined}>
        <Render />
      </g>
    </svg>
  );
}
