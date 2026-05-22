// Harvest — Shop / Bazaar screen.

const FlatTurkey_S = window.FlatTurkey;
const FlatTurkeyGlyph_S = window.FlatTurkeyGlyph;

const HS = {
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

const hsPal = {
  body: HS.primary, bodyDark: '#8E2F11', belly: HS.ochre,
  fan1: HS.ochre, fan2: HS.primary, fan3: HS.rust, fan4: HS.forest,
  beak: '#F5B73D', wattle: '#B82914', eye: HS.ink, white: '#FFFFFF',
  feet: HS.rust, crown: HS.ochre, spark: '#FFD86B',
};

const hsText = {
  display: { fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 96, "wght" 700' },
  body:    { fontFamily: "'DM Sans', sans-serif" },
  mono:    { fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em' },
};

// Shared status bar
function HSStatusBar({ time = '9:41' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px 6px', color: HS.ink, ...hsText.body, fontSize: 15, fontWeight: 600 }}>
      <span style={{ ...hsText.mono, fontWeight: 500 }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 12 }}>●●●●</span>
        <span style={{ display: 'inline-block', width: 22, height: 11, border: '1.5px solid ' + HS.ink, borderRadius: 3, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1, background: HS.ink, width: '78%', borderRadius: 1 }} />
        </span>
      </div>
    </div>
  );
}

// Bottom nav re-using harvest pattern, but Flock → Shop
function HSBottomNav({ active = 'shop' }) {
  const items = [
    { id: 'home',  label: 'Home',  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-7h-6v7H5a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { id: 'chat',  label: 'Debate', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3h-3l-4 4v-4H7a3 3 0 01-3-3V6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { id: 'skills',label: 'Skills',icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { id: 'shop',  label: 'Shop',  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 8h14l-1.2 12a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
    { id: 'me',    label: 'You',   icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  ];
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 16px 24px', background: HS.bg, borderTop: '1px solid ' + HS.line, display: 'flex', justifyContent: 'space-between', gap: 4 }}>
      {items.map(i => {
        const isActive = i.id === active;
        return (
          <div key={i.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 4px', color: isActive ? HS.primary : HS.inkMuted, ...hsText.body }}>
            <div style={{ background: isActive ? HS.primarySoft : 'transparent', borderRadius: 999, padding: '4px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {i.icon}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.03em' }}>{i.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Currency chip
function FeatherChip({ amount = '1,250', size = 'md' }) {
  const padding = size === 'lg' ? '8px 14px' : '6px 10px';
  const fontSize = size === 'lg' ? 14 : 12;
  const iconSize = size === 'lg' ? 16 : 12;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: HS.ochreSoft, border: '1px solid ' + HS.ochre, padding, borderRadius: 999 }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none"><path d="M21 3c-7 0-11 5-12 9-1 4 0 8 0 9h2c0-3 1-7 3-10s5-5 7-8z" fill={HS.ochre}/></svg>
      <span style={{ ...hsText.mono, fontWeight: 600, fontSize, color: '#8B5A18' }}>{amount}</span>
    </div>
  );
}

// One shop item card
function ItemCard({ item }) {
  const { name, emoji, type, cost, status, accent } = item;
  const statusColor = status === 'equipped' ? HS.forest : (status === 'locked' ? HS.inkMuted : HS.primary);
  return (
    <div style={{ background: HS.surface, border: '1.5px solid ' + (status === 'equipped' ? HS.forest : HS.line), borderRadius: 18, padding: 10, position: 'relative', overflow: 'hidden' }}>
      {/* Tile preview */}
      <div style={{ background: accent || HS.ochreSoft, borderRadius: 12, aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative ring */}
        <div style={{ position: 'absolute', inset: 8, border: '1.5px dashed rgba(255,255,255,0.45)', borderRadius: 12 }} />
        <span style={{ fontSize: 46, lineHeight: 1, filter: status === 'locked' ? 'grayscale(0.85) opacity(0.4)' : 'none' }}>{emoji}</span>
        {/* Type badge */}
        <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(26,22,18,0.85)', color: '#fff', ...hsText.mono, fontSize: 9, padding: '3px 6px', borderRadius: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{type}</span>
        {/* New badge */}
        {item.isNew && <span style={{ position: 'absolute', top: 8, right: 8, background: HS.primary, color: '#fff', ...hsText.mono, fontSize: 9, padding: '3px 6px', borderRadius: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New</span>}
        {/* Lock overlay */}
        {status === 'locked' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,22,18,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 10V8a5 5 0 0110 0v2M5 10h14v10H5V10z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        )}
      </div>
      {/* Meta */}
      <div style={{ padding: '10px 4px 4px' }}>
        <div style={{ ...hsText.body, fontSize: 13, fontWeight: 700, color: HS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          {status === 'equipped' ? (
            <span style={{ ...hsText.mono, fontSize: 10, color: HS.forest, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-10" stroke={HS.forest} strokeWidth="3" strokeLinecap="round"/></svg>
              Equipped
            </span>
          ) : status === 'locked' ? (
            <span style={{ ...hsText.mono, fontSize: 10, color: HS.inkMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lv. {item.unlockAt}</span>
          ) : status === 'owned' ? (
            <span style={{ ...hsText.mono, fontSize: 10, color: HS.inkSoft, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Owned</span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...hsText.mono, fontSize: 12, fontWeight: 700, color: HS.ink }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M21 3c-7 0-11 5-12 9-1 4 0 8 0 9h2c0-3 1-7 3-10s5-5 7-8z" fill={HS.ochre}/></svg>
              {cost}
            </span>
          )}
          {status === 'owned' && (
            <button style={{ background: HS.ink, color: '#fff', border: 'none', ...hsText.body, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, cursor: 'pointer' }}>Equip</button>
          )}
        </div>
      </div>
    </div>
  );
}

function HarvestShop() {
  const tabs = [
    { id: 'all',    label: 'All' },
    { id: 'hats',   label: 'Hats' },
    { id: 'faces',  label: 'Faces' },
    { id: 'looks',  label: 'Looks' },
    { id: 'bg',     label: 'Backgrounds' },
  ];
  const activeTab = 'all';

  const items = [
    { name: 'Scholar Cap',    emoji: '🎓', type: 'Hat',   cost: 250, status: 'equipped', accent: HS.forestSoft, isNew: false },
    { name: 'Aviators',       emoji: '🕶️', type: 'Face',  cost: 180, status: 'owned',    accent: HS.primarySoft },
    { name: 'Pumpkin Hat',    emoji: '🎃', type: 'Hat',   cost: 320, status: 'buy',      accent: HS.ochreSoft, isNew: true },
    { name: 'Tiny Crown',     emoji: '👑', type: 'Hat',   cost: 800, status: 'buy',      accent: '#FBE9C4', isNew: true },
    { name: 'Bow Tie',        emoji: '🎀', type: 'Look',  cost: 220, status: 'owned',    accent: '#F4D9CC' },
    { name: 'Reading Glasses',emoji: '👓', type: 'Face',  cost: 160, status: 'buy',      accent: HS.forestSoft },
    { name: 'Cosmic Backdrop',emoji: '🌌', type: 'Bg',    cost: 1200,status: 'locked',   accent: '#2A2440', unlockAt: 6 },
    { name: 'Forest Glade',   emoji: '🌲', type: 'Bg',    cost: 600, status: 'buy',      accent: HS.forestSoft },
    { name: 'Lab Coat',       emoji: '🥼', type: 'Look',  cost: 450, status: 'buy',      accent: '#F0F0EA' },
    { name: 'Coffee Mug',     emoji: '☕', type: 'Look',  cost: 90,  status: 'buy',      accent: '#E8D6C2' },
    { name: 'Detective Pipe', emoji: '🔍', type: 'Face',  cost: 380, status: 'locked',   accent: HS.primarySoft, unlockAt: 6 },
    { name: 'Sunset Backdrop',emoji: '🌅', type: 'Bg',    cost: 700, status: 'buy',      accent: '#FCE2C0' },
  ];

  return (
    <div style={{ width: 390, height: 844, background: HS.bg, position: 'relative', overflow: 'hidden', color: HS.ink }}>
      <HSStatusBar />

      {/* Header */}
      <div style={{ padding: '8px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ ...hsText.mono, fontSize: 10, color: HS.inkMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Bazaar</div>
          <h1 style={{ ...hsText.display, fontSize: 28, margin: '2px 0 0', fontWeight: 700, letterSpacing: '-0.03em' }}>Dress your turkey.</h1>
        </div>
        <FeatherChip amount="1,250" size="lg"/>
      </div>

      <div className="ab-scroll" style={{ position: 'absolute', top: 110, bottom: 88, left: 0, right: 0, overflowY: 'auto', padding: '0 22px' }}>
        {/* Hero preview */}
        <div style={{ marginTop: 14, background: HS.surface, border: '1px solid ' + HS.line, borderRadius: 26, padding: 18, position: 'relative', overflow: 'hidden' }}>
          {/* Decor */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: 999, background: HS.ochreSoft, opacity: 0.6 }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: 999, background: HS.primarySoft, opacity: 0.55 }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlatTurkey_S stage={5} palette={hsPal} size={140}/>
              {/* Equipped overlay: scholar cap */}
              <span style={{ position: 'absolute', top: -2, left: 28, fontSize: 38, transform: 'rotate(-8deg)' }}>🎓</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...hsText.mono, fontSize: 10, color: HS.inkMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your look · Lv. 5 Tom</div>
              <div style={{ ...hsText.display, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 4 }}>Sam, the<br/>Scholar.</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                {['🎓 Scholar Cap', '🎀 Bow Tie'].map(t => (
                  <span key={t} style={{ background: HS.bg, border: '1px solid ' + HS.line, padding: '4px 8px', borderRadius: 999, ...hsText.body, fontSize: 10, fontWeight: 600 }}>{t}</span>
                ))}
              </div>
              <button style={{ marginTop: 12, background: 'transparent', border: '1px solid ' + HS.line, color: HS.inkSoft, padding: '6px 12px', borderRadius: 999, ...hsText.body, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3" stroke={HS.inkSoft} strokeWidth="2" strokeLinecap="round"/><path d="M18 3v4h-4M6 21v-4h4" stroke={HS.inkSoft} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Featured drop */}
        <div style={{ marginTop: 18, background: HS.ink, color: '#fff', borderRadius: 22, padding: 18, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -8, top: -8, fontSize: 90, opacity: 0.15, transform: 'rotate(-12deg)' }}>🎃</div>
          <div style={{ ...hsText.mono, fontSize: 10, color: HS.ochre, textTransform: 'uppercase', letterSpacing: '0.14em' }}>New this week</div>
          <div style={{ ...hsText.display, fontSize: 22, marginTop: 4, fontWeight: 700, letterSpacing: '-0.02em' }}>Harvest Drop</div>
          <p style={{ ...hsText.body, fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4, maxWidth: 220 }}>Eight new looks for autumn. Buy the bundle, save 30%.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
            <button style={{ background: HS.ochre, color: HS.ink, border: 'none', padding: '8px 14px', borderRadius: 999, ...hsText.body, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Get bundle —
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M21 3c-7 0-11 5-12 9-1 4 0 8 0 9h2c0-3 1-7 3-10s5-5 7-8z" fill={HS.ink}/></svg>
                900
              </span>
            </button>
            <span style={{ ...hsText.mono, fontSize: 10, color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>1,280</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginTop: 22, overflowX: 'auto', paddingBottom: 2 }}>
          {tabs.map(t => {
            const isActive = t.id === activeTab;
            return (
              <button key={t.id} style={{
                flexShrink: 0,
                background: isActive ? HS.ink : HS.surface,
                color: isActive ? '#fff' : HS.inkSoft,
                border: '1px solid ' + (isActive ? HS.ink : HS.line),
                padding: '7px 14px', borderRadius: 999,
                ...hsText.body, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>{t.label}</button>
            );
          })}
        </div>

        {/* Items grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          {items.map((it, i) => <ItemCard key={i} item={it}/>)}
        </div>

        <div style={{ height: 24 }} />
      </div>

      <HSBottomNav active="shop" />
    </div>
  );
}

window.HarvestShop = HarvestShop;
