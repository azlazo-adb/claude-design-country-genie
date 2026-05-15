// === Dataset Catalog (Grid + Cards + Country drilldown) ===

const { useState: useGridState, useMemo: useGridMemo } = React;

// ---- Helpers ----------------------------------------------------------------

// Determine which of our DMC countries a dataset covers. With wide-coverage
// datasets (200+ countries) all 6 are in scope; for narrower ones we slice.
const datasetCountries = (ds, COUNTRIES) => {
  const ids = Object.keys(COUNTRIES);
  // ADB regional flagships cover all DMCs; everything else covers all 6.
  if (ds.countries < 50) return ids;
  return ids;
};

// Synthetic "primary indicator" headline value per country for a dataset.
// Deterministic from ds.id + country code so it's stable.
const primarySnapshot = (ds, country) => {
  const seed = (ds.id + country.code).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (n) => ((seed * 9301 + 49297 + n * 233) % 233280) / 233280;
  const r = rng(1);
  switch (ds.dim) {
    case 'economic':     return { label: 'GDP growth', value: (r * 8 - 1).toFixed(1) + '%' };
    case 'social':       return { label: 'HDI rank',   value: '#' + Math.round(60 + r * 130) };
    case 'environmental':return { label: 'CRI score',  value: (r * 60 + 5).toFixed(0) };
    case 'institutional':return { label: 'WGI avg',    value: (r * 0.8 - 0.4).toFixed(2) };
    case 'political':    return { label: 'FSI score',  value: (r * 50 + 40).toFixed(1) };
    default:             return { label: 'Score',      value: (r * 100).toFixed(0) };
  }
};

const downloadDataset = (ds, pub, dim) => {
  const rows = [['Field','Value']];
  rows.push(['ID', ds.id]);
  rows.push(['Name', ds.name]);
  rows.push(['Description', ds.desc]);
  rows.push(['Publisher', pub?.name || ds.pub]);
  rows.push(['Dimension', dim?.label || ds.dim]);
  rows.push(['Indicators', ds.count]);
  rows.push(['Countries', ds.countries]);
  rows.push(['Frequency', ds.freq]);
  rows.push(['Last Updated', ds.updated]);
  rows.push(['Tags', (ds.tags || []).join('; ')]);
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${ds.id}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const DownloadIconBtn = ({ ds, pub, dim, size = 'sm' }) => (
  <span role="button" tabIndex={0}
    onClick={(e) => { e.stopPropagation(); downloadDataset(ds, pub, dim); }}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); downloadDataset(ds, pub, dim); } }}
    title="Download dataset (CSV)"
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size === 'sm' ? 24 : 28, height: size === 'sm' ? 24 : 28,
      borderRadius: 6, background: 'var(--indigo-soft)',
      border: '1px solid var(--indigo-line)',
      color: 'var(--indigo)', cursor: 'pointer', flexShrink: 0,
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(123,140,255,0.22)'}
    onMouseLeave={e => e.currentTarget.style.background = 'var(--indigo-soft)'}>
    <Icon name="download" size={size === 'sm' ? 12 : 13}/>
  </span>
);

// ---- Single dataset row / card ----------------------------------------------

// Column template kept in one place so header + rows can never drift.
const GRID_COLS = '1.6fr 110px 110px 100px 100px 110px 36px';

const DatasetRow = ({ ds, pub, dim, onOpen }) => (
  <div onClick={() => onOpen(ds)} style={{
    display: 'grid', gridTemplateColumns: GRID_COLS,
    gap: 14, alignItems: 'center', textAlign: 'left',
    padding: '12px 16px', background: 'transparent',
    borderTop: '1px solid var(--line)',
    color: 'var(--text-0)', cursor: 'pointer',
  }}
  onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-tint)'}
  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{ds.name}</div>
      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ds.desc}</div>
    </div>
    <span className="badge" style={{ background: pub.color + '24', color: pub.color, justifySelf: 'start' }}>{pub.short}</span>
    <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{dim.label}</span>
    <span className="mono" style={{ fontSize: 11, color: 'var(--text-1)' }}>{ds.count}</span>
    <span className="mono" style={{ fontSize: 11, color: 'var(--text-2)' }}>{ds.countries}</span>
    <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{ds.updated}</span>
    <DownloadIconBtn ds={ds} pub={pub} dim={dim}/>
  </div>
);

