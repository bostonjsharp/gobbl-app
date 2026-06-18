// Harvest — shop items + avatar composer.
// All items are SVG rendered into the same 200×200 viewBox as FlatTurkey so
// they snap to the right anchor on the turkey's anatomy (Tom/Gobbler posture):
//   head circle   → (100, 96) r=22    →  top of head ≈ y=74
//   eyes          → (92, 96) and (108, 96)
//   beak tip      → (100, 114)
//   body          → (100, 132) rx=34 ry=30
//   chest centre  → (100, 142)
//
// Items render as children of an absolute SVG layer pinned over (or under) the
// turkey, so they composite without resizing math.

const FT = window.FlatTurkey;

// Slot z-order: background → cape → turkey → hat → face → neck/chest
const SLOT_ORDER = ['background', 'cape', 'turkey', 'hat', 'face', 'neck', 'chest'];

// -----------------------------------------------------------------------------
// HAT items — sit on top of the head, anchored around (100, 70).
// -----------------------------------------------------------------------------

const HatMortarboard = () => (
  <g>
    {/* Crown band */}
    <rect x="80" y="62" width="40" height="14" rx="2" fill="#1A1612"/>
    <rect x="80" y="72" width="40" height="4" fill="#2A2620"/>
    {/* Board (rhombus for perspective) */}
    <path d="M62 62 L100 50 L138 62 L100 72 Z" fill="#1A1612"/>
    <path d="M62 62 L100 72 L138 62" stroke="#2A2620" strokeWidth="0.8" fill="none"/>
    {/* Button */}
    <circle cx="100" cy="61" r="2.5" fill="#E4A547"/>
    {/* Tassel */}
    <path d="M100 61 Q120 70 132 84" stroke="#E4A547" strokeWidth="1.4" fill="none"/>
    <ellipse cx="133" cy="86" rx="3" ry="5" fill="#E4A547"/>
    <ellipse cx="133" cy="86" rx="2" ry="3.5" fill="#C48838"/>
  </g>
);

const HatCrown = () => (
  <g>
    {/* Zigzag peaks */}
    <path d="M76 76 L82 60 L92 72 L100 54 L108 72 L118 60 L124 76 Z" fill="#E4A547"/>
    {/* Band */}
    <rect x="76" y="74" width="48" height="6" fill="#C48838"/>
    {/* Gems */}
    <circle cx="84" cy="68" r="1.8" fill="#1F4937"/>
    <circle cx="100" cy="62" r="2.2" fill="#C0461C"/>
    <circle cx="116" cy="68" r="1.8" fill="#1F4937"/>
    {/* Highlight */}
    <path d="M80 76 L84 66" stroke="#FFD86B" strokeWidth="1.2" strokeLinecap="round" opacity="0.9"/>
  </g>
);

const HatBeanie = () => (
  <g>
    {/* Dome */}
    <path d="M76 78 Q76 52 100 50 Q124 52 124 78 Z" fill="#7A2916"/>
    {/* Knit ridges */}
    <path d="M82 78 L83 60 M92 78 L93 55 M100 78 L100 53 M108 78 L107 55 M118 78 L117 60"
          stroke="#5A1810" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    {/* Cuff */}
    <rect x="74" y="74" width="52" height="8" rx="2" fill="#E4A547"/>
    <path d="M74 78 L126 78" stroke="#C48838" strokeWidth="0.8"/>
    {/* Pom */}
    <circle cx="100" cy="46" r="6" fill="#F4E3D5"/>
    <circle cx="98" cy="44" r="2" fill="#fff" opacity="0.7"/>
  </g>
);

const HatTopHat = () => (
  <g>
    {/* Brim */}
    <ellipse cx="100" cy="76" rx="34" ry="4.5" fill="#1A1612"/>
    {/* Body */}
    <path d="M82 76 L82 46 Q82 42 86 42 L114 42 Q118 42 118 46 L118 76 Z" fill="#1A1612"/>
    {/* Top sheen */}
    <ellipse cx="100" cy="44" rx="16" ry="2.5" fill="#2A2620"/>
    {/* Band */}
    <rect x="82" y="66" width="36" height="6" fill="#C0461C"/>
    {/* Side highlight */}
    <rect x="86" y="46" width="2" height="22" fill="#3A2A1F" opacity="0.7"/>
  </g>
);

