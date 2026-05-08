// === Main App — wires everything together ===

const { useState: useAppState, useEffect: useAppEffect } = React;

// ---- Layers panel (overlay on map) ----
const LayersPanel = ({ active, onChange, mapStyle, onMapStyle }) => {
  const layers = [
    { id: 'risk', label: 'Risk Heatmap', desc: 'Aggregated dimension risk', type: 'vector', icon: 'vector' },
    { id: 'projects', label: 'ADB Projects', desc: 'Active project locations', type: 'vector', icon: 'pin' },
    { id: 'climate', label: 'Climate Exposure', desc: 'Disaster risk markers', type: 'vector', icon: 'leaf' },
    { id: 'infra', label: 'Infra Corridors', desc: 'Cross-border connectivity', type: 'vector', icon: 'network' },
    { id: 'pop_density', label: 'Population Density', desc: 'Raster overlay (preview)', type: 'raster', icon: 'raster' },
    { id: 'air_quality', label: 'Air Quality (PM2.5)', desc: 'Raster heatmap (preview)', type: 'raster', icon: 'raster' },
  ];
  const styles = [
    { id: 'dotted', label: 'Dotted halos', desc: 'Region implied by dotted ring' },
    { id: 'hex', label: 'Hex grid', desc: 'No borders — only density' },
    { id: 'dots', label: 'Dot density', desc: 'Stippled regions' },
    { id: 'choropleth', label: 'Soft fills', desc: 'Feathered, no hard line' },
    { id: 'glow', label: 'Glow only', desc: 'Pure radial, label-led' },
    { id: 'raster', label: 'Raster preview', desc: 'Heatmap tile demo' },
  ];

  return (
    <div className="panel" style={{ width: 280, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="layers" size={14} style={{ color: 'var(--text-2)' }}/>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Layers</div>
        </div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{active.length} active</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
        {layers.map(l => {
          const isActive = active.includes(l.id);
          return (
            <button key={l.id} onClick={() => {
              onChange(isActive ? active.filter(x => x !== l.id) : [...active, l.id]);
            }} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', background: isActive ? 'rgba(123,140,255,0.08)' : 'transparent',
              border: '1px solid', borderColor: isActive ? 'rgba(123,140,255,0.24)' : 'transparent',
              borderRadius: 8, color: 'var(--text-0)', textAlign: 'left',
              fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
            }}>
              <Icon name={l.icon} size={13} style={{ color: isActive ? 'var(--indigo)' : 'var(--text-3)' }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{l.label}</span>
                  <span className="badge" style={{
                    background: l.type === 'raster' ? 'rgba(245,178,82,0.16)' : 'rgba(123,140,255,0.16)',
                    color: l.type === 'raster' ? '#fbcb83' : '#9aaaff',
                    fontSize: 9, padding: '1px 5px',
                  }}>{l.type}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{l.desc}</div>
              </div>
              <span style={{
                width: 28, height: 16, borderRadius: 999, padding: 2,
                background: isActive ? 'var(--indigo)' : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center',
                transition: 'background 0.15s',
              }}>
                <span style={{
                  width: 12, height: 12, borderRadius: '50%', background: 'white',
                  transform: isActive ? 'translateX(12px)' : 'translateX(0)',
                  transition: 'transform 0.15s',
                }}/>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ---- Map View Composition ----
const MapView = ({
  selectedCountry, onSelect, layers, mapStyle, expandedDim,
  onExpand, onDrilldown, publisher, role, chatOpen,
}) => {
  const [layersOpen, setLayersOpen] = useAppState(false);
  const country = selectedCountry ? window.GenieData.COUNTRIES[selectedCountry] : null;
  const riskByCountry = {};
  Object.keys(window.GenieData.COUNTRIES).forEach(k => {
    const c = window.GenieData.COUNTRIES[k];
    // Aggregate worst-risk for color
    const order = ['low', 'moderate', 'high', 'very high'];
    let worst = 0;
    Object.values(c.dimensions).forEach(d => {
      const i = order.indexOf(d.risk);
      if (i > worst) worst = i;
    });
    riskByCountry[k] = order[worst];
  });

  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
      {/* The map */}
      <StylizedMap
        selected={selectedCountry}
        style={mapStyle}
        showProjects={layers.includes('projects')}
        showClimate={layers.includes('climate')}
        showInfra={layers.includes('infra')}
        riskByCountry={riskByCountry}
        onSelect={onSelect}
      />

      {/* Country panel — left, sits above legend with breathing room. Card itself is fixed; its body scrolls internally. */}
      {country && (
        <div style={{
          position: 'absolute', top: 16, left: 16, zIndex: 8,
          maxHeight: 'calc(100% - 32px - 110px)',
          display: 'flex',
        }}>
          <CountryPanel country={country} expanded={expandedDim} onToggle={onExpand}
            onDrilldown={onDrilldown} publisher={publisher}/>
        </div>
      )}

      {/* Layers panel — right (collapsible button when chat is open) */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 5 }}>
        {chatOpen ? (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setLayersOpen(!layersOpen)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px',
              background: 'var(--panel-grad)', backdropFilter: 'blur(16px)',
              border: '1px solid var(--line-2)', borderRadius: 10,
              color: layersOpen ? 'var(--indigo)' : 'var(--text-0)',
              fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            }}>
              <Icon name="layers" size={14}/>
              Layers
              <span className="mono" style={{
                padding: '1px 6px', background: 'rgba(123,140,255,0.18)',
                color: 'var(--indigo)', borderRadius: 4, fontSize: 10,
              }}>{layers.length}</span>
            </button>
            {layersOpen && (
              <>
                <div onClick={() => setLayersOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 4 }}/>
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 6 }}>
                  <LayersPanel active={layers} onChange={l => window.__setLayers && window.__setLayers(l)}
                    mapStyle={mapStyle} onMapStyle={s => window.__setMapStyle && window.__setMapStyle(s)}/>
                </div>
              </>
            )}
          </div>
        ) : (
          <LayersPanel active={layers} onChange={l => window.__setLayers && window.__setLayers(l)}
            mapStyle={mapStyle} onMapStyle={s => window.__setMapStyle && window.__setMapStyle(s)}/>
        )}
      </div>

      {/* Map legend — bottom-left */}
      <div className="panel" style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 5,
        padding: 12, fontSize: 11,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
          Aggregate Risk
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Very High', color: '#ef4444' },
            { label: 'High', color: '#f59e0b' },
            { label: 'Moderate', color: '#eab308' },
            { label: 'Low', color: '#22c55e' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }}/>
              <span style={{ color: 'var(--text-1)' }}>{r.label}</span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)',
          fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace",
        }}>
          {publisher.toUpperCase()} · {role}
        </div>
      </div>
    </div>
  );
};

