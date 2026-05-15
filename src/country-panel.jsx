// === Country Panel — left side, replaces old country dimensions card ===

const { useState: useCPState } = React;

const Sparkline = ({ data, color = '#7b8cff', w = 80, h = 22, fill = true }) => {
  if (!data || !data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} className="spark">
      {fill && <path d={area} fill={color} opacity="0.18"/>}
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2.2" fill={color}/>
    </svg>
  );
};

const Citation = ({ refs, idx }) => {
  return (
    <span className="cite" title={refs && refs[idx-1] && refs[idx-1].label}>
      {idx}
    </span>
  );
};

const RiskBadge = ({ risk, size = 'sm' }) => {
  const cls = {
    'very high': 'risk-very-high',
    'high': 'risk-high',
    'moderate': 'risk-moderate',
    'low': 'risk-low',
  }[risk] || 'risk-moderate';
  return <span className={`badge ${cls}`} style={size === 'lg' ? { padding: '4px 10px', fontSize: 12 } : {}}>{risk}</span>;
};

const DimensionRow = ({ dim, data, expanded, onToggle, onDrilldown, dimColor, refs, indicators, publisher, publisherName }) => {
  const isComing = !data || dim.soon;
  const noCoverage = !isComing && (!indicators || indicators.length === 0);
  return (
    <div style={{
      borderRadius: 10,
      background: expanded ? 'rgba(123,140,255,0.06)' : 'transparent',
      border: expanded ? '1px solid rgba(123,140,255,0.18)' : '1px solid transparent',
      transition: 'all 0.2s',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => !isComing && onToggle()}
        disabled={isComing}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', background: 'transparent', border: 'none',
          color: isComing ? 'var(--text-3)' : 'var(--text-0)',
          opacity: isComing ? 0.5 : 1,
          cursor: isComing ? 'default' : 'pointer',
          textAlign: 'left',
        }}>
        <Icon name="chevronRight" size={14} style={{
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s',
          color: 'var(--text-3)',
        }}/>
        <Icon name={dim.icon} size={16} style={{ color: dimColor }}/>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{dim.label}</span>
        {isComing
          ? <span className="badge" style={{ background: 'var(--hover-tint-2)', color: 'var(--text-3)' }}>Coming soon</span>
          : noCoverage
            ? <span className="badge" style={{ background: 'var(--hover-tint-2)', color: 'var(--text-3)' }}>Not in {publisherName}</span>
            : <span className="mono" style={{
                fontSize: 10, color: 'var(--text-3)', padding: '2px 6px',
                background: 'var(--hover-tint)', borderRadius: 999,
              }}>
                {indicators.length}
              </span>}
      </button>

      {expanded && data && (
        <div className="fade-in" style={{ padding: '4px 14px 14px 38px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.55, marginBottom: 12 }}>
            {data.summary}
          </div>

          {noCoverage ? (
            <div style={{
              padding: 12, borderRadius: 8, background: 'var(--inset-bg)',
              fontSize: 11, color: 'var(--text-2)', lineHeight: 1.55,
            }}>
              {publisherName} doesn't currently carry indicators for this dimension. Switch the Source above to load data from another publisher.
            </div>
          ) : (
          <>
          {/* Time series mini-chart */}
          <div style={{ marginBottom: 12, padding: 10, background: 'var(--inset-bg)', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span className="t-eyebrow">
                6-Year Trend
              </span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>2019–2024</span>
            </div>
            <Sparkline data={indicators[0] && indicators[0].sparkline} color={dimColor} w={210} h={36}/>
          </div>

          {/* Key indicators */}
          <div className="t-eyebrow" style={{ marginBottom: 6 }}>
            Key Indicators
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
            {indicators.slice(0, 3).map(ind => {
              const v = ind.values[publisher] ?? ind.values.adb ?? Object.values(ind.values)[0];
              return (
                <div key={ind.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-1)' }}>• {ind.name}</span>
                  <span className="mono" style={{ color: 'var(--text-0)', fontWeight: 600 }}>{v}{ind.unit}</span>
                </div>
              );
            })}
          </div>

          <button onClick={onDrilldown} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '8px 12px', background: 'rgba(123,140,255,0.1)', border: '1px solid rgba(123,140,255,0.32)',
            borderRadius: 8, color: 'var(--text-0)', fontSize: 12, fontWeight: 500,
          }}>
            <Icon name="external" size={13}/>
            View Detailed Indicators
          </button>

          <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 10, lineHeight: 1.5 }}>
            Sources: {indicators[0] && indicators[0].sources.slice(0, 2).map((s, i) => (
              <span key={i}>{i > 0 && ' · '}<span style={{ color: 'var(--text-2)' }}>{s}</span></span>
            ))}
          </div>
          </>
          )}
        </div>
      )}
    </div>
  );
};

const CountryPanel = ({ country, expanded, onToggle, onDrilldown, publisher = 'adb' }) => {
  const { DIMENSIONS, INDICATORS, PUBLISHERS } = window.GenieData;
  const publisherName = (PUBLISHERS.find(p => p.id === publisher) || {}).short || publisher.toUpperCase();
  return (
    <div className="panel" style={{
      width: 320, maxHeight: '100%',
      display: 'flex', flexDirection: 'column',
      borderColor: 'rgba(123,140,255,0.4)',
      borderLeft: '3px solid var(--indigo)',
      overflow: 'hidden',
    }}>
      {/* Fixed header */}
      <div style={{ padding: '16px 16px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.3 }}>
              {country.name}
            </h2>
          </div>
          <span className="mono" style={{ color: 'var(--text-3)', fontSize: 11 }}>{country.code}</span>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          <span className="badge badge-blue">{country.region}</span>
          <span className="badge badge-purple">{country.income}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 14 }}>
          Pop: <span style={{ color: 'var(--text-1)' }}>{country.population}</span>
          <span style={{ margin: '0 6px', color: 'var(--text-3)' }}>·</span>
          GDP: <span style={{ color: 'var(--text-1)' }}>{country.gdp}</span>
        </div>

        <div style={{ height: 1, background: 'var(--line)', margin: '0 -16px 14px' }}/>

        <div className="t-eyebrow" style={{ marginBottom: 10 }}>
          Country Dimensions
        </div>
      </div>

      {/* Scrollable body — only the dimensions list scrolls, the card stays put */}
      <div className="scroll-visible" style={{
        flex: 1, minHeight: 0, overflowY: 'auto',
        padding: '0 12px 0 16px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 14 }}>
          {DIMENSIONS.map(dim => (
            <DimensionRow
              key={dim.id}
              dim={dim}
              data={country.dimensions[dim.id]}
              dimColor={dim.color}
              expanded={expanded === dim.id}
              indicators={window.GenieData.indicatorsFor(publisher, dim.id)}
              publisher={publisher}
              publisherName={publisherName}
              onToggle={() => onToggle(expanded === dim.id ? null : dim.id)}
              onDrilldown={() => onDrilldown(dim.id)}
            />
          ))}
        </div>
      </div>

      {/* Fixed footer */}
      <div style={{ padding: '0 16px 14px', flexShrink: 0 }}>
        <div style={{ height: 1, background: 'var(--line)', margin: '0 -16px 10px' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--text-3)' }}>
          <span>Latest: 2024</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}/>
            Live
          </span>
        </div>
      </div>
    </div>
  );
};

window.CountryPanel = CountryPanel;
window.Sparkline = Sparkline;
window.RiskBadge = RiskBadge;