const HatWizard = () => (
  <g>
    {/* Brim */}
    <ellipse cx="100" cy="78" rx="36" ry="5" fill="#1F4937"/>
    {/* Cone (slightly tilted) */}
    <path d="M80 78 Q92 78 102 30 Q118 78 120 78 Z" fill="#1F4937"/>
    <path d="M80 78 Q92 78 102 30" stroke="#15392C" strokeWidth="0.8" fill="none"/>
    {/* Band */}
    <path d="M84 76 Q100 80 116 76 L114 70 Q100 74 86 70 Z" fill="#E4A547"/>
    {/* Stars */}
    <circle cx="98" cy="60" r="1.6" fill="#FFD86B"/>
    <circle cx="106" cy="52" r="1.2" fill="#FFD86B"/>
    <circle cx="100" cy="42" r="1" fill="#FFD86B"/>
    <path d="M93 67 L94 65 L95 67 L94 69 Z" fill="#FFD86B"/>
  </g>
);

const HatBeret = () => (
  <g>
    {/* Soft tilted disc */}
    <ellipse cx="98" cy="64" rx="26" ry="14" fill="#7A2916" transform="rotate(-8 98 64)"/>
    {/* Lower lip */}
    <path d="M76 70 Q98 80 124 70 Q120 78 100 80 Q80 78 76 70 Z" fill="#5A1810"/>
    {/* Stem */}
    <path d="M118 50 L122 44" stroke="#5A1810" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="124" cy="42" r="2" fill="#5A1810"/>
    {/* Highlight */}
    <ellipse cx="86" cy="60" rx="9" ry="3" fill="#E4A547" opacity="0.3" transform="rotate(-12 86 60)"/>
  </g>
);

const HatBaseball = () => (
  <g>
    {/* Crown */}
    <path d="M76 76 Q76 54 100 52 Q124 54 124 76 Z" fill="#1F4937"/>
    {/* Panels */}
    <path d="M88 76 Q90 56 100 52 M112 76 Q110 56 100 52" stroke="#15392C" strokeWidth="1" fill="none"/>
    {/* Button */}
    <circle cx="100" cy="52" r="1.8" fill="#E4A547"/>
    {/* Brim */}
    <path d="M98 76 Q130 78 142 92 Q140 96 122 92 Q108 86 98 84 Z" fill="#15392C"/>
    {/* Front patch */}
    <path d="M94 64 L106 64 L108 72 L92 72 Z" fill="#E4A547"/>
    <path d="M97 66 L103 66 M97 70 L103 70" stroke="#C48838" strokeWidth="1"/>
  </g>
);

const HatPumpkin = () => (
  <g>
    {/* Pumpkin body as hat */}
    <ellipse cx="100" cy="66" rx="26" ry="18" fill="#C0461C"/>
    <ellipse cx="90" cy="66" rx="9" ry="17" fill="#8E2F11"/>
    <ellipse cx="110" cy="66" rx="9" ry="17" fill="#8E2F11"/>
    <ellipse cx="100" cy="66" rx="6" ry="17" fill="#E4A547" opacity="0.35"/>
    {/* Stem */}
    <path d="M98 50 Q102 42 108 44" stroke="#1F4937" strokeWidth="3" strokeLinecap="round" fill="none"/>
    {/* Leaf */}
    <path d="M108 44 Q116 42 118 48 Q112 50 108 44 Z" fill="#1F4937"/>
    {/* Brim shadow on head */}
    <ellipse cx="100" cy="82" rx="26" ry="3" fill="#000" opacity="0.12"/>
  </g>
);

// -----------------------------------------------------------------------------
// FACE items — over the eyes (around y=96).
// -----------------------------------------------------------------------------

const FaceAviators = () => (
  <g>
    {/* Bridge */}
    <path d="M99 92 L101 92" stroke="#E4A547" strokeWidth="2" strokeLinecap="round"/>
    {/* Left teardrop */}
    <path d="M83 90 Q83 86 92 86 Q102 86 101 90 Q100 102 92 102 Q84 102 83 90 Z" fill="#1A1612"/>
    {/* Right teardrop */}
    <path d="M99 90 Q98 86 108 86 Q117 86 117 90 Q116 102 108 102 Q98 102 99 90 Z" fill="#1A1612"/>
    {/* Frame highlight */}
    <path d="M85 88 Q92 85 100 87" stroke="#E4A547" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M100 87 Q108 85 115 88" stroke="#E4A547" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    {/* Lens glints */}
    <ellipse cx="88" cy="91" rx="2.5" ry="1.4" fill="#fff" opacity="0.55"/>
    <ellipse cx="104" cy="91" rx="2.5" ry="1.4" fill="#fff" opacity="0.55"/>
  </g>
);