const DatasetCard = ({ ds, pub, dim, onOpen }) => (
  <div onClick={() => onOpen(ds)} className="panel-flat" style={{
    padding: 16, textAlign: 'left', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', gap: 12,
    transition: 'all 0.15s', color: 'var(--text-0)',
  }}
  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--indigo-line)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
      <span className="badge" style={{ background: pub.color + '24', color: pub.color }}>{pub.short}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-3)' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }}/>
          Updated {ds.updated}
        </span>
        <DownloadIconBtn ds={ds} pub={pub} dim={dim}/>
      </div>
    </div>

    <div>
      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>{ds.name}</div>
      <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{ds.desc}</div>
    </div>

    <div style={{
      height: 50, padding: 8, borderRadius: 6,
      background: 'var(--inset-bg)',
      position: 'relative', overflow: 'hidden',
    }}>
      <svg width="100%" height="100%" viewBox="0 0 200 34" preserveAspectRatio="none">
        {[...Array(20)].map((_, i) => {
          const h = 6 + Math.sin(i * 0.7 + ds.id.length) * 8 + Math.cos(i * 1.1) * 6 + 14;
          return (
            <rect key={i} x={i * 10 + 1} y={34 - h} width="7" height={h}
                  fill={pub.color} opacity={0.35 + (i / 30)}/>
          );
        })}
      </svg>
    </div>

    <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-2)' }}>
      <span><strong className="mono" style={{ color: 'var(--text-0)' }}>{ds.count}</strong> indicators</span>
      <span><strong className="mono" style={{ color: 'var(--text-0)' }}>{ds.countries}</strong> countries</span>
      <span style={{ marginLeft: 'auto', color: 'var(--text-3)' }}>{ds.freq}</span>
    </div>

    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      <span className="badge" style={{ background: 'var(--hover-tint)', color: 'var(--text-2)' }}>{dim.label}</span>
      {ds.tags.map(t => (
        <span key={t} className="badge" style={{ background: 'var(--hover-tint)', color: 'var(--text-3)' }}>#{t}</span>
      ))}
    </div>
  </div>
);

// ---- Dataset → Country drilldown -------------------------------------------

