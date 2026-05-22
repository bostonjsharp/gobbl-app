// Additional Harvest screens: Debate Arena, Topic Setup, Level-Up, Dark Dashboard, Motion Notes.

const FlatTurkey = window.FlatTurkey;
const FlatTurkeyGlyph = window.FlatTurkeyGlyph;

const HX = {
  bg:        '#F4ECDD',
  surface:   '#FFFFFF',
  ink:       '#1A1612',
  inkSoft:   '#5C4A3A',
  inkMuted:  '#8C7660',
  line:      '#E8DDC6',
  primary:   '#C0461C',
  primarySoft:'#F4E3D5',
  forest:    '#1F4937',
  forestSoft:'#D5DFD4',
  ochre:     '#E4A547',
  ochreSoft: '#FBE9C4',
  rust:      '#7A2916',
};

const hxPal = {
  body: HX.primary, bodyDark: '#8E2F11', belly: HX.ochre,
  fan1: HX.ochre, fan2: HX.primary, fan3: HX.rust, fan4: HX.forest,
  beak: '#F5B73D', wattle: '#B82914', eye: HX.ink, white: '#FFFFFF',
  egg: '#F2E1CC', speck: HX.primary, feet: HX.rust,
  crown: HX.ochre, spark: '#FFD86B',
};

const hxText = {
  display: { fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 96, "wght" 700' },
  body:    { fontFamily: "'DM Sans', sans-serif" },
  mono:    { fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em' },
};

function HXStatusBar({ time = '9:41', dark = false }) {
  const c = dark ? '#fff' : HX.ink;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px 6px', color: c, ...hxText.body, fontSize: 15, fontWeight: 600 }}>
      <span style={{ ...hxText.mono, fontWeight: 500 }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 12 }}>●●●●</span>
        <span style={{ display: 'inline-block', width: 22, height: 11, border: '1.5px solid ' + c, borderRadius: 3, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1, background: c, width: '78%', borderRadius: 1 }} />
        </span>
      </div>
    </div>
  );
}