// =========================
// Header chrome bits
// =========================
const BrandMark = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: 'linear-gradient(135deg, #5468ee, #7b8cff)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name="globe" size={16} style={{ color: 'white' }}/>
    </div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>Country Genie</div>
      <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>Asia-Pacific Indicator Explorer</div>
    </div>
  </div>
);

const Divider = () => (
  <div style={{ width: 1, height: 24, background: 'var(--line)' }}/>
);

const ChatToggleBtn = ({ open, onClick }) => (
  <button onClick={onClick} title="Toggle chat" style={{
    padding: 8, borderRadius: 8,
    background: open ? 'var(--indigo-soft)' : 'var(--bg-2)',
    border: '1px solid', borderColor: open ? 'var(--indigo-line)' : 'var(--line)',
    color: open ? 'var(--indigo)' : 'var(--text-2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <Icon name="ai" size={16}/>
  </button>
);

const UserAvatar = () => {
  const [open, setOpen] = React.useState(false);
  const initials = 'LR';
  const name = 'Lina Rana';
  const role = 'Country Economist';
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} title={`${name} · ${role}`} style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'linear-gradient(135deg, #4dd9c4, #5468ee)',
        border: '1px solid var(--line-2)', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600, letterSpacing: 0.3, cursor: 'pointer',
      }}>
        {initials}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 60 }}/>
          <div className="panel" style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 240, padding: 12, zIndex: 61,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4dd9c4, #5468ee)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 13, fontWeight: 600,
              }}>{initials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)' }}>{name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{role} · ADB</div>
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--line)', margin: '8px -12px' }}/>
            {[
              { icon: 'user', label: 'Profile & preferences' },
              { icon: 'bookmark', label: 'Saved countries' },
              { icon: 'sliders', label: 'Workspace settings' },
              { icon: 'external', label: 'Sign out' },
            ].map(item => (
              <button key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '8px 6px', background: 'transparent',
                border: 'none', borderRadius: 6, color: 'var(--text-1)',
                fontSize: 12, fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-tint)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Icon name={item.icon} size={13} style={{ color: 'var(--text-3)' }}/>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ThemeToggle = ({ value, onChange }) => {
  const dark = value === 'dark';
  return (
    <button onClick={() => onChange(dark ? 'light' : 'dark')}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        padding: 8, borderRadius: 8,
        background: 'var(--bg-2)', border: '1px solid var(--line)',
        color: 'var(--text-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-0)'; e.currentTarget.style.borderColor = 'var(--line-2)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--line)'; }}>
      <Icon name={dark ? 'sun' : 'moon'} size={16}/>
    </button>
  );
};

