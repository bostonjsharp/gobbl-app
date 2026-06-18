// Harvest motion & interaction notes — annotated spec sheet artboard.

const FT_M = window.FlatTurkey;

const HM = {
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
  annotation:'#3F6F8C',
};

const hmText = {
  display: { fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em', fontWeight: 700 },
  body:    { fontFamily: "'DM Sans', sans-serif" },
  mono:    { fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em' },
};

const hmPal = {
  body: HM.primary, bodyDark: '#8E2F11', belly: HM.ochre,
  fan1: HM.ochre, fan2: HM.primary, fan3: HM.rust, fan4: HM.forest,
  beak: '#F5B73D', wattle: '#B82914', eye: HM.ink, white: '#FFFFFF',
  feet: HM.rust, crown: HM.ochre, spark: '#FFD86B',
};

// A callout box with an arrow line
function Callout({ x, y, w = 220, dotX, dotY, num, title, children, side = 'left' }) {
  return (
    <>
      {/* Connector line from dot to box */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} width="100%" height="100%">
        <path d={'M ' + dotX + ' ' + dotY + ' C ' + (dotX + (side === 'left' ? -40 : 40)) + ' ' + dotY + ', ' + (x + (side === 'left' ? w + 20 : -20)) + ' ' + (y + 16) + ', ' + (x + (side === 'left' ? w : 0)) + ' ' + (y + 16)} stroke={HM.annotation} strokeWidth="1.2" fill="none" strokeDasharray="3 3" />
        <circle cx={dotX} cy={dotY} r="4" fill={HM.annotation}/>
        <circle cx={dotX} cy={dotY} r="2" fill="#fff"/>
      </svg>
      <div style={{ position: 'absolute', left: x, top: y, width: w, padding: '12px 14px', background: HM.surface, border: '1px solid ' + HM.line, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.04)', zIndex: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 999, background: HM.annotation, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', ...hmText.mono, fontSize: 11, fontWeight: 700 }}>{num}</div>
          <div style={{ ...hmText.body, fontSize: 12, fontWeight: 700, color: HM.ink }}>{title}</div>
        </div>
        <div style={{ ...hmText.body, fontSize: 11, color: HM.inkSoft, marginTop: 6, lineHeight: 1.45 }}>{children}</div>
      </div>
    </>
  );
}

function HarvestMotionNotes() {
  return (
    <div style={{ width: 1280, height: 820, background: HM.bg, position: 'relative', overflow: 'hidden', color: HM.ink, fontFamily: hmText.body.fontFamily }}>
      {/* Background dot grid */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <defs>
          <pattern id="mgridDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={HM.inkMuted} opacity="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mgridDots)" />
      </svg>

      {/* Header */}
      <div style={{ padding: '32px 40px 18px', borderBottom: '1px solid ' + HM.line, background: HM.bg, position: 'relative', zIndex: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ ...hmText.mono, fontSize: 11, color: HM.inkMuted, textTransform: 'uppercase', letterSpacing: '0.14em' }}>Harvest · spec sheet</div>
            <h1 style={{ ...hmText.display, fontSize: 38, margin: '6px 0 0', letterSpacing: '-0.03em' }}>Motion & interaction notes</h1>
          </div>
          <div style={{ ...hmText.mono, fontSize: 11, color: HM.inkMuted }}>v0.1 · annotations on the dashboard</div>
        </div>
      </div>

      {/* Main content area */}
      <div style={{ position: 'relative', padding: '28px 40px', height: 'calc(820px - 130px)' }}>
        {/* Mock dashboard preview (simplified) at center-left */}
        <div style={{ position: 'absolute', left: 460, top: 28, width: 360, height: 640, background: HM.bg, border: '1px solid ' + HM.line, borderRadius: 36, overflow: 'hidden', boxShadow: '0 20px 60px rgba(122,41,22,0.12)' }}>
          {/* Status bar */}
          <div style={{ padding: '14px 22px 6px', display: 'flex', justifyContent: 'space-between', ...hmText.mono, fontSize: 11, color: HM.ink, fontWeight: 600 }}>
            <span>9:41</span>
            <span>●●●●</span>
          </div>
          {/* Top app bar */}
          <div style={{ padding: '6px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: HM.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', ...hmText.display, fontSize: 13 }}>S</div>
              <div>
                <div style={{ ...hmText.mono, fontSize: 9, color: HM.inkMuted, textTransform: 'uppercase' }}>Tuesday</div>
                <div style={{ ...hmText.body, fontSize: 12, fontWeight: 700 }}>Hey, Sam</div>
              </div>
            </div>
            <div style={{ background: HM.surface, border: '1px solid ' + HM.line, padding: '6px 10px', borderRadius: 999, ...hmText.mono, fontSize: 11, fontWeight: 600 }}>1,250</div>
          </div>

          <div style={{ padding: '14px 20px 0' }}>
            <h2 style={{ ...hmText.display, fontSize: 26, margin: 0, lineHeight: 0.95, letterSpacing: '-0.03em' }}>Ready to<br/>talk turkey?</h2>
          </div>

          {/* Hero turkey card */}
          <div style={{ margin: '16px 20px 0', background: HM.surface, border: '1px solid ' + HM.line, borderRadius: 22, padding: 14, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: 999, background: HM.ochreSoft }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
              <FT_M stage={5} palette={hmPal} size={90}/>
              <div style={{ flex: 1 }}>
                <div style={{ ...hmText.mono, fontSize: 8, color: HM.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Level 5 · Tom</div>
                <div style={{ ...hmText.display, fontSize: 16, marginTop: 2, letterSpacing: '-0.02em' }}>Strutting nicely.</div>
                <div style={{ marginTop: 8, height: 6, background: HM.primarySoft, borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', background: HM.primary, borderRadius: 999 }}/>
                </div>
                <div style={{ ...hmText.mono, fontSize: 9, color: HM.inkMuted, marginTop: 4 }}>340 / 500 XP</div>
              </div>
            </div>
          </div>

          {/* Stat row */}
          <div style={{ margin: '10px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { l: 'Civility', v: '87', c: HM.forest },
              { l: 'Streak', v: '12', c: HM.primary },
              { l: 'Debates', v: '34', c: HM.ochre },
            ].map(s => (
              <div key={s.l} style={{ background: HM.surface, border: '1px solid ' + HM.line, borderRadius: 14, padding: '10px 8px' }}>
                <div style={{ ...hmText.mono, fontSize: 8, color: HM.inkMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
                <div style={{ ...hmText.display, fontSize: 22, color: s.c, letterSpacing: '-0.03em', marginTop: 4 }}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Today's Gobble */}
          <div style={{ margin: '14px 20px 0', background: HM.ink, color: '#fff', borderRadius: 18, padding: 14, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.18 }}>
              <FT_M stage={6} palette={hmPal} size={120}/>
            </div>
            <div style={{ ...hmText.mono, fontSize: 8, color: HM.ochre, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Today's Gobble</div>
            <div style={{ ...hmText.display, fontSize: 16, marginTop: 4, lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: '78%' }}>
              Should social media platforms verify identity?
            </div>
            <button style={{ marginTop: 12, background: HM.ochre, color: HM.ink, border: 'none', padding: '8px 12px', borderRadius: 999, ...hmText.body, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Start practice →</button>
          </div>
        </div>

        {/* Annotations — LEFT side */}
        <Callout x={28} y={48} w={400} dotX={520} dotY={88} num={1} title="App bar · sticky on scroll" side="left">
          Translates Y by –4px and gains a 1px hairline border on first scroll. <strong>Spring</strong> 280/24, opacity ease 120ms. Avatar mini animates from 32 → 28px during the same window.
        </Callout>

        <Callout x={28} y={170} w={400} dotX={580} dotY={235} num={2} title="Hero turkey · press + level glow" side="left">
          Tap-press scales 0.96 with <strong>spring 380/22</strong>. On level-up, a 24px radial glow blooms (0 → 100% → 0 over 1.4s) and the new stage cross-fades in on top of the old. Tail feathers stagger-in by 60ms each.
        </Callout>

        <Callout x={28} y={320} w={400} dotX={550} dotY={400} num={3} title="Stat tiles · ticking number" side="left">
          Numbers animate as <strong>tabular-nums</strong> from current → target over 700ms (ease-out-quart). When civility delta is positive, the number flashes forest-green for 200ms before settling to ink. Tile has subtle warmth gradient on hover (desktop).
        </Callout>

        <Callout x={28} y={490} w={400} dotX={620} dotY={560} num={4} title="Today's Gobble · pressable card" side="left">
          Card lifts 4px (translateY –4, shadow 0 8 24 0.18) on hover. CTA button is the ochre swatch — pressing it triggers a <strong>200ms fade-out + slide-to-arena transition</strong>, the turkey silhouette behind the card scales 1.05 → 1.0.
        </Callout>

        {/* Annotations — RIGHT side */}
        <Callout x={848} y={68} w={400} dotX={780} dotY={140} num={5} title="Feather balance chip" side="right">
          Increment animates as a stamp: chip pulses scale 1 → 1.08 → 1 (spring 360/20) and a +N counter floats up 24px and fades over 1.2s. Number rolls as digit-flip if &gt; 10 delta.
        </Callout>

        <Callout x={848} y={210} w={400} dotX={780} dotY={295} num={6} title="XP bar fill" side="right">
          Bar tween from prior % → new % over <strong>900ms ease-out-cubic</strong>. Trailing 8px shimmer sweep travels left → right, fades on arrival. Color: solid primary on default, gradient primary → ochre on near-level-up (≥90%).
        </Callout>

        <Callout x={848} y={355} w={400} dotX={770} dotY={420} num={7} title="Recent debate tap" side="right">
          List row taps trigger 40ms scale press (0.98) then push to detail. <strong>Score ticker plays its own +0.x fly-in</strong> when newly added (first 3s). Color hierarchy: forest ≥8, ochre 6-8, rust &lt;6.
        </Callout>

        <Callout x={848} y={500} w={400} dotX={770} dotY={600} num={8} title="Bottom nav · selection" side="right">
          Active pill morphs between items with <strong>spring 360/28</strong>, label cross-fades 120ms. Icons remain outline; only the pill background carries selection state. Haptic: light tick on tab change.
        </Callout>

        {/* Bottom strip — Easing reference */}
        <div style={{ position: 'absolute', bottom: 24, left: 40, right: 40, padding: '16px 20px', background: HM.surface, border: '1px solid ' + HM.line, borderRadius: 18, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div>
            <div style={{ ...hmText.mono, fontSize: 9, color: HM.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Easing library</div>
            <div style={{ ...hmText.display, fontSize: 14, marginTop: 2, letterSpacing: '-0.02em' }}>Three curves, used everywhere</div>
          </div>
          {[
            { name: 'Spring 360/24', desc: 'Press, snap, list reorder' },
            { name: 'ease-out-quart', desc: 'Numbers, bars, fades' },
            { name: 'ease-in-out-cubic', desc: 'Layout, sheets, modals' },
          ].map(e => (
            <div key={e.name} style={{ flex: 1, paddingLeft: 16, borderLeft: '1px solid ' + HM.line }}>
              <div style={{ ...hmText.mono, fontSize: 11, color: HM.primary, fontWeight: 600 }}>{e.name}</div>
              <div style={{ ...hmText.body, fontSize: 11, color: HM.inkSoft, marginTop: 2 }}>{e.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.HarvestMotionNotes = HarvestMotionNotes;