const FaceRoundGlasses = () => (
  <g>
    <circle cx="92" cy="96" r="7.5" fill="rgba(255,255,255,0.18)" stroke="#1A1612" strokeWidth="1.8"/>
    <circle cx="108" cy="96" r="7.5" fill="rgba(255,255,255,0.18)" stroke="#1A1612" strokeWidth="1.8"/>
    <path d="M99.5 96 L100.5 96" stroke="#1A1612" strokeWidth="2"/>
    {/* Glints */}
    <path d="M88 93 Q90 91 92 92" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7"/>
    <path d="M104 93 Q106 91 108 92" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7"/>
  </g>
);

const FaceMonocle = () => (
  <g>
    <circle cx="108" cy="96" r="9" fill="rgba(255,255,255,0.22)" stroke="#E4A547" strokeWidth="2"/>
    <path d="M108 105 Q108 116 96 122" stroke="#E4A547" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
    <path d="M104 92 Q106 90 109 91" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.8"/>
  </g>
);

const FaceEyePatch = () => (
  <g>
    <path d="M82 86 Q88 88 100 87" stroke="#1A1612" strokeWidth="1.4" fill="none"/>
    <path d="M100 87 Q108 86 118 88 L116 100 Q108 105 100 102 Q102 95 100 87 Z" fill="#1A1612"/>
    <path d="M114 90 L112 96" stroke="#3A2A1F" strokeWidth="1" fill="none"/>
  </g>
);

const FaceStarShades = () => (
  <g>
    {/* Bridge */}
    <path d="M99 94 L101 94" stroke="#C0461C" strokeWidth="2"/>
    {/* Two star-shaped lenses */}
    <g transform="translate(92 95)">
      <path d="M0 -7 L2 -2 L7.5 -2 L3 1.5 L5 7 L0 3.5 L-5 7 L-3 1.5 L-7.5 -2 L-2 -2 Z" fill="#C0461C"/>
    </g>
    <g transform="translate(108 95)">
      <path d="M0 -7 L2 -2 L7.5 -2 L3 1.5 L5 7 L0 3.5 L-5 7 L-3 1.5 L-7.5 -2 L-2 -2 Z" fill="#C0461C"/>
    </g>
    {/* Glints */}
    <circle cx="90" cy="93" r="1.2" fill="#fff" opacity="0.7"/>
    <circle cx="106" cy="93" r="1.2" fill="#fff" opacity="0.7"/>
  </g>
);

// -----------------------------------------------------------------------------
// NECK items — at the body/head junction (~y=118).
// CHEST items — on the body (~y=142).
// -----------------------------------------------------------------------------

const NeckBowTie = () => (
  <g>
    {/* Left wing */}
    <path d="M84 115 L84 127 L98 121 Z" fill="#7A2916"/>
    {/* Right wing */}
    <path d="M116 115 L116 127 L102 121 Z" fill="#7A2916"/>
    {/* Knot */}
    <rect x="96" y="117" width="8" height="8" rx="1.5" fill="#5A1810"/>
    {/* Polka dots */}
    <circle cx="88" cy="119" r="1" fill="#E4A547"/>
    <circle cx="90" cy="123" r="1" fill="#E4A547"/>
    <circle cx="112" cy="119" r="1" fill="#E4A547"/>
    <circle cx="110" cy="123" r="1" fill="#E4A547"/>
  </g>
);

const NeckScarf = () => (
  <g>
    {/* Wrap */}
    <path d="M74 116 Q100 126 126 116 L126 124 Q100 134 74 124 Z" fill="#1F4937"/>
    {/* Stripes */}
    <path d="M82 119 L82 130 M94 121 L94 132 M106 121 L106 132 M118 119 L118 130"
          stroke="#E4A547" strokeWidth="2.2" strokeLinecap="round"/>
    {/* Hanging tail */}
    <path d="M118 124 L124 152 L114 152 L112 124 Z" fill="#1F4937"/>
    <path d="M114 152 L124 152" stroke="#E4A547" strokeWidth="2"/>
    {/* Knot fold */}
    <path d="M114 122 Q116 126 120 124" stroke="#15392C" strokeWidth="1" fill="none"/>
  </g>
);