// =========================
// Context bar — Source (publisher) + Country search live here, not in header
// =========================
const ContextBar = ({ publisher, onPublisher, publisherStyle, country, onCountry, view, variant = 'subbar' }) => {
  const COUNTRIES = window.GenieData.COUNTRIES;
  const PUBLISHERS = window.GenieData.PUBLISHERS;
  const pub = PUBLISHERS.find(p => p.id === publisher);
  const c = COUNTRIES[country];

  const renderPublisher = () => {
    if (publisherStyle === 'chips')     return <PublisherChips value={publisher} onChange={onPublisher}/>;
    if (publisherStyle === 'segmented') return <PublisherSegmented value={publisher} onChange={onPublisher}/>;
    if (publisherStyle === 'stack')     return <PublisherStack value={publisher} onChange={onPublisher}/>;
    if (publisherStyle === 'matrix')    return null; // floating matrix
    return <PublisherDropdown value={publisher} onChange={onPublisher}/>;
  };

  // Common selectors block
  const selectors = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.6 }}>
          Source
        </span>
        {renderPublisher()}
      </div>
      <Divider/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: '0 1 auto' }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.6 }}>
          Country
        </span>
        <CountrySearch countries={COUNTRIES} value={country} onChange={onCountry}/>
      </div>
    </>
  );

  if (variant === 'header') {
    // Compact inline strip — no border, no background, no hint
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {selectors}
      </div>
    );
  }

  if (variant === 'floating') {
    // Floating card top-left over content
    return (
      <div className="panel" style={{
        position: 'absolute', top: 16, left: 16, zIndex: 12,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px',
      }}>
        {selectors}
      </div>
    );
  }

  // Default: full subbar
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '8px 18px',
      background: 'var(--bg-1)',
      borderBottom: '1px solid var(--line)',
    }}>
      {selectors}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-3)' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--indigo)', opacity: 0.7 }}/>
        {view === 'map' && <>Drives map focus, country panel & chat context</>}
        {view === 'dashboard' && <>Drives charts &amp; indicators</>}
        {view === 'grid' && <>Filters catalog to datasets covering {c ? c.name : 'this country'}</>}
      </div>
    </div>
  );
};