// ── DEBATE ARENA · MOBILE ────────────────────────────────────────────────
function HarvestDebateArena() {
  const messages = [
    { who: 'r', text: "Identity verification on platforms reduces anonymity. That has costs — whistleblowers, abuse survivors, dissidents in restrictive regimes. They depend on being able to speak without their name attached." },
    { who: 'u', text: "Fair. But the alternative is a system that rewards bad actors. Trolls, foreign ops, harassment campaigns — they all hide behind anonymity. I think verification + pseudonymity is the right middle ground." },
    { who: 'r', text: "Who holds the verification keys, though? Whoever does has enormous power. State actors will demand them. We've seen what happens with KYC mandates — they expand, never contract." },
    { who: 'u', text: "That's a real concern. Maybe the solution is decentralized identity — verified-once, used many places, without any single platform or government holding the key." },
  ];
  return (
    <div style={{ width: 390, height: 844, background: HX.bg, position: 'relative', overflow: 'hidden', color: HX.ink, display: 'flex', flexDirection: 'column' }}>
      <HXStatusBar />

      {/* Header */}
      <div style={{ padding: '8px 16px 12px', borderBottom: '1px solid ' + HX.line, background: HX.surface, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={HX.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ width: 38, height: 38, borderRadius: 999, background: HX.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FlatTurkeyGlyph palette={hxPal} size={24}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ ...hxText.body, fontSize: 14, fontWeight: 700 }}>Robert</div>
              <div style={{ width: 4, height: 4, borderRadius: 999, background: HX.inkMuted }} />
              <div style={{ ...hxText.mono, fontSize: 10, color: HX.inkMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Libertarian</div>
            </div>
            <div style={{ ...hxText.mono, fontSize: 10, color: HX.primary, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>● Spirited Strut</div>
          </div>
          <button style={{ background: HX.primarySoft, color: HX.primary, border: 'none', padding: '6px 12px', borderRadius: 999, ...hxText.body, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>End</button>
        </div>

        {/* Topic pill */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: HX.bg, borderRadius: 12 }}>
          <span style={{ ...hxText.mono, fontSize: 9, color: HX.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Topic</span>
          <span style={{ ...hxText.body, fontSize: 12, fontWeight: 600, color: HX.ink, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Should social media platforms verify identity?</span>
        </div>

        {/* Live civility meter */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ ...hxText.mono, fontSize: 9, color: HX.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Civility</span>
          <div style={{ flex: 1, height: 5, background: HX.bg, borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '78%', background: 'linear-gradient(to right, ' + HX.forest + ', ' + HX.ochre + ')', borderRadius: 999 }} />
            {/* Tick markers for the 5 dimensions */}
            {[15, 30, 50, 70, 90].map(x => <div key={x} style={{ position: 'absolute', left: x + '%', top: -2, width: 1, height: 9, background: HX.surface, opacity: 0.6 }} />)}
          </div>
          <span style={{ ...hxText.mono, fontSize: 11, fontWeight: 700, color: HX.forest, ...hxText.mono }}>78</span>
        </div>
      </div>

      {/* Messages */}
      <div className="ab-scroll" style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 6px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', justifyContent: m.who === 'u' ? 'flex-end' : 'flex-start' }}>
            {m.who === 'r' && (
              <div style={{ width: 28, height: 28, borderRadius: 999, background: HX.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FlatTurkeyGlyph palette={hxPal} size={20}/>
              </div>
            )}
            <div style={{ maxWidth: '78%' }}>
              <div style={{
                background: m.who === 'u' ? HX.ink : HX.surface,
                color: m.who === 'u' ? '#fff' : HX.ink,
                border: m.who === 'u' ? 'none' : '1px solid ' + HX.line,
                borderRadius: 18,
                borderBottomRightRadius: m.who === 'u' ? 6 : 18,
                borderBottomLeftRadius: m.who === 'r' ? 6 : 18,
                padding: '12px 14px', ...hxText.body, fontSize: 13.5, lineHeight: 1.45
              }}>
                {m.text}
              </div>
              {i === 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-10" stroke={HX.forest} strokeWidth="3" strokeLinecap="round"/></svg>
                  <span style={{ ...hxText.mono, fontSize: 9, color: HX.forest, fontWeight: 600 }}>+2 EVIDENCE</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Civility coach inline hint */}
        <div style={{ alignSelf: 'center', background: HX.forestSoft, color: HX.forest, padding: '8px 14px', borderRadius: 999, ...hxText.body, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: HX.forest }} />
          You're listening well — Robert just lowered his guard.
        </div>

        {/* Typing indicator */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: HX.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlatTurkeyGlyph palette={hxPal} size={20}/>
          </div>
          <div style={{ background: HX.surface, border: '1px solid ' + HX.line, padding: '12px 16px', borderRadius: 18, borderBottomLeftRadius: 6, display: 'flex', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: HX.inkMuted }} />
            <span style={{ width: 5, height: 5, borderRadius: 999, background: HX.inkMuted, opacity: 0.6 }} />
            <span style={{ width: 5, height: 5, borderRadius: 999, background: HX.inkMuted, opacity: 0.3 }} />
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div style={{ padding: '10px 14px 18px', background: HX.bg, borderTop: '1px solid ' + HX.line }}>
        {/* Coach chip */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {['Be specific', 'Ask a question', 'Acknowledge first', 'Cite source'].map((c, i) => (
            <button key={c} style={{ flexShrink: 0, background: i === 0 ? HX.ochreSoft : HX.surface, border: '1px solid ' + (i === 0 ? HX.ochre : HX.line), color: i === 0 ? '#8B5A18' : HX.inkSoft, padding: '5px 10px', borderRadius: 999, ...hxText.body, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              {i === 0 && <span style={{ fontSize: 9 }}>✦</span>}
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: HX.surface, border: '1px solid ' + HX.line, borderRadius: 999, padding: '8px 8px 8px 16px' }}>
          <span style={{ ...hxText.body, fontSize: 13, color: HX.inkMuted, flex: 1 }}>Your reply…</span>
          <button style={{ background: HX.ink, color: '#fff', border: 'none', width: 36, height: 36, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TOPIC + DIFFICULTY SETUP · MOBILE ────────────────────────────────────
function HarvestTopicSetup() {
  return (
    <div style={{ width: 390, height: 844, background: HX.bg, position: 'relative', overflow: 'hidden', color: HX.ink, display: 'flex', flexDirection: 'column' }}>
      <HXStatusBar />
      <div style={{ padding: '8px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={{ background: HX.surface, border: '1px solid ' + HX.line, width: 38, height: 38, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={HX.ink} strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div style={{ ...hxText.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: HX.inkMuted }}>Step 1 of 1</div>
        <div style={{ width: 38, height: 38 }} />
      </div>

      <div className="ab-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 22px 100px' }}>
        <h1 style={{ ...hxText.display, fontSize: 38, lineHeight: 1, margin: '16px 0 0', fontWeight: 700, letterSpacing: '-0.035em' }}>Set up your debate.</h1>
        <p style={{ ...hxText.body, fontSize: 13, color: HX.inkSoft, marginTop: 8 }}>Pick a topic, who Robert is today, and how hard you want him to push back.</p>

        {/* Topic */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div style={{ ...hxText.mono, fontSize: 10, color: HX.inkMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>01 — Topic</div>
            <span style={{ ...hxText.body, fontSize: 12, color: HX.primary, fontWeight: 600 }}>Browse all 52 →</span>
          </div>
          <div style={{ background: HX.surface, border: '2px solid ' + HX.primary, borderRadius: 18, padding: 16, position: 'relative' }}>
            <div style={{ ...hxText.mono, fontSize: 9, color: HX.primary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tech & Society · Daily</div>
            <div style={{ ...hxText.display, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6 }}>Should social media platforms verify identity?</div>
            <div style={{ ...hxText.body, fontSize: 12, color: HX.inkSoft, marginTop: 4 }}>+50 feathers · daily bonus</div>
            <div style={{ position: 'absolute', top: 14, right: 14, background: HX.primary, color: '#fff', borderRadius: 999, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
            </div>
          </div>
          {/* Alt topics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {['Universal basic income', 'Carbon tax effectiveness', 'AI in classrooms'].map(t => (
              <div key={t} style={{ background: HX.surface, border: '1px solid ' + HX.line, borderRadius: 14, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ ...hxText.body, fontSize: 13, fontWeight: 500 }}>{t}</span>
                <span style={{ ...hxText.mono, fontSize: 10, color: HX.inkMuted }}>→</span>
              </div>
            ))}
          </div>
        </div>

        {/* Robert auto-flip note */}
        <div style={{ marginTop: 18, padding: '12px 14px', background: HX.forestSoft, border: '1px solid ' + HX.forest + '33', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: HX.forest, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 7L12 17l-4-4M3 12l4 4M14 7l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...hxText.body, fontSize: 12, fontWeight: 700, color: HX.forest }}>Robert opposes you today.</div>
            <div style={{ ...hxText.body, fontSize: 11, color: HX.inkSoft, marginTop: 1 }}>You’re centre-left, so he’s leaning libertarian — set from your onboarding profile.</div>
          </div>
        </div>

        {/* Difficulty */}
        <div style={{ marginTop: 22 }}>
          <div style={{ ...hxText.mono, fontSize: 10, color: HX.inkMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>02 — Difficulty</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Friendly Cluck', desc: 'Warm, listens, concedes good points.', xp: 60, stage: 3, selected: false, tone: HX.forest, toneSoft: HX.forestSoft },
              { name: 'Spirited Strut', desc: 'Engaged, direct, pushes back politely.', xp: 120, stage: 5, selected: true, tone: HX.primary, toneSoft: HX.primarySoft },
              { name: 'Full Gobble',    desc: 'Confrontational, immovable, won\u2019t budge.', xp: 200, stage: 7, selected: false, tone: HX.rust, toneSoft: '#F4D9CC' },
            ].map(d => (
              <div key={d.name} style={{ background: HX.surface, border: '2px solid ' + (d.selected ? d.tone : HX.line), borderRadius: 18, padding: 14, display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: d.toneSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FlatTurkey stage={d.stage} palette={hxPal} size={50}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...hxText.display, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: d.tone }}>{d.name}</div>
                  <div style={{ ...hxText.body, fontSize: 12, color: HX.inkSoft, marginTop: 1 }}>{d.desc}</div>
                </div>
                <div style={{ ...hxText.mono, fontSize: 11, fontWeight: 600, color: d.tone, whiteSpace: 'nowrap' }}>+{d.xp} XP</div>
                {d.selected && (
                  <div style={{ position: 'absolute', top: -8, right: 14, background: d.tone, color: '#fff', padding: '2px 8px', borderRadius: 999, ...hxText.mono, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Selected</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 20px 28px', background: 'linear-gradient(to top, ' + HX.bg + ' 70%, transparent)' }}>
        <button style={{ width: '100%', background: HX.primary, color: '#fff', border: 'none', padding: '16px', borderRadius: 999, ...hxText.body, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(192,70,28,0.2)' }}>
          Start the debate
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── LEVEL UP CELEBRATION · MOBILE ────────────────────────────────────────
function HarvestLevelUp() {
  // Confetti positions (deterministic so they aren't recomputed)
  const confetti = Array.from({ length: 36 }).map((_, i) => {
    const x = (i * 37 + 7) % 390;
    const y = (i * 79 + 31) % 700;
    const rot = (i * 47) % 360;
    const colors = [HX.ochre, HX.primary, HX.forest, HX.rust, '#F5B73D', '#fff'];
    const c = colors[i % colors.length];
    const w = i % 3 === 0 ? 4 : (i % 3 === 1 ? 8 : 12);
    const h = i % 3 === 0 ? 4 : (i % 3 === 1 ? 4 : 4);
    return { x, y, rot, c, w, h, shape: i % 4 };
  });

  return (
    <div style={{ width: 390, height: 844, background: HX.ink, position: 'relative', overflow: 'hidden', color: '#fff' }}>
      {/* Radial glow background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 38%, rgba(228,165,71,0.35), rgba(192,70,28,0.18) 30%, transparent 60%)' }} />
      {/* Confetti */}
      {confetti.map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: c.x, top: c.y,
          width: c.w, height: c.h,
          background: c.c,
          borderRadius: c.shape === 0 ? 999 : (c.shape === 1 ? 2 : 0),
          transform: 'rotate(' + c.rot + 'deg)',
          opacity: 0.85,
        }}/>
      ))}

      <HXStatusBar dark/>

      <div style={{ position: 'absolute', top: 60, left: 0, right: 0, textAlign: 'center', padding: '0 24px' }}>
        <div style={{ ...hxText.mono, fontSize: 11, color: HX.ochre, textTransform: 'uppercase', letterSpacing: '0.24em' }}>★  Level Up  ★</div>
        <h1 style={{ ...hxText.display, fontSize: 50, margin: '12px 0 4px', lineHeight: 0.95, letterSpacing: '-0.04em', fontWeight: 800 }}>
          You're a<br/><span style={{ color: HX.ochre, fontStyle: 'italic' }}>Gobbler</span> now.
        </h1>
        <p style={{ ...hxText.body, fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>500 XP earned. New plumage unlocked.</p>
      </div>

      {/* Turkey transition */}
      <div style={{ position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{ opacity: 0.4, filter: 'grayscale(0.4) blur(1px)' }}>
          <FlatTurkey stage={5} palette={hxPal} size={90}/>
          <div style={{ ...hxText.mono, fontSize: 9, color: 'rgba(255,255,255,0.5)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>LV.5 Tom</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
            <path d="M2 7h22M20 2l5 5-5 5" stroke={HX.ochre} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ filter: 'drop-shadow(0 0 24px rgba(228,165,71,0.5))' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: 'radial-gradient(circle, rgba(228,165,71,0.3), transparent 70%)' }} />
            <FlatTurkey stage={6} palette={hxPal} size={170}/>
          </div>
          <div style={{ ...hxText.mono, fontSize: 9, color: HX.ochre, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4, fontWeight: 700 }}>LV.6 Gobbler</div>
        </div>
      </div>

      {/* Rewards */}
      <div style={{ position: 'absolute', bottom: 130, left: 24, right: 24 }}>
        <div style={{ ...hxText.mono, fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.16em', textAlign: 'center', marginBottom: 14 }}>You earned</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { v: '+500', l: 'Feathers', c: HX.ochre },
            { v: '+5', l: 'Outfits', c: '#fff' },
            { v: '01', l: 'New badge', c: HX.ochre },
          ].map((r,i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '14px 10px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
              <div style={{ ...hxText.display, fontSize: 28, fontWeight: 700, color: r.c, letterSpacing: '-0.03em' }}>{r.v}</div>
              <div style={{ ...hxText.mono, fontSize: 9, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{r.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24 }}>
        <button style={{ width: '100%', background: HX.ochre, color: HX.ink, border: 'none', padding: '16px', borderRadius: 999, ...hxText.body, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Show me what's new
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button style={{ width: '100%', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: 'none', padding: '10px', ...hxText.body, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 4 }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ── DARK HARVEST DASHBOARD · MOBILE ──────────────────────────────────────
function HarvestDashboardDark() {
  // Dark palette
  const D = {
    bg: '#1A1612',
    surface: '#252019',
    surfaceHigh: '#302921',
    ink: '#F2E5CC',
    inkSoft: '#B8A689',
    inkMuted: '#6E6253',
    line: 'rgba(242,229,204,0.08)',
    primary: '#E25826',
    primarySoft: 'rgba(226,88,38,0.15)',
    ochre: '#F0B547',
    ochreSoft: 'rgba(240,181,71,0.12)',
    forest: '#5FAE85',
    forestSoft: 'rgba(95,174,133,0.14)',
  };

  return (
    <div style={{ width: 390, height: 844, background: D.bg, position: 'relative', overflow: 'hidden', color: D.ink }}>
      <HXStatusBar dark />

      <div style={{ padding: '8px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 999, background: D.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', ...hxText.display, fontSize: 16, fontWeight: 700 }}>S</div>
          <div>
            <div style={{ fontSize: 11, color: D.inkMuted, ...hxText.mono, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tuesday</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Hey, Sam</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: D.surface, border: '1px solid ' + D.line, padding: '7px 12px', borderRadius: 999 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 3c-7 0-11 5-12 9-1 4 0 8 0 9h2c0-3 1-7 3-10s5-5 7-8z" fill={D.ochre}/></svg>
          <span style={{ ...hxText.mono, fontWeight: 600, fontSize: 13, color: D.ochre }}>1,250</span>
        </div>
      </div>

      <div className="ab-scroll" style={{ position: 'absolute', top: 96, bottom: 88, left: 0, right: 0, overflowY: 'auto', padding: '0 22px' }}>
        <div style={{ paddingTop: 18, paddingBottom: 18 }}>
          <h1 style={{ ...hxText.display, fontSize: 38, lineHeight: '0.95', margin: 0, color: D.ink, letterSpacing: '-0.035em' }}>
            Ready to<br/>talk turkey?
          </h1>
          <p style={{ ...hxText.body, fontSize: 14, color: D.inkSoft, marginTop: 12, lineHeight: 1.45 }}>
            One conversation a day. The Flock's already gathering.
          </p>
        </div>

        <div style={{ background: D.surface, borderRadius: 28, padding: 22, position: 'relative', overflow: 'hidden', border: '1px solid ' + D.line }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: 999, background: D.ochreSoft }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, position: 'relative' }}>
            <FlatTurkey stage={5} palette={hxPal} size={120} />
            <div style={{ flex: 1 }}>
              <div style={{ ...hxText.mono, fontSize: 10, color: D.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Level 5 · Tom</div>
              <div style={{ ...hxText.display, fontSize: 22, lineHeight: 1.05, marginTop: 4, fontWeight: 700, letterSpacing: '-0.02em' }}>Strutting<br/>nicely.</div>
              <div style={{ marginTop: 14 }}>
                <div style={{ height: 8, background: D.surfaceHigh, borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, width: '68%', background: D.primary, borderRadius: 999 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ ...hxText.mono, fontSize: 10, color: D.inkMuted }}>340 / 500 XP</span>
                  <span style={{ ...hxText.mono, fontSize: 10, color: D.ochre, fontWeight: 600 }}>+160 to Gobbler</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
          {[
            { label: 'Civility', value: '87', unit: '/100', tone: D.forest },
            { label: 'Streak',  value: '12', unit: 'days',  tone: D.primary },
            { label: 'Debates', value: '34', unit: 'total', tone: D.ochre },
          ].map(s => (
            <div key={s.label} style={{ background: D.surface, border: '1px solid ' + D.line, borderRadius: 20, padding: '14px 12px' }}>
              <div style={{ ...hxText.mono, fontSize: 9, color: D.inkMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              <div style={{ ...hxText.display, fontSize: 28, fontWeight: 700, color: s.tone, marginTop: 6, letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ ...hxText.mono, fontSize: 10, color: D.inkMuted }}>{s.unit}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <h2 style={{ ...hxText.display, fontSize: 20, margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Today's Gobble</h2>
            <span style={{ ...hxText.mono, fontSize: 10, color: D.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fresh · 6 hrs left</span>
          </div>
          <div style={{ background: D.surfaceHigh, color: '#fff', borderRadius: 24, padding: 22, position: 'relative', overflow: 'hidden', border: '1px solid ' + D.line }}>
            <div style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.2 }}>
              <FlatTurkey stage={6} palette={hxPal} size={180} />
            </div>
            <div style={{ ...hxText.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: D.ochre }}>Topic of the day</div>
            <div style={{ ...hxText.display, fontSize: 22, marginTop: 8, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.02em', maxWidth: '78%' }}>
              Should social media platforms verify identity?
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
              {['Friendly Cluck','Spirited Strut','Full Gobble'].map((d,i) => (
                <span key={d} style={{ ...hxText.body, fontSize: 11, padding: '5px 10px', borderRadius: 999, background: i===1 ? D.ochre : 'rgba(255,255,255,0.07)', color: i===1 ? D.bg : '#fff', fontWeight: 600 }}>{d}</span>
              ))}
            </div>
            <button style={{ marginTop: 18, background: D.ochre, color: D.bg, border: 'none', padding: '12px 18px', borderRadius: 999, ...hxText.body, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              Start practice
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div style={{ ...hxText.mono, fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 14 }}>+50 feathers · +120 XP</div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <h2 style={{ ...hxText.display, fontSize: 20, margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Recent</h2>
            <span style={{ ...hxText.body, fontSize: 12, color: D.primary, fontWeight: 600 }}>See all</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { topic: 'Carbon tax effectiveness', score: '8.9', diff: 'Spirited' },
              { topic: 'Mandatory voting laws', score: '7.4', diff: 'Friendly' },
              { topic: 'Universal basic income', score: '9.2', diff: 'Full Gobble' },
            ].map((d) => (
              <div key={d.topic} style={{ background: D.surface, border: '1px solid ' + D.line, borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: D.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FlatTurkeyGlyph palette={hxPal} size={22}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, ...hxText.body, color: D.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.topic}</div>
                  <div style={{ ...hxText.mono, fontSize: 10, color: D.inkMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{d.diff}</div>
                </div>
                <div style={{ ...hxText.display, fontSize: 20, fontWeight: 700, color: D.forest, letterSpacing: '-0.02em' }}>{d.score}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>

      {/* Bottom nav (dark) */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 16px 24px', background: D.bg, borderTop: '1px solid ' + D.line, display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        {[
          { id: 'home', label: 'Home', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-7h-6v7H5a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.8"/></svg>, active: true },
          { id: 'chat', label: 'Debate', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3h-3l-4 4v-4H7a3 3 0 01-3-3V6z" stroke="currentColor" strokeWidth="1.8"/></svg> },
          { id: 'skills', label: 'Skills', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4" stroke="currentColor" strokeWidth="1.8"/></svg> },
          { id: 'shop', label: 'Shop', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 8h14l-1.2 12a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
          { id: 'me', label: 'You', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8"/></svg> },
        ].map(i => (
          <div key={i.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 4px', color: i.active ? D.primary : D.inkMuted, ...hxText.body }}>
            <div style={{ background: i.active ? D.primarySoft : 'transparent', borderRadius: 999, padding: '4px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i.icon}</div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.03em' }}>{i.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

window.HarvestDebateArena = HarvestDebateArena;
window.HarvestTopicSetup = HarvestTopicSetup;
window.HarvestLevelUp = HarvestLevelUp;
window.HarvestDashboardDark = HarvestDashboardDark;