const NeckPearls = () => (
  <g>
    {/* String of pearls */}
    <path d="M80 120 Q100 134 120 120" stroke="#F4E3D5" strokeWidth="0.5" fill="none"/>
    {[80,86,92,98,104,110,116,120].map((x,i) => {
      const y = 120 + Math.sin((i / 7) * Math.PI) * 12;
      return <g key={i}>
        <circle cx={x} cy={y} r="2.2" fill="#F4E3D5"/>
        <circle cx={x - 0.6} cy={y - 0.6} r="0.7" fill="#fff" opacity="0.9"/>
      </g>;
    })}
    {/* Centerpiece pendant */}
    <path d="M100 136 L96 142 L100 148 L104 142 Z" fill="#E4A547"/>
    <circle cx="100" cy="142" r="1.8" fill="#C0461C"/>
  </g>
);

const ChestSheriff = () => (
  <g transform="translate(100 142)">
    {/* 5-point star */}
    <path d="M0 -10 L2.4 -3 L10 -3 L4 1.6 L6.2 9.5 L0 4.8 L-6.2 9.5 L-4 1.6 L-10 -3 L-2.4 -3 Z"
          fill="#E4A547" stroke="#8B5A18" strokeWidth="0.8"/>
    <path d="M0 -10 L2.4 -3 L10 -3 L4 1.6 L6.2 9.5 L0 4.8 L-6.2 9.5 L-4 1.6 L-10 -3 L-2.4 -3 Z"
          fill="none" stroke="#FFD86B" strokeWidth="0.4" opacity="0.7"/>
    <circle cx="0" cy="0" r="1.6" fill="#8B5A18"/>
  </g>
);

const ChestMedal = () => (
  <g>
    {/* Ribbon */}
    <path d="M92 116 L96 138 L100 134 L104 138 L108 116 Z" fill="#C0461C"/>
    <path d="M92 116 L100 134 M108 116 L100 134" stroke="#8E2F11" strokeWidth="0.6"/>
    {/* Medal disc */}
    <circle cx="100" cy="146" r="9" fill="#E4A547" stroke="#8B5A18" strokeWidth="1.2"/>
    <circle cx="100" cy="146" r="6" fill="none" stroke="#C48838" strokeWidth="0.8"/>
    <text x="100" y="150" textAnchor="middle" fill="#8B5A18" fontFamily="serif" fontWeight="700" fontSize="9">1</text>
  </g>
);

// -----------------------------------------------------------------------------
// CAPE — behind the body.
// -----------------------------------------------------------------------------

const CapeHero = () => (
  <g>
    {/* Cape body */}
    <path d="M66 110 Q100 102 134 110 L144 174 Q100 184 56 174 Z" fill="#C0461C"/>
    {/* Inner lining peeking */}
    <path d="M66 110 Q100 102 134 110 L132 118 Q100 110 68 118 Z" fill="#E4A547"/>
    {/* Folds */}
    <path d="M78 124 L72 170 M100 122 L100 178 M122 124 L128 170"
          stroke="#8E2F11" strokeWidth="1.4" fill="none" opacity="0.6"/>
    {/* Clasp */}
    <circle cx="84" cy="115" r="3" fill="#E4A547"/>
    <circle cx="116" cy="115" r="3" fill="#E4A547"/>
    <path d="M84 115 L116 115" stroke="#E4A547" strokeWidth="1.4"/>
  </g>
);