// =========================
// Top-level App
// =========================
const App = () => {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "viewSwitcher": "segmented",
    "publisherSelector": "dropdown",
    "contextLocation": "subbar",
    "mapStyle": "dotted",
    "role": "analyst",
    "drilldownAsPanel": false,
    "showAllCitations": true,
    "density": "comfortable"
  }/*EDITMODE-END*/;

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [view, setView] = useAppState('map');
  const [selectedCountry, setSelectedCountry] = useAppState('pakistan');
  const [expandedDim, setExpandedDim] = useAppState('economic');
  const [drilldown, setDrilldown] = useAppState(null);
  const [layers, setLayers] = useAppState(['risk', 'projects', 'climate']);
  const [chatOpen, setChatOpen] = useAppState(true);
  const [publisher, setPublisher] = useAppState('adb');
  const [theme, setTheme] = useAppState(() => {
    if (typeof localStorage === 'undefined') return 'dark';
    return localStorage.getItem('cg.theme') || 'dark';
  });

  useAppEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('cg.theme', theme); } catch (e) {}
  }, [theme]);

  // expose layer setter to map
  window.__setLayers = setLayers;
  window.__setMapStyle = (s) => setTweak('mapStyle', s);

  const country = selectedCountry ? window.GenieData.COUNTRIES[selectedCountry] : null;

  const role = t.role;

  // Header content varies based on view-switcher style
  const headerInline = !['rail', 'dock'].includes(t.viewSwitcher);

  const renderPublisherInline = () => {
    if (t.publisherSelector === 'dropdown') return <PublisherDropdown value={publisher} onChange={setPublisher}/>;
    if (t.publisherSelector === 'chips')    return <PublisherChips value={publisher} onChange={setPublisher}/>;
    if (t.publisherSelector === 'segmented')return <PublisherSegmented value={publisher} onChange={setPublisher}/>;
    if (t.publisherSelector === 'stack')    return <PublisherStack value={publisher} onChange={setPublisher}/>;
    return null;
  };

  const renderPublisherFloating = () => {
    if (t.publisherSelector === 'matrix') {
      return (
        <div style={{ position: 'absolute', top: 76, right: 312, zIndex: 12 }}>
          <PublisherMatrix value={publisher} onChange={setPublisher}/>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Left rail (only for rail variant) */}
        {t.viewSwitcher === 'rail' && (
          <ViewIconRail value={view} onChange={setView}/>
        )}

        {/* Main column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Top bar — chrome only: identity + view switcher + role + chat/theme */}
          {t.viewSwitcher !== 'tabs' ? (
            <div style={{
              padding: '12px 18px', borderBottom: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-1)',
            }}>
              {t.viewSwitcher !== 'rail' && <BrandMark/>}

              {t.viewSwitcher !== 'rail' && <Divider/>}

              {headerInline && t.viewSwitcher !== 'dock' && t.viewSwitcher !== 'rail' && (
                <ViewSwitcher variant={t.viewSwitcher} value={view} onChange={setView}/>
              )}

              {t.contextLocation === 'header' && (
                <>
                  <Divider/>
                  <ContextBar
                    variant="header"
                    publisher={publisher} onPublisher={setPublisher}
                    publisherStyle={t.publisherSelector}
                    country={selectedCountry} onCountry={setSelectedCountry}
                    view={view}/>
                </>
              )}

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                <RoleSwitcher value={role} onChange={(r) => setTweak('role', r)}/>
                <ThemeToggle value={theme} onChange={setTheme}/>
                <ChatToggleBtn open={chatOpen} onClick={() => setChatOpen(!chatOpen)}/>
                <div style={{ width: 1, height: 24, background: 'var(--line)', margin: '0 2px' }}/>
                <UserAvatar/>
              </div>
            </div>
          ) : (
            // Tabs variant: 2-row header (top: chrome, bottom: tabs)
            <>
              <div style={{
                padding: '10px 18px', borderBottom: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-1)',
              }}>
                <BrandMark/>
                {t.contextLocation === 'header' && (
                  <>
                    <Divider/>
                    <ContextBar
                      variant="header"
                      publisher={publisher} onPublisher={setPublisher}
                      publisherStyle={t.publisherSelector}
                      country={selectedCountry} onCountry={setSelectedCountry}
                      view={view}/>
                  </>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RoleSwitcher value={role} onChange={(r) => setTweak('role', r)}/>
                  <ThemeToggle value={theme} onChange={setTheme}/>
                  <ChatToggleBtn open={chatOpen} onClick={() => setChatOpen(!chatOpen)}/>
                  <div style={{ width: 1, height: 24, background: 'var(--line)', margin: '0 2px' }}/>
                  <UserAvatar/>
                </div>
              </div>
              <div style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--line)', padding: '0 18px' }}>
                <ViewTabs value={view} onChange={setView}/>
              </div>
            </>
          )}

          {/* Context bar — Source (publisher) + Country search; location is a tweak */}
          {t.contextLocation === 'subbar' && (
            <ContextBar
              publisher={publisher} onPublisher={setPublisher}
              publisherStyle={t.publisherSelector}
              country={selectedCountry} onCountry={setSelectedCountry}
              view={view}/>
          )}

          {/* Body */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
            {renderPublisherFloating()}

            {t.contextLocation === 'floating' && (
              <ContextBar
                variant="floating"
                publisher={publisher} onPublisher={setPublisher}
                publisherStyle={t.publisherSelector}
                country={selectedCountry} onCountry={setSelectedCountry}
                view={view}/>
            )}

            {view === 'map' && (
              <MapView
                selectedCountry={selectedCountry} onSelect={setSelectedCountry}
                layers={layers} mapStyle={t.mapStyle}
                expandedDim={expandedDim} onExpand={setExpandedDim}
                onDrilldown={setDrilldown} publisher={publisher} role={role}
                chatOpen={chatOpen}
              />
            )}
            {view === 'dashboard' && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <Dashboard country={country} publisher={publisher} role={role}
                  onDrilldown={setDrilldown} onSelectCountry={setSelectedCountry}/>
              </div>
            )}
            {view === 'grid' && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <DatasetGridView
                  publisher={publisher}
                  selectedCountry={selectedCountry}
                  onSelectCountry={setSelectedCountry}
                />
              </div>
            )}
          </div>
        </div>

        {/* Chat panel — full-height on the right, peer to main column */}
        {chatOpen && (
          <ChatPanel publisher={publisher} onClose={() => setChatOpen(false)}
            onCountryRef={(c) => setSelectedCountry(c)}/>
        )}
      </div>

      {/* Floating dock (only for dock variant) */}
      {t.viewSwitcher === 'dock' && (
        <ViewFloatingDock value={view} onChange={setView}/>
      )}

      {/* Drilldown */}
      {drilldown && !t.drilldownAsPanel && (
        <DrilldownModal country={country} dimensionId={drilldown}
          onClose={() => setDrilldown(null)} publisher={publisher}/>
      )}
      {drilldown && t.drilldownAsPanel && (
        <div style={{
          position: 'fixed', top: 0, right: 0, height: '100vh', zIndex: 100,
          boxShadow: '-12px 0 30px rgba(0,0,0,0.4)',
        }}>
          <DrilldownModal country={country} dimensionId={drilldown}
            onClose={() => setDrilldown(null)} publisher={publisher} asPanel/>
        </div>
      )}

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="View switcher">
          <TweakSelect label="Style" value={t.viewSwitcher} onChange={v => setTweak('viewSwitcher', v)}
            options={[
              { value: 'segmented', label: 'Segmented (header)' },
              { value: 'tabs', label: 'Tabs (under header)' },
              { value: 'pills', label: 'Inverted pills' },
              { value: 'command', label: 'Keyboard-cued buttons' },
              { value: 'dock', label: 'Floating bottom dock' },
              { value: 'rail', label: 'Left icon rail' },
            ]}/>
        </TweakSection>

        <TweakSection label="Source &amp; country position">
          <TweakSelect label="Where" value={t.contextLocation} onChange={v => setTweak('contextLocation', v)}
            options={[
              { value: 'subbar', label: 'Sub-bar under header' },
              { value: 'header', label: 'Inline in header' },
              { value: 'floating', label: 'Floating top-left card' },
            ]}/>
        </TweakSection>

        <TweakSection label="Publisher selector">
          <TweakSelect label="Style" value={t.publisherSelector} onChange={v => setTweak('publisherSelector', v)}
            options={[
              { value: 'dropdown', label: 'Header dropdown' },
              { value: 'chips', label: 'Chip rail' },
              { value: 'segmented', label: 'Segmented bar' },
              { value: 'stack', label: 'Current + others' },
              { value: 'matrix', label: 'Floating matrix card' },
            ]}/>
        </TweakSection>

        <TweakSection label="Map treatment">
          <TweakSelect label="Style" value={t.mapStyle} onChange={v => setTweak('mapStyle', v)}
            options={[
              { value: 'dotted', label: 'Dotted halos' },
              { value: 'hex', label: 'Hex grid' },
              { value: 'dots', label: 'Dot density' },
              { value: 'choropleth', label: 'Soft fills' },
              { value: 'glow', label: 'Glow only' },
              { value: 'raster', label: 'Raster heatmap' },
            ]}/>
        </TweakSection>

        <TweakSection label="Drilldown">
          <TweakToggle label="Open as side panel" value={t.drilldownAsPanel}
            onChange={v => setTweak('drilldownAsPanel', v)}/>
        </TweakSection>

        <TweakSection label="Role">
          <TweakSelect label="Role" value={t.role} onChange={v => setTweak('role', v)}
            options={[
              { value: 'general', label: 'General' },
              { value: 'analyst', label: 'Analyst' },
              { value: 'publisher', label: 'Publisher' },
            ]}/>
        </TweakSection>

        <TweakSection label="Quick actions">
          <TweakButton label="Open Economic Drilldown" onClick={() => setDrilldown('economic')}/>
          <TweakButton label="Switch to Dashboard" onClick={() => setView('dashboard')}/>
          <TweakButton label="Switch to Catalog" onClick={() => setView('grid')}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