const DatasetCountryDrilldown = ({ ds, pub, dim, onClose, onSelectCountry }) => {
  const { COUNTRIES } = window.GenieData;
  const ids = datasetCountries(ds, COUNTRIES);
  const [hoverId, setHoverId] = useGridState(null);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--scrim)',
      backdropFilter: 'blur(4px)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={onClose}>
      <div className="panel" onClick={e => e.stopPropagation()} style={{
        width: 'min(960px, 100%)', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'fade-in 0.2s ease both',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 18px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className="badge" style={{ background: pub.color + '24', color: pub.color }}>{pub.short}</span>
                <span className="badge" style={{ background: 'var(--hover-tint)', color: 'var(--text-2)' }}>
                  <Icon name={dim.icon} size={10} style={{ marginRight: 3 }}/>{dim.label}
                </span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{ds.id.toUpperCase()}</span>
              </div>
              <div className="t-display-sm">
                {ds.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 6, lineHeight: 1.55, maxWidth: 720 }}>
                {ds.desc}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <DownloadIconBtn ds={ds} pub={pub} dim={dim} size="md"/>
              <button onClick={onClose} title="Close" style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'var(--bg-2)', border: '1px solid var(--line)',
                color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="close" size={14}/>
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'flex', gap: 28, marginTop: 16 }}>
            <Stat label="Indicators" value={ds.count}/>
            <Stat label="Total countries" value={ds.countries}/>
            <Stat label="DMCs in scope" value={ids.length} accent/>
            <Stat label="Frequency" value={ds.freq}/>
            <Stat label="Last updated" value={ds.updated}/>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div className="t-eyebrow">
              Country coverage · ADB DMCs
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
              Click a country to focus the explorer on it.
            </div>
          </div>

          {/* Country table */}
          <div className="panel-flat" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="t-eyebrow" style={{ display: 'grid', gridTemplateColumns: '40px 1.4fr 90px 1.8fr 1fr',
              gap: 14, padding: '10px 16px' }}>
              <span></span>
              <span>Country</span>
              <span>Code</span>
              <span>Region</span>
              <span>{primarySnapshot(ds, { code: 'XXX' }).label}</span>
            </div>
            {ids.map(id => {
              const c = COUNTRIES[id];
              const snap = primarySnapshot(ds, c);
              return (
                <button key={id}
                  onClick={() => { onSelectCountry && onSelectCountry(id); onClose(); }}
                  onMouseEnter={() => setHoverId(id)}
                  onMouseLeave={() => setHoverId(null)}
                  style={{
                    display: 'grid', gridTemplateColumns: '40px 1.4fr 90px 1.8fr 1fr',
                    gap: 14, padding: '14px 16px', alignItems: 'center', textAlign: 'left',
                    background: hoverId === id ? 'var(--hover-tint)' : 'transparent',
                    border: 'none', borderTop: '1px solid var(--line)',
                    color: 'var(--text-0)', width: '100%', cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}>
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{c.flag}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.code}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.region} · {c.income}</span>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{snap.value}</span>
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div style={{
            marginTop: 14, padding: 12, borderRadius: 8,
            background: 'var(--indigo-soft)', border: '1px solid var(--indigo-line)',
            fontSize: 11, color: 'var(--text-1)', lineHeight: 1.55,
          }}>
            <strong style={{ color: 'var(--indigo)' }}>Coverage scope.</strong>{' '}
            This dataset declares <span className="mono">{ds.countries}</span> countries globally.
            The table above shows the <span className="mono">{ids.length}</span> ADB developing
            member countries currently loaded in the explorer with their headline value for
            this dataset's primary indicator.
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span className="t-eyebrow">{label}</span>
    <span className="mono" style={{
      fontSize: 16, fontWeight: 600, marginTop: 2,
      color: accent ? 'var(--indigo)' : 'var(--text-0)',
    }}>{value}</span>
  </div>
);

// ---- Catalog view ----------------------------------------------------------

const DatasetGridView = ({ publisher, selectedCountry, onSelectCountry }) => {
  const { DATASETS, PUBLISHERS, DIMENSIONS, COUNTRIES } = window.GenieData;
  const [view, setView] = useGridState('grid'); // grid (table) is now default
  const [search, setSearch] = useGridState('');
  const [filterDim, setFilterDim] = useGridState(null);
  const [sort, setSort] = useGridState('updated');
  const [openDataset, setOpenDataset] = useGridState(null);

  // Source & country come from the global subbar.
  // 'adb' (ADB Curated) is the aggregator — show all publishers.
  const filterPub = publisher && publisher !== 'adb' ? publisher : null;
  const filterCountries = selectedCountry ? [selectedCountry] : [];

  // Add globally-selected country into the chip set when set externally.
  let datasets = DATASETS.filter(ds => {
    if (search) {
      const q = search.toLowerCase();
      const inName = ds.name.toLowerCase().includes(q);
      const inDesc = ds.desc.toLowerCase().includes(q);
      const inTags = (ds.tags || []).some(t => t.toLowerCase().includes(q));
      const inPub = (PUBLISHERS.find(p => p.id === ds.pub)?.name || '').toLowerCase().includes(q);
      if (!(inName || inDesc || inTags || inPub)) return false;
    }
    if (filterPub && ds.pub !== filterPub) return false;
    if (filterDim && ds.dim !== filterDim) return false;
    if (filterCountries.length > 0) {
      const ids = datasetCountries(ds, COUNTRIES);
      if (!filterCountries.some(c => ids.includes(c))) return false;
    }
    return true;
  });

  if (sort === 'updated') datasets = [...datasets].sort((a,b) => b.updated.localeCompare(a.updated));
  if (sort === 'count') datasets = [...datasets].sort((a,b) => b.count - a.count);
  if (sort === 'name') datasets = [...datasets].sort((a,b) => a.name.localeCompare(b.name));

  const country = null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div className="t-display-md">
              Dataset Catalog
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
              {filterCountries.length > 0
                ? <>Browsing {datasets.length} of {DATASETS.length} datasets covering {filterCountries.length === 1
                    ? <strong style={{ color: 'var(--text-0)' }}>{COUNTRIES[filterCountries[0]].flag} {COUNTRIES[filterCountries[0]].name}</strong>
                    : <strong style={{ color: 'var(--text-0)' }}>{filterCountries.length} countries</strong>}.</>
                : <>Browse, compare and discover {DATASETS.length} indicator collections from {PUBLISHERS.length} publisher groups.</>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setView('grid')} title="Grid (table) view" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 10px', borderRadius: 6,
              background: view === 'grid' ? 'var(--indigo-soft)' : 'transparent',
              border: '1px solid', borderColor: view === 'grid' ? 'var(--indigo-line)' : 'var(--line)',
              color: view === 'grid' ? 'var(--indigo)' : 'var(--text-2)',
              fontSize: 11, fontFamily: 'inherit', fontWeight: 500,
            }}><Icon name="layers" size={13}/>Grid</button>
            <button onClick={() => setView('cards')} title="Card view" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 10px', borderRadius: 6,
              background: view === 'cards' ? 'var(--indigo-soft)' : 'transparent',
              border: '1px solid', borderColor: view === 'cards' ? 'var(--indigo-line)' : 'var(--line)',
              color: view === 'cards' ? 'var(--indigo)' : 'var(--text-2)',
              fontSize: 11, fontFamily: 'inherit', fontWeight: 500,
            }}><Icon name="grid" size={13}/>Cards</button>
          </div>
        </div>

        {/* Search & filters */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', background: 'var(--bg-2)', border: '1px solid var(--line)',
            borderRadius: 8, minWidth: 280, flex: 1, maxWidth: 380 }}>
            <Icon name="search" size={14} style={{ color: 'var(--text-3)' }}/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search datasets, indicators, tags, country…"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-0)', fontSize: 13, fontFamily: 'inherit' }}/>
            {search && (
              <button onClick={() => setSearch('')} style={{
                padding: 0, background: 'transparent', border: 'none', color: 'var(--text-3)',
                display: 'flex', cursor: 'pointer',
              }}><Icon name="close" size={12}/></button>
            )}
          </div>

          <div style={{ flex: 1 }}/>

          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            padding: '6px 10px', background: 'var(--bg-2)', border: '1px solid var(--line)',
            borderRadius: 6, color: 'var(--text-0)', fontSize: 12, fontFamily: 'inherit',
          }}>
            <option value="updated">Recently updated</option>
            <option value="count">Most indicators</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>

        {/* Dimension chips row */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', marginRight: 4 }}>Dimension:</span>
          <button onClick={() => setFilterDim(null)} className="badge" style={{
            padding: '4px 10px',
            background: !filterDim ? 'var(--hover-tint-3)' : 'transparent',
            color: !filterDim ? 'var(--text-0)' : 'var(--text-2)',
            border: '1px solid var(--line)', cursor: 'pointer',
          }}>All</button>
          {DIMENSIONS.map(d => (
            <button key={d.id} onClick={() => !d.soon && setFilterDim(d.id === filterDim ? null : d.id)}
              disabled={d.soon}
              title={d.soon ? 'Coming soon' : ''}
              className="badge" style={{
              padding: '4px 10px',
              background: filterDim === d.id ? d.color + '24' : 'transparent',
              color: d.soon ? 'var(--text-3)' : (filterDim === d.id ? d.color : 'var(--text-2)'),
              border: '1px solid', borderColor: filterDim === d.id ? d.color + '50' : 'var(--line)',
              cursor: d.soon ? 'not-allowed' : 'pointer',
              opacity: d.soon ? 0.45 : 1,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Icon name={d.icon} size={11}/>
              {d.label}
            </button>
          ))}

        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 24px 24px' }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', margin: '8px 0 12px' }}>
          {datasets.length} {datasets.length === 1 ? 'dataset' : 'datasets'}
          {filterCountries.length > 0 && (
            <> · covering {filterCountries.length === 1
              ? <strong style={{ color: 'var(--text-1)' }}>{COUNTRIES[filterCountries[0]].name}</strong>
              : <strong style={{ color: 'var(--text-1)' }}>{filterCountries.length} countries</strong>}</>
          )}
        </div>

        {datasets.length === 0 ? (
          <div className="panel-flat" style={{
            padding: 32, textAlign: 'center', color: 'var(--text-2)',
          }}>
            <Icon name="search" size={28} style={{ color: 'var(--text-3)', marginBottom: 10 }}/>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', marginBottom: 4 }}>No datasets match.</div>
            <div style={{ fontSize: 12 }}>Try removing a filter or clearing the search.</div>
          </div>
        ) : view === 'cards' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {datasets.map(ds => {
              const pub = PUBLISHERS.find(p => p.id === ds.pub);
              const dim = DIMENSIONS.find(d => d.id === ds.dim);
              return <DatasetCard key={ds.id} ds={ds} pub={pub} dim={dim} onOpen={setOpenDataset}/>;
            })}
          </div>
        ) : (
          <div className="panel-flat" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="t-eyebrow" style={{ display: 'grid', gridTemplateColumns: GRID_COLS,
              gap: 14, padding: '10px 16px',
              background: 'var(--bg-3)' }}>
              <span>Dataset</span>
              <span>Publisher Group</span>
              <span>Dimension</span>
              <span>Indicators</span>
              <span>Coverage</span>
              <span>Updated</span>
              <span></span>
            </div>
            {datasets.map(ds => {
              const pub = PUBLISHERS.find(p => p.id === ds.pub);
              const dim = DIMENSIONS.find(d => d.id === ds.dim);
              return <DatasetRow key={ds.id} ds={ds} pub={pub} dim={dim} onOpen={setOpenDataset}/>;
            })}
          </div>
        )}
      </div>

      {/* Dataset → Country drilldown */}
      {openDataset && (() => {
        const pub = PUBLISHERS.find(p => p.id === openDataset.pub);
        const dim = DIMENSIONS.find(d => d.id === openDataset.dim);
        return (
          <DatasetCountryDrilldown
            ds={openDataset} pub={pub} dim={dim}
            onClose={() => setOpenDataset(null)}
            onSelectCountry={onSelectCountry}/>
        );
      })()}
    </div>
  );
};

window.DatasetGridView = DatasetGridView;