const CapeWings = () => (
  <g>
    {/* Two feathered wings sweeping out from back */}
    <path d="M62 116 Q40 124 30 156 Q56 152 76 132 Z" fill="#1F4937"/>
    <path d="M138 116 Q160 124 170 156 Q144 152 124 132 Z" fill="#1F4937"/>
    {/* Feather lines */}
    <path d="M50 132 Q40 140 36 150 M62 124 Q52 132 48 142" stroke="#15392C" strokeWidth="1" fill="none"/>
    <path d="M150 132 Q160 140 164 150 M138 124 Q148 132 152 142" stroke="#15392C" strokeWidth="1" fill="none"/>
    {/* Highlights */}
    <path d="M58 124 Q48 134 42 148" stroke="#E4A547" strokeWidth="1" fill="none" opacity="0.6"/>
    <path d="M142 124 Q152 134 158 148" stroke="#E4A547" strokeWidth="1" fill="none" opacity="0.6"/>
  </g>
);

// -----------------------------------------------------------------------------
// BACKGROUNDS — full panels behind the avatar.
// -----------------------------------------------------------------------------

const BgForest = () => (
  <g>
    <rect width="200" height="200" fill="#D5DFD4"/>
    <rect y="120" width="200" height="80" fill="#B6C9B0"/>
    {/* Sun */}
    <circle cx="156" cy="58" r="14" fill="#FBE9C4"/>
    {/* Trees */}
    {[20, 48, 168, 184].map((x, i) => (
      <g key={i} transform={`translate(${x} 0)`}>
        <rect x="-3" y="120" width="6" height="20" fill="#7A2916"/>
        <path d="M-16 124 L0 80 L16 124 Z" fill="#1F4937"/>
        <path d="M-13 110 L0 70 L13 110 Z" fill="#1F4937"/>
      </g>
    ))}
    {/* Ground tufts */}
    <path d="M0 152 Q10 148 20 152 Q30 150 40 152" stroke="#1F4937" strokeWidth="1.5" fill="none"/>
    <path d="M160 152 Q170 148 180 152 Q190 150 200 152" stroke="#1F4937" strokeWidth="1.5" fill="none"/>
  </g>
);

const BgSunset = () => (
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
    {/* Sun */}
    <circle cx="100" cy="130" r="28" fill="#FFD86B" opacity="0.95"/>
    <circle cx="100" cy="130" r="36" fill="#FFD86B" opacity="0.25"/>
    {/* Horizon */}
    <rect y="150" width="200" height="50" fill="#7A2916" opacity="0.55"/>
    {/* Birds */}
    <path d="M30 60 Q34 56 38 60 Q42 56 46 60" stroke="#1A1612" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <path d="M150 80 Q154 76 158 80 Q162 76 166 80" stroke="#1A1612" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
  </g>
);

const BgCosmic = () => (
  <g>
    <defs>
      <radialGradient id="cosmic-grad" cx="50%" cy="60%">
        <stop offset="0%" stopColor="#3A2D5C"/>
        <stop offset="60%" stopColor="#1F1838"/>
        <stop offset="100%" stopColor="#0F0A20"/>
      </radialGradient>
    </defs>
    <rect width="200" height="200" fill="url(#cosmic-grad)"/>
    {/* Stars */}
    {[[20,30],[38,18],[58,42],[170,28],[182,68],[160,12],[14,82],[12,140],[188,118],
      [176,160],[28,170],[80,16],[120,12],[44,68],[154,84]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.6 : 0.9} fill="#FFD86B" opacity={0.6 + (i%3)*0.15}/>
    ))}
    {/* Sparkle */}
    <g transform="translate(168 44)">
      <path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z" fill="#FFD86B"/>
    </g>
    {/* Moon */}
    <circle cx="34" cy="48" r="9" fill="#F4E3D5"/>
    <circle cx="38" cy="46" r="7" fill="#3A2D5C"/>
  </g>
);

