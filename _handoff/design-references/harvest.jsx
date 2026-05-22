// Direction 1 — HARVEST
// Elevated warm. Bricolage Grotesque + DM Sans + JetBrains Mono.
// Confident terracotta, forest accent, generous whitespace, grown-up gamification.

// Use the flat illustrated turkey set (Headspace-y) instead of the geometric one.
const TurkeyMark = window.FlatTurkey;
const TurkeyGlyph = window.FlatTurkeyGlyph;

const HARVEST = {
  bg:        '#F4ECDD',     // warm cream
  surface:   '#FFFFFF',
  ink:       '#1A1612',     // near-black with warmth
  inkSoft:   '#5C4A3A',
  inkMuted:  '#8C7660',
  line:      '#E8DDC6',
  primary:   '#C0461C',     // confident terracotta
  primarySoft:'#F4E3D5',
  forest:    '#1F4937',     // deep forest accent
  forestSoft:'#D5DFD4',
  ochre:     '#E4A547',     // ochre
  ochreSoft: '#FBE9C4',
  rust:      '#7A2916',
};

const harvestPal = {
  // Flat illustration palette
  body:     HARVEST.primary,
  bodyDark: '#8E2F11',
  belly:    HARVEST.ochre,
  fan1:     HARVEST.ochre,
  fan2:     HARVEST.primary,
  fan3:     HARVEST.rust,
  fan4:     HARVEST.forest,
  beak:     '#F5B73D',
  wattle:   '#B82914',
  eye:      HARVEST.ink,
  white:    '#FFFFFF',
  egg:      '#F2E1CC',
  speck:    HARVEST.primary,
  feet:     HARVEST.rust,
  crown:    HARVEST.ochre,
  spark:    '#FFD86B',
  // Legacy fields (no longer used but harmless)
  bg: HARVEST.primarySoft,
  accent: HARVEST.forest,
  rim: 'rgba(0,0,0,0.05)',
};

const harvestText = {
  display: { fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 96, "wght" 700' },
  body:    { fontFamily: "'DM Sans', sans-serif" },
  mono:    { fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em' },
};

// ── Shared bits ──────────────────────────────────────────────────────────
function HStatusBar({ time = '9:41', dark = false }) {
  const c = dark ? '#fff' : HARVEST.ink;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px 6px', color: c, ...harvestText.body, fontSize: 15, fontWeight: 600 }}>
      <span style={{ ...harvestText.mono, fontWeight: 500 }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 12 }}>●●●●</span>
        <span style={{ display: 'inline-block', width: 22, height: 11, border: `1.5px solid ${c}`, borderRadius: 3, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1, background: c, width: '78%', borderRadius: 1 }} />
        </span>
      </div>
    </div>
  );
}