const BgGrid = () => (
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

const BgConfetti = () => (
  <g>
    <rect width="200" height="200" fill="#1F4937"/>
    {[[30,40,'#E4A547'],[60,20,'#FFD86B'],[100,52,'#C0461C'],[150,32,'#F4E3D5'],
      [180,72,'#E4A547'],[20,110,'#FFD86B'],[170,140,'#C0461C'],[40,160,'#F4E3D5'],
      [120,178,'#E4A547'],[80,100,'#FFD86B'],[140,108,'#F4E3D5'],[16,68,'#C0461C']].map(([x,y,c],i) => (
      <rect key={i} x={x} y={y} width="6" height="2.5" rx="1" fill={c} transform={`rotate(${(i*37)%180} ${x+3} ${y+1})`}/>
    ))}
  </g>
);

// -----------------------------------------------------------------------------
// Item registry.
// -----------------------------------------------------------------------------

const ITEM_RENDERERS = {
  // Hats
  mortarboard: HatMortarboard,
  crown:       HatCrown,
  beanie:      HatBeanie,
  tophat:      HatTopHat,
  wizard:      HatWizard,
  beret:       HatBeret,
  baseball:    HatBaseball,
  pumpkin:     HatPumpkin,
  // Faces
  aviators:    FaceAviators,
  round:       FaceRoundGlasses,
  monocle:     FaceMonocle,
  eyepatch:    FaceEyePatch,
  starshades:  FaceStarShades,
  // Neck/Chest
  bowtie:      NeckBowTie,
  scarf:       NeckScarf,
  pearls:      NeckPearls,
  sheriff:     ChestSheriff,
  medal:       ChestMedal,
  // Capes
  cape:        CapeHero,
  wings:       CapeWings,
  // Backgrounds
  forest:      BgForest,
  sunset:      BgSunset,
  cosmic:      BgCosmic,
  dots:        BgGrid,
  confetti:    BgConfetti,
};

const SHOP_ITEMS = [
  // ----- Hats -----
  { id: 'mortarboard', name: 'Scholar Cap',     type: 'Hat',   slot: 'hat',  cost: 250,  accent: '#1F4937', accentBg: '#D5DFD4' },
  { id: 'crown',       name: 'Tiny Crown',      type: 'Hat',   slot: 'hat',  cost: 800,  accent: '#E4A547', accentBg: '#FBE9C4', isNew: true },
  { id: 'beanie',      name: 'Knit Beanie',     type: 'Hat',   slot: 'hat',  cost: 180,  accent: '#7A2916', accentBg: '#F4D9CC' },
  { id: 'tophat',      name: 'Top Hat',         type: 'Hat',   slot: 'hat',  cost: 420,  accent: '#1A1612', accentBg: '#E8DDC6' },
  { id: 'wizard',      name: 'Wizard Hat',      type: 'Hat',   slot: 'hat',  cost: 650,  accent: '#1F4937', accentBg: '#D5DFD4' },
  { id: 'beret',       name: 'Painter Beret',   type: 'Hat',   slot: 'hat',  cost: 220,  accent: '#7A2916', accentBg: '#F4E3D5' },
  { id: 'baseball',    name: 'Ball Cap',        type: 'Hat',   slot: 'hat',  cost: 200,  accent: '#1F4937', accentBg: '#D5DFD4' },
  { id: 'pumpkin',     name: 'Pumpkin Lid',     type: 'Hat',   slot: 'hat',  cost: 320,  accent: '#C0461C', accentBg: '#FBE9C4', isNew: true },

  // ----- Face -----
  { id: 'aviators',    name: 'Aviators',        type: 'Face',  slot: 'face', cost: 180,  accent: '#1A1612', accentBg: '#F4D9CC' },
  { id: 'round',       name: 'Wire Frames',     type: 'Face',  slot: 'face', cost: 160,  accent: '#1A1612', accentBg: '#D5DFD4' },
  { id: 'monocle',     name: 'Gold Monocle',    type: 'Face',  slot: 'face', cost: 380,  accent: '#E4A547', accentBg: '#FBE9C4' },
  { id: 'eyepatch',    name: 'Eye Patch',       type: 'Face',  slot: 'face', cost: 240,  accent: '#1A1612', accentBg: '#E8DDC6' },
  { id: 'starshades',  name: 'Star Shades',     type: 'Face',  slot: 'face', cost: 300,  accent: '#C0461C', accentBg: '#F4D9CC' },

  // ----- Looks -----
  { id: 'bowtie',      name: 'Bow Tie',         type: 'Look',  slot: 'neck', cost: 220,  accent: '#7A2916', accentBg: '#F4D9CC' },
  { id: 'scarf',       name: 'Striped Scarf',   type: 'Look',  slot: 'neck', cost: 340,  accent: '#1F4937', accentBg: '#D5DFD4' },
  { id: 'pearls',      name: 'Pearl Necklace',  type: 'Look',  slot: 'neck', cost: 540,  accent: '#F4E3D5', accentBg: '#FBE9C4' },
  { id: 'sheriff',     name: 'Sheriff Star',    type: 'Look',  slot: 'chest',cost: 280,  accent: '#E4A547', accentBg: '#FBE9C4' },
  { id: 'medal',       name: 'Gold Medal',      type: 'Look',  slot: 'chest',cost: 460,  accent: '#E4A547', accentBg: '#FBE9C4' },

  // ----- Capes -----
  { id: 'cape',        name: 'Hero Cape',       type: 'Look',  slot: 'cape', cost: 520,  accent: '#C0461C', accentBg: '#F4D9CC' },
  { id: 'wings',       name: 'Spirit Wings',    type: 'Look',  slot: 'cape', cost: 900,  accent: '#1F4937', accentBg: '#D5DFD4', unlockAt: 6 },

  // ----- Backgrounds -----
  { id: 'forest',      name: 'Forest Glade',    type: 'Bg',    slot: 'background', cost: 600,  accent: '#1F4937', accentBg: '#D5DFD4' },
  { id: 'sunset',      name: 'Sunset Glow',     type: 'Bg',    slot: 'background', cost: 700,  accent: '#C0461C', accentBg: '#FCE2C0' },
  { id: 'cosmic',      name: 'Cosmic Drift',    type: 'Bg',    slot: 'background', cost: 1200, accent: '#3A2D5C', accentBg: '#2A2440', unlockAt: 6 },
  { id: 'dots',        name: 'Polka Dots',      type: 'Bg',    slot: 'background', cost: 240,  accent: '#C0461C', accentBg: '#F4ECDD' },
  { id: 'confetti',    name: 'Confetti Party',  type: 'Bg',    slot: 'background', cost: 380,  accent: '#1F4937', accentBg: '#1F4937', isNew: true },
];

const ITEMS_BY_ID = Object.fromEntries(SHOP_ITEMS.map(it => [it.id, it]));

// -----------------------------------------------------------------------------
// Composer: turkey + equipped items, all anchored in the same 200×200 space.
// -----------------------------------------------------------------------------

function ItemLayer({ id }) {
  const Render = ITEM_RENDERERS[id];
  if (!Render) return null;
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      <Render/>
    </svg>
  );
}

function AvatarWithItems({ stage = 5, palette, equipped = {}, size = 140, showShadow = true }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Background fills behind everything (clipped to a soft squircle) */}
      {equipped.background && (
        <div style={{ position: 'absolute', inset: 0, borderRadius: '32%', overflow: 'hidden' }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            {React.createElement(ITEM_RENDERERS[equipped.background])}
          </svg>
        </div>
      )}
      {/* Soft ground shadow */}
      {showShadow && (
        <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <ellipse cx="100" cy="184" rx="42" ry="5" fill="#1A1612" opacity="0.18"/>
        </svg>
      )}
      {/* Cape (behind turkey) */}
      {equipped.cape && <ItemLayer id={equipped.cape}/>}
      {/* Turkey */}
      <FT stage={stage} palette={palette} size={size} style={{ position: 'absolute', inset: 0 }}/>
      {/* Hat over head */}
      {equipped.hat   && <ItemLayer id={equipped.hat}/>}
      {/* Face over eyes */}
      {equipped.face  && <ItemLayer id={equipped.face}/>}
      {/* Neck + chest */}
      {equipped.neck  && <ItemLayer id={equipped.neck}/>}
      {equipped.chest && <ItemLayer id={equipped.chest}/>}
    </div>
  );
}

// Small product-shot for shop cards: turkey + only this one item, centered.
function ItemProductShot({ itemId, palette, size = 120 }) {
  const item = ITEMS_BY_ID[itemId];
  if (!item) return null;
  // Backgrounds show full-bleed; everything else shows on a mini turkey.
  if (item.slot === 'background') {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          {React.createElement(ITEM_RENDERERS[itemId])}
        </svg>
      </div>
    );
  }
  return (
    <AvatarWithItems
      stage={5}
      palette={palette}
      equipped={{ [item.slot]: item.id }}
      size={size}
      showShadow={false}
    />
  );
}

window.SHOP_ITEMS = SHOP_ITEMS;
window.ITEMS_BY_ID = ITEMS_BY_ID;
window.ITEM_RENDERERS = ITEM_RENDERERS;
window.AvatarWithItems = AvatarWithItems;
window.ItemProductShot = ItemProductShot;