function HBottomNav({ active = 'home', dark = false }) {
  const items = [
    { id: 'home',  label: 'Home',  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-7h-6v7H5a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { id: 'chat',  label: 'Debate', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3h-3l-4 4v-4H7a3 3 0 01-3-3V6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { id: 'skills',label: 'Skills',icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { id: 'shop',  label: 'Shop',  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 8h14l-1.2 12a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
    { id: 'me',    label: 'You',   icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  ];
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 16px 24px', background: dark ? '#1A1612' : HARVEST.bg, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : HARVEST.line}`, display: 'flex', justifyContent: 'space-between', gap: 4 }}>
      {items.map(i => {
        const isActive = i.id === active;
        return (
          <div key={i.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 4px', color: isActive ? HARVEST.primary : HARVEST.inkMuted, ...harvestText.body }}>
            <div style={{ background: isActive ? HARVEST.primarySoft : 'transparent', borderRadius: 999, padding: '4px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {i.icon}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.03em' }}>{i.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── DASHBOARD · MOBILE ───────────────────────────────────────────────────
function HarvestDashboardMobile() {
  return (
    <div style={{ width: 390, height: 844, background: HARVEST.bg, position: 'relative', overflow: 'hidden', color: HARVEST.ink }}>
      <HStatusBar />

      {/* Top app bar */}
      <div style={{ padding: '8px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 999, background: HARVEST.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', ...harvestText.display, fontSize: 16, fontWeight: 700 }}>S</div>
          <div>
            <div style={{ fontSize: 11, color: HARVEST.inkMuted, ...harvestText.mono, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tuesday</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Hey, Sam</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, padding: '7px 12px', borderRadius: 999 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 3c-7 0-11 5-12 9-1 4 0 8 0 9h2c0-3 1-7 3-10s5-5 7-8z" fill={HARVEST.ochre}/></svg>
          <span style={{ ...harvestText.mono, fontWeight: 600, fontSize: 13 }}>1,250</span>
        </div>
      </div>

      <div className="ab-scroll" style={{ position: 'absolute', top: 96, bottom: 88, left: 0, right: 0, overflowY: 'auto', padding: '0 22px' }}>
        {/* Headline */}
        <div style={{ paddingTop: 18, paddingBottom: 18 }}>
          <h1 style={{ ...harvestText.display, fontSize: 38, lineHeight: '0.95', margin: 0, color: HARVEST.ink, letterSpacing: '-0.035em' }}>
            Ready to<br/>talk turkey?
          </h1>
          <p style={{ ...harvestText.body, fontSize: 14, color: HARVEST.inkSoft, marginTop: 12, lineHeight: 1.45 }}>
            One conversation a day. The Flock's already gathering.
          </p>
        </div>

        {/* HERO: turkey + level */}
        <div style={{ background: HARVEST.surface, borderRadius: 28, padding: 22, position: 'relative', overflow: 'hidden', boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 8px 24px rgba(122,41,22,0.06)', border: `1px solid ${HARVEST.line}` }}>
          {/* Bg shape */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: 999, background: HARVEST.ochreSoft, opacity: 0.6 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, position: 'relative' }}>
            <TurkeyMark stage={5} palette={harvestPal} size={120} />
            <div style={{ flex: 1 }}>
              <div style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Level 5 · Tom</div>
              <div style={{ ...harvestText.display, fontSize: 22, lineHeight: 1.05, marginTop: 4, fontWeight: 700, letterSpacing: '-0.02em' }}>Strutting<br/>nicely.</div>
              <div style={{ marginTop: 14 }}>
                <div style={{ height: 8, background: HARVEST.primarySoft, borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, width: '68%', background: HARVEST.primary, borderRadius: 999 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted }}>340 / 500 XP</span>
                  <span style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.primary, fontWeight: 600 }}>+160 to Gobbler</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
          {[
            { label: 'Civility', value: '87', unit: '/100', tone: HARVEST.forest, accent: HARVEST.forestSoft },
            { label: 'Streak',  value: '12', unit: 'days',  tone: HARVEST.primary, accent: HARVEST.primarySoft },
            { label: 'Debates', value: '34', unit: 'total', tone: HARVEST.ochre,   accent: HARVEST.ochreSoft },
          ].map(s => (
            <div key={s.label} style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, borderRadius: 20, padding: '14px 12px' }}>
              <div style={{ ...harvestText.mono, fontSize: 9, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              <div style={{ ...harvestText.display, fontSize: 28, fontWeight: 700, color: s.tone, marginTop: 6, letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted }}>{s.unit}</div>
            </div>
          ))}
        </div>

        {/* Daily Gobble */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <h2 style={{ ...harvestText.display, fontSize: 20, margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Today's Gobble</h2>
            <span style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fresh · 6 hrs left</span>
          </div>
          <div style={{ background: HARVEST.ink, color: '#fff', borderRadius: 24, padding: 22, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.18 }}>
              <TurkeyMark stage={6} palette={{ ...harvestPal, bg: 'transparent' }} size={180} />
            </div>
            <div style={{ ...harvestText.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: HARVEST.ochre }}>Topic of the day</div>
            <div style={{ ...harvestText.display, fontSize: 22, marginTop: 8, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.02em', maxWidth: '78%' }}>
              Should social media platforms verify identity?
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
              {['Friendly Cluck','Spirited Strut','Full Gobble'].map((d,i) => (
                <span key={d} style={{ ...harvestText.body, fontSize: 11, padding: '5px 10px', borderRadius: 999, background: i===1 ? HARVEST.ochre : 'rgba(255,255,255,0.1)', color: i===1 ? HARVEST.ink : '#fff', fontWeight: 600 }}>{d}</span>
              ))}
            </div>
            <button style={{ marginTop: 18, background: HARVEST.ochre, color: HARVEST.ink, border: 'none', padding: '12px 18px', borderRadius: 999, ...harvestText.body, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              Start practice
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div style={{ ...harvestText.mono, fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 14 }}>+50 feathers · +120 XP</div>
          </div>
        </div>

        {/* Recent */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <h2 style={{ ...harvestText.display, fontSize: 20, margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Recent</h2>
            <span style={{ ...harvestText.body, fontSize: 12, color: HARVEST.primary, fontWeight: 600 }}>See all</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { topic: 'Carbon tax effectiveness', score: '8.9', diff: 'Spirited' },
              { topic: 'Mandatory voting laws', score: '7.4', diff: 'Friendly' },
              { topic: 'Universal basic income', score: '9.2', diff: 'Full Gobble' },
            ].map((d) => (
              <div key={d.topic} style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: HARVEST.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TurkeyGlyph palette={harvestPal} size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, ...harvestText.body, color: HARVEST.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.topic}</div>
                  <div style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{d.diff}</div>
                </div>
                <div style={{ ...harvestText.display, fontSize: 20, fontWeight: 700, color: HARVEST.forest, letterSpacing: '-0.02em' }}>{d.score}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>

      <HBottomNav active="home" />
    </div>
  );
}

// ── PROFILE · MOBILE ─────────────────────────────────────────────────────
function HarvestProfileMobile() {
  const stages = [1,2,3,4,5,6,7,8];
  const currentStage = 5;

  return (
    <div style={{ width: 390, height: 844, background: HARVEST.bg, position: 'relative', overflow: 'hidden', color: HARVEST.ink }}>
      <HStatusBar />

      <div style={{ padding: '8px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, width: 38, height: 38, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={HARVEST.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ ...harvestText.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: HARVEST.inkMuted }}>The Roost</div>
        <button style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, width: 38, height: 38, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 8v8M8 12h8" stroke={HARVEST.ink} strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div className="ab-scroll" style={{ position: 'absolute', top: 96, bottom: 88, left: 0, right: 0, overflowY: 'auto', padding: '0 22px' }}>

        {/* Hero turkey */}
        <div style={{ marginTop: 8, background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, borderRadius: 28, padding: '28px 22px', position: 'relative', overflow: 'hidden' }}>
          {/* Decor sun */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle at 30% 30%, ${HARVEST.ochreSoft}, transparent 70%)` }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Lv. 05 / 08</div>
            <h1 style={{ ...harvestText.display, fontSize: 36, margin: '8px 0 0', fontWeight: 700, letterSpacing: '-0.03em' }}>Sam the Tom</h1>
            <p style={{ ...harvestText.body, fontSize: 13, color: HARVEST.inkSoft, marginTop: 4 }}>Joined Aug '24 · 1,250 feathers</p>
            <div style={{ marginTop: 12 }}>
              <TurkeyMark stage={currentStage} palette={harvestPal} size={180} halo />
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {[
                { k: 'Civility', v: '87' },
                { k: 'Streak',   v: '12d' },
                { k: 'Rank',     v: '#42' },
              ].map(x => (
                <div key={x.k} style={{ background: HARVEST.bg, border: `1px solid ${HARVEST.line}`, borderRadius: 14, padding: '8px 14px', textAlign: 'center' }}>
                  <div style={{ ...harvestText.display, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>{x.v}</div>
                  <div style={{ ...harvestText.mono, fontSize: 9, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{x.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evolution timeline */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <h2 style={{ ...harvestText.display, fontSize: 20, margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Evolution</h2>
            <span style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>5 of 8</span>
          </div>
          <div style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, borderRadius: 24, padding: '14px 10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, rowGap: 14 }}>
              {stages.map(s => {
                const unlocked = s <= currentStage;
                const current = s === currentStage;
                return (
                  <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 4, borderRadius: 14, background: current ? HARVEST.primarySoft : 'transparent', border: current ? `1.5px solid ${HARVEST.primary}` : '1.5px solid transparent' }}>
                    <div style={{ filter: unlocked ? 'none' : 'grayscale(1) opacity(0.35)' }}>
                      <TurkeyMark stage={s} palette={harvestPal} size={56} />
                    </div>
                    <div style={{ ...harvestText.mono, fontSize: 9, color: unlocked ? HARVEST.ink : HARVEST.inkMuted, fontWeight: 600 }}>LV {s}</div>
                    <div style={{ ...harvestText.body, fontSize: 10, color: HARVEST.inkSoft, textAlign: 'center', lineHeight: 1.2 }}>{window.STAGE_LABELS[s]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Civility breakdown */}
        <div style={{ marginTop: 22 }}>
          <h2 style={{ ...harvestText.display, fontSize: 20, margin: 0, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>Civility, by dimension</h2>
          <div style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, borderRadius: 24, padding: 18 }}>
            {[
              { k: 'Respectful tone', v: 92 },
              { k: 'Evidence-based',  v: 84 },
              { k: 'Empathy',         v: 89 },
              { k: 'Constructive',    v: 81 },
              { k: 'Active listening',v: 88 },
            ].map((row, i) => (
              <div key={row.k} style={{ paddingTop: i ? 12 : 0, paddingBottom: 12, borderTop: i ? `1px solid ${HARVEST.line}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ ...harvestText.body, fontSize: 13, fontWeight: 600 }}>{row.k}</span>
                  <span style={{ ...harvestText.mono, fontSize: 13, fontWeight: 600, color: HARVEST.forest }}>{row.v}</span>
                </div>
                <div style={{ height: 6, background: HARVEST.bg, borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${row.v}%`, height: '100%', background: HARVEST.forest, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div style={{ marginTop: 22 }}>
          <h2 style={{ ...harvestText.display, fontSize: 20, margin: 0, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>Badges · 4 of 8</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { l: 'First Gobble',   on: true,  c: HARVEST.primary },
              { l: 'Hot Streak',     on: true,  c: HARVEST.ochre },
              { l: 'Bridge Builder', on: true,  c: HARVEST.forest },
              { l: 'Steady Voice',   on: true,  c: HARVEST.rust },
              { l: 'Flock Leader',   on: false },
              { l: 'Deep Listener',  on: false },
              { l: 'Migration',      on: false },
              { l: 'Thunderbird',    on: false },
            ].map(b => (
              <div key={b.l} style={{ aspectRatio: '1', borderRadius: 16, background: b.on ? HARVEST.surface : 'transparent', border: `1.5px solid ${b.on ? HARVEST.line : HARVEST.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 6, opacity: b.on ? 1 : 0.45 }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: b.on ? b.c : '#ddd', marginBottom: 4 }} />
                <div style={{ ...harvestText.body, fontSize: 9, fontWeight: 600, textAlign: 'center', lineHeight: 1.1 }}>{b.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>
      <HBottomNav active="me" />
    </div>
  );
}

// ── SKILLS · MOBILE ──────────────────────────────────────────────────────
function HarvestSkillsMobile() {
  return (
    <div style={{ width: 390, height: 844, background: HARVEST.bg, position: 'relative', overflow: 'hidden', color: HARVEST.ink }}>
      <HStatusBar />
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Skill paths</div>
            <h1 style={{ ...harvestText.display, fontSize: 32, margin: '4px 0 0', fontWeight: 700, letterSpacing: '-0.03em' }}>Sharpen<br/>your gobble.</h1>
          </div>
          <div style={{ width: 60, height: 60 }}>
            <TurkeyMark stage={4} palette={harvestPal} size={60} />
          </div>
        </div>
      </div>

      <div className="ab-scroll" style={{ position: 'absolute', top: 192, bottom: 88, left: 0, right: 0, overflowY: 'auto', padding: '0 22px' }}>

        {/* Active path */}
        <div style={{ marginTop: 8, marginBottom: 18, padding: 18, borderRadius: 22, background: HARVEST.ink, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -30, right: -30, opacity: 0.12 }}>
            <TurkeyMark stage={6} palette={harvestPal} size={160} />
          </div>
          <div style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.ochre, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Currently learning</div>
          <div style={{ ...harvestText.display, fontSize: 22, fontWeight: 700, marginTop: 6, letterSpacing: '-0.02em' }}>Steelmanning</div>
          <div style={{ ...harvestText.body, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Make their argument stronger before you respond.</div>
          <div style={{ marginTop: 14 }}>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '100%', background: HARVEST.ochre, borderRadius: 999 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ ...harvestText.mono, fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>3 of 5 lessons</span>
              <span style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.ochre }}>Continue →</span>
            </div>
          </div>
        </div>

        <div style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>All paths</div>

        {/* Path cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { title: 'Active Listening',    sub: 'Hear what they actually said.',    progress: 100, level: 'Mastered', accent: HARVEST.forest, accentSoft: HARVEST.forestSoft, num: '01' },
            { title: 'Evidence & Sources',  sub: 'Cite, don\u2019t guess.',           progress: 80,  level: 'Lv. 4 of 5', accent: HARVEST.primary, accentSoft: HARVEST.primarySoft, num: '02' },
            { title: 'Constructive Framing',sub: 'Build, don\u2019t blame.',          progress: 40,  level: 'Lv. 2 of 5', accent: HARVEST.ochre,   accentSoft: HARVEST.ochreSoft,   num: '03' },
            { title: 'Empathy Drills',      sub: 'Sit with the other side.',          progress: 20,  level: 'Lv. 1 of 5', accent: HARVEST.rust,    accentSoft: '#F4D9CC',           num: '04' },
            { title: 'Holding Your Ground', sub: 'Disagree without raising heat.',    progress: 0,   level: 'Locked',     accent: HARVEST.inkMuted,accentSoft: HARVEST.line,        num: '05', locked: true },
          ].map(p => (
            <div key={p.title} style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, borderRadius: 20, padding: 16, opacity: p.locked ? 0.6 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', ...harvestText.display, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {p.num}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...harvestText.display, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>{p.title}</div>
                  <div style={{ ...harvestText.body, fontSize: 12, color: HARVEST.inkSoft, marginTop: 1 }}>{p.sub}</div>
                </div>
                <div style={{ ...harvestText.mono, fontSize: 10, color: p.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{p.level}</div>
              </div>
              <div style={{ marginTop: 12, height: 5, background: HARVEST.bg, borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${p.progress}%`, height: '100%', background: p.accent, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 20 }} />
      </div>

      <HBottomNav active="skills" />
    </div>
  );
}

// ── DASHBOARD · DESKTOP ──────────────────────────────────────────────────
function HarvestDashboardDesktop() {
  return (
    <div style={{ width: 1280, height: 820, background: HARVEST.bg, position: 'relative', overflow: 'hidden', color: HARVEST.ink, display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: HARVEST.surface, borderRight: `1px solid ${HARVEST.line}`, padding: '24px 18px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: HARVEST.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TurkeyGlyph palette={{ body: HARVEST.ochre, fan1: HARVEST.primary, fan2: HARVEST.rust, beak: HARVEST.ochre, eye: '#fff' }} size={22} />
          </div>
          <div style={{ ...harvestText.display, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Gobbl</div>
        </div>

        {[
          { id: 'home', label: 'Home', count: null, active: true },
          { id: 'debate', label: 'Debate', count: '3' },
          { id: 'skills', label: 'Skills', count: null },
          { id: 'shop', label: 'Shop', count: '12 new' },
          { id: 'me', label: 'You', count: null },
        ].map(item => (
          <div key={item.id} style={{ padding: '10px 12px', borderRadius: 12, background: item.active ? HARVEST.primarySoft : 'transparent', color: item.active ? HARVEST.primary : HARVEST.inkSoft, ...harvestText.body, fontSize: 14, fontWeight: 600, marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <span>{item.label}</span>
            {item.count && <span style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted }}>{item.count}</span>}
          </div>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ background: HARVEST.bg, border: `1px solid ${HARVEST.line}`, borderRadius: 16, padding: 14 }}>
          <div style={{ ...harvestText.mono, fontSize: 9, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Feathers</div>
          <div style={{ ...harvestText.display, fontSize: 26, fontWeight: 700, color: HARVEST.primary, letterSpacing: '-0.03em', marginTop: 2 }}>1,250</div>
          <button style={{ marginTop: 10, background: HARVEST.ink, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 999, ...harvestText.body, fontSize: 12, fontWeight: 600, width: '100%', cursor: 'pointer' }}>Visit Bazaar</button>
        </div>
      </aside>

      {/* Main */}
      <main className="ab-scroll" style={{ flex: 1, padding: '28px 36px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{ ...harvestText.mono, fontSize: 11, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Tuesday · May 21</div>
            <h1 style={{ ...harvestText.display, fontSize: 44, margin: '6px 0 0', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1 }}>Ready to talk turkey, Sam?</h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, padding: '10px 16px', borderRadius: 999, ...harvestText.body, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Browse topics</button>
            <button style={{ background: HARVEST.primary, color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 999, ...harvestText.body, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>New debate +</button>
          </div>
        </div>

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
          {/* Hero card */}
          <div style={{ background: HARVEST.ink, color: '#fff', borderRadius: 28, padding: 28, position: 'relative', overflow: 'hidden', minHeight: 260 }}>
            <div style={{ position: 'absolute', right: -20, top: -10, opacity: 0.95 }}>
              <TurkeyMark stage={5} palette={{...harvestPal, bg: 'transparent'}} size={260} />
            </div>
            <div style={{ ...harvestText.mono, fontSize: 11, color: HARVEST.ochre, textTransform: 'uppercase', letterSpacing: '0.14em' }}>Today's Gobble</div>
            <div style={{ ...harvestText.display, fontSize: 30, fontWeight: 700, marginTop: 12, letterSpacing: '-0.025em', maxWidth: 360, lineHeight: 1.1 }}>
              Should social media platforms verify identity?
            </div>
            <p style={{ ...harvestText.body, fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 10, maxWidth: 380 }}>
              Robert's leaning libertarian today. Be patient with him.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {['Friendly Cluck','Spirited Strut','Full Gobble'].map((d,i) => (
                <span key={d} style={{ ...harvestText.body, fontSize: 12, padding: '7px 14px', borderRadius: 999, background: i===1 ? HARVEST.ochre : 'rgba(255,255,255,0.08)', color: i===1 ? HARVEST.ink : '#fff', fontWeight: 600 }}>{d}</span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22 }}>
              <button style={{ background: HARVEST.ochre, color: HARVEST.ink, border: 'none', padding: '12px 22px', borderRadius: 999, ...harvestText.body, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Start practice →</button>
              <span style={{ ...harvestText.mono, fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>+50 feathers · +120 XP · 6 hrs left</span>
            </div>
          </div>

          {/* Turkey hero card */}
          <div style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, borderRadius: 28, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 30%, ${HARVEST.ochreSoft}, transparent 60%)` }} />
            <div style={{ position: 'relative' }}>
              <TurkeyMark stage={5} palette={harvestPal} size={160} />
            </div>
            <div style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 8 }}>Lv. 5 · Tom</div>
            <div style={{ ...harvestText.display, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>340 / 500 XP</div>
            <div style={{ width: '100%', maxWidth: 240, marginTop: 10, height: 6, background: HARVEST.primarySoft, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: '68%', height: '100%', background: HARVEST.primary }} />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 18 }}>
          {[
            { label: 'Civility',  value: '87',  unit: '/100', delta: '+3', tone: HARVEST.forest },
            { label: 'Streak',    value: '12',  unit: 'days', delta: 'Best 18', tone: HARVEST.primary },
            { label: 'Debates',   value: '34',  unit: 'total', delta: '+2 this wk', tone: HARVEST.ochre },
            { label: 'Rank',      value: '#42', unit: 'of 4,210', delta: '↑ 6', tone: HARVEST.rust },
          ].map(s => (
            <div key={s.label} style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, borderRadius: 20, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</span>
                <span style={{ ...harvestText.mono, fontSize: 10, color: s.tone, fontWeight: 600 }}>{s.delta}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                <span style={{ ...harvestText.display, fontSize: 36, fontWeight: 700, color: s.tone, letterSpacing: '-0.03em' }}>{s.value}</span>
                <span style={{ ...harvestText.mono, fontSize: 11, color: HARVEST.inkMuted }}>{s.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginTop: 18 }}>
          {/* Recent */}
          <div style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, borderRadius: 24, padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <h3 style={{ ...harvestText.display, fontSize: 20, margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Recent debates</h3>
              <span style={{ ...harvestText.body, fontSize: 12, color: HARVEST.primary, fontWeight: 600 }}>See all 34 →</span>
            </div>
            {[
              { t: 'Carbon tax effectiveness', d: 'Spirited Strut', s: 8.9, date: '2d', civ: 'Constructive +' },
              { t: 'Mandatory voting laws',    d: 'Friendly Cluck', s: 7.4, date: '3d', civ: 'Empathy +' },
              { t: 'Universal basic income',   d: 'Full Gobble',    s: 9.2, date: '5d', civ: 'Steady tone' },
              { t: 'Public school funding',    d: 'Spirited Strut', s: 8.1, date: '1w', civ: 'Listening +' },
            ].map((row, i) => (
              <div key={row.t} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 60px', gap: 14, alignItems: 'center', padding: '14px 0', borderTop: i ? `1px solid ${HARVEST.line}` : 'none' }}>
                <div>
                  <div style={{ ...harvestText.body, fontSize: 14, fontWeight: 600 }}>{row.t}</div>
                  <div style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted, marginTop: 2 }}>{row.date} ago</div>
                </div>
                <div style={{ ...harvestText.mono, fontSize: 11, color: HARVEST.inkSoft, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.d}</div>
                <div style={{ ...harvestText.body, fontSize: 12, color: HARVEST.forest, fontWeight: 600 }}>{row.civ}</div>
                <div style={{ ...harvestText.display, fontSize: 22, fontWeight: 700, color: HARVEST.forest, textAlign: 'right', letterSpacing: '-0.02em' }}>{row.s.toFixed(1)}</div>
              </div>
            ))}
          </div>

          {/* Skill in progress + flock */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: HARVEST.forest, color: '#fff', borderRadius: 24, padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.forestSoft, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Currently learning</div>
              <div style={{ ...harvestText.display, fontSize: 22, fontWeight: 700, marginTop: 6, letterSpacing: '-0.02em' }}>Steelmanning</div>
              <div style={{ ...harvestText.body, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>3 of 5 lessons</div>
              <div style={{ marginTop: 14, height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', background: HARVEST.ochre }} />
              </div>
              <button style={{ marginTop: 14, background: '#fff', color: HARVEST.forest, border: 'none', padding: '8px 14px', borderRadius: 999, ...harvestText.body, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Continue</button>
            </div>
            <div style={{ background: HARVEST.surface, border: `1px solid ${HARVEST.line}`, borderRadius: 20, padding: 18, flex: 1 }}>
              <div style={{ ...harvestText.mono, fontSize: 10, color: HARVEST.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Top of the Flock</div>
              {[
                { n: 'CivilSam',    s: 942 },
                { n: 'BridgeBot',   s: 901 },
                { n: 'EmpathyElla', s: 870 },
              ].map((r, i) => (
                <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: i === 0 ? 12 : 8 }}>
                  <div style={{ ...harvestText.mono, fontSize: 11, color: HARVEST.inkMuted, width: 18 }}>{i+1}.</div>
                  <div style={{ width: 26, height: 26, borderRadius: 999, background: [HARVEST.primary, HARVEST.ochre, HARVEST.forest][i], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', ...harvestText.display, fontSize: 11, fontWeight: 700 }}>{r.n[0]}</div>
                  <div style={{ flex: 1, ...harvestText.body, fontSize: 13, fontWeight: 600 }}>{r.n}</div>
                  <div style={{ ...harvestText.mono, fontSize: 12, fontWeight: 600 }}>{r.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

window.HarvestDashboardMobile = HarvestDashboardMobile;
window.HarvestProfileMobile = HarvestProfileMobile;
window.HarvestSkillsMobile = HarvestSkillsMobile;
window.HarvestDashboardDesktop = HarvestDashboardDesktop;
