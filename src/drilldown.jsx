// === Drilldown Modal ===
// Opens when "Explore Detailed Indicators" is clicked.
// Per-row publisher source switcher.

const { useState: useDDState } = React;

const PublisherChip = ({ pub, active, onClick }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '4px 9px', borderRadius: 6, fontSize: 11, fontWeight: 500,
    background: active ? pub.color + '24' : 'rgba(255,255,255,0.04)',
    border: '1px solid', borderColor: active ? pub.color + '60' : 'var(--line)',
    color: active ? pub.color : 'var(--text-2)',
    cursor: 'pointer', fontFamily: 'inherit',
  }}>
    {active && <span style={{ width: 5, height: 5, borderRadius: '50%', background: pub.color }}/>}
    {pub.short}
  </button>
);

const ConsensusBadge = ({ values, fallbackPub }) => {
  // Detect agreement vs divergence
  const vals = Object.values(values).filter(v => v != null);
  if (vals.length < 2) return null;
  const min = Math.min(...vals), max = Math.max(...vals);
  const mean = vals.reduce((a,b) => a+b, 0) / vals.length;
  const spread = Math.abs(max - min) / Math.abs(mean || 1);
  const agree = spread < 0.05;
  return (
    <span className="badge" title={`${vals.length} sources · spread ${(spread*100).toFixed(1)}%`}
      style={{
        background: agree ? 'rgba(34,197,94,0.14)' : 'rgba(245,178,82,0.14)',
        color: agree ? '#5fdf8e' : '#fbcb83',
        fontSize: 10,
      }}>
      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }}/>
      {agree ? `${vals.length} sources agree` : 'Sources differ'}
    </span>
  );
};

const IndicatorRow = ({ ind, publisher, onSwitch, expanded, onToggle, dimColor }) => {
  const { PUBLISHERS } = window.GenieData;
  const availableSources = Object.keys(ind.values);
  const value = ind.values[publisher] ?? ind.values[ind.source_default] ?? Object.values(ind.values)[0];
  const sourceUsed = ind.values[publisher] != null ? publisher : ind.source_default;
  const sourcePub = PUBLISHERS.find(p => p.id === sourceUsed) || PUBLISHERS[0];

  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 200px 110px 64px 72px 32px',
        gap: 12, alignItems: 'center', padding: '12px 16px',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{ind.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{ind.desc}</div>
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {availableSources.map(srcId => {
            const p = PUBLISHERS.find(pp => pp.id === srcId);
            return <PublisherChip key={srcId} pub={p} active={sourceUsed === srcId} onClick={() => onSwitch(ind.id, srcId)}/>;
          })}
          <ConsensusBadge values={ind.values} fallbackPub={sourceUsed}/>
        </div>

        <Sparkline data={ind.sparkline} color={dimColor} w={100} h={28}/>

        <div style={{ textAlign: 'right' }}>
          <span className="mono" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-0)' }}>
            {value}{ind.unit && ind.unit !== '' ? ind.unit : ''}
          </span>
        </div>

        <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'right' }}>{ind.year}</div>

        <button onClick={onToggle} style={{
          background: 'transparent', border: 'none', color: 'var(--text-3)',
          padding: 4, justifySelf: 'end', cursor: 'pointer',
        }}>
          <Icon name="chevronDown" size={14} style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.15s',
          }}/>
        </button>
      </div>

      {expanded && (
        <div className="fade-in" style={{
          padding: '0 16px 16px 16px', display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: 16,
        }}>
          {/* Sub-indicators */}
          <div style={{ padding: 12, background: 'var(--inset-bg)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>
              Sub-components
            </div>
            {(ind.sub || []).length > 0 ? ind.sub.map(s => (
              <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12 }}>
                <span style={{ color: 'var(--text-1)' }}>{s.name}</span>
                <span className="mono" style={{ color: 'var(--text-0)' }}>{s.val}{ind.unit}</span>
              </div>
            )) : <div style={{ fontSize: 11, color: 'var(--text-3)' }}>No sub-components for this indicator</div>}
          </div>

          {/* All sources side-by-side */}
          <div style={{ padding: 12, background: 'var(--inset-bg)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>
              Source comparison
            </div>
            {availableSources.map(srcId => {
              const p = PUBLISHERS.find(pp => pp.id === srcId);
              return (
                <div key={srcId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-1)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }}/>
                    {p.name}
                  </span>
                  <span className="mono" style={{ color: srcId === sourceUsed ? 'white' : 'var(--text-2)', fontWeight: srcId === sourceUsed ? 600 : 400 }}>
                    {ind.values[srcId]}{ind.unit}
                  </span>
                </div>
              );
            })}
            <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-3)' }}>
              Citation: {sourcePub.name} · {ind.sources.join(' · ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DrilldownModal = ({ country, dimensionId, onClose, publisher, asPanel = false }) => {
  if (!dimensionId) return null;
  const { DIMENSIONS, INDICATORS, PUBLISHERS } = window.GenieData;
  const dim = DIMENSIONS.find(d => d.id === dimensionId);
  const indicators = INDICATORS[dimensionId] || [];
  const data = country.dimensions[dimensionId];

  const [perRowPublisher, setPRP] = useDDState({});
  const [expanded, setExpanded] = useDDState(null);
  const [globalPub, setGlobalPub] = useDDState(publisher);

  const onSwitch = (indId, pubId) => setPRP({ ...perRowPublisher, [indId]: pubId });

  const getPub = (ind) => perRowPublisher[ind.id] || globalPub;

  const wrapStyle = asPanel ? {
    width: 720, height: '100%',
    background: 'var(--bg-1)', borderLeft: '1px solid var(--line)',
    display: 'flex', flexDirection: 'column',
  } : {
    position: 'fixed', inset: 0, background: 'var(--scrim)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  };

  const innerStyle = asPanel ? {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
  } : {
    width: 'min(960px, 92vw)', maxHeight: '88vh',
    background: 'var(--bg-1)', border: '1px solid var(--line)',
    borderRadius: 16, overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
  };

  return (
    <div style={wrapStyle} onClick={asPanel ? undefined : (e) => e.target === e.currentTarget && onClose()}>
      <div style={innerStyle}>
        {/* Header */}
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: dim.color + '22', color: dim.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={dim.icon} size={18}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{country.name}</span>
              <Icon name="chevronRight" size={10} style={{ color: 'var(--text-3)' }}/>
              <span style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{dim.label}</span>
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, marginTop: 2 }}>{dim.label} Indicators · Detailed View</div>
          </div>
          <RiskBadge risk={data.risk} size="lg"/>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', padding: 8 }}>
            <Icon name="close" size={18}/>
          </button>
        </div>

        {/* Sub-header: global publisher pick */}
        <div style={{
          padding: '12px 22px', borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          background: 'var(--inset-bg)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Default source
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {PUBLISHERS.slice(0, 4).map(p => (
              <PublisherChip key={p.id} pub={p} active={globalPub === p.id}
                             onClick={() => { setGlobalPub(p.id); setPRP({}); }}/>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-3)' }}>
            {indicators.length} indicators · per-row override available
          </div>
        </div>

        {/* Summary */}
        <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--line)', fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6 }}>
          {data.summary}
        </div>

        {/* Indicator rows */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 200px 110px 64px 72px 32px',
            gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--line)',
            fontSize: 10, fontWeight: 600, color: 'var(--text-3)',
            textTransform: 'uppercase', letterSpacing: 0.5, position: 'sticky', top: 0,
            background: 'var(--bg-1)', zIndex: 1,
          }}>
            <span>Indicator</span>
            <span>Source</span>
            <span>Trend</span>
            <span style={{textAlign:'right'}}>Value</span>
            <span style={{textAlign:'right'}}>Year</span>
            <span/>
          </div>

          {indicators.map(ind => (
            <IndicatorRow key={ind.id} ind={ind} publisher={getPub(ind)} dimColor={dim.color}
              onSwitch={onSwitch}
              expanded={expanded === ind.id}
              onToggle={() => setExpanded(expanded === ind.id ? null : ind.id)}/>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 22px', borderTop: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 11, color: 'var(--text-3)', background: 'var(--inset-bg)',
        }}>
          <span>Click any source chip to override that row's publisher.</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '6px 12px', background: 'transparent', border: '1px solid var(--line)',
              borderRadius: 6, color: 'var(--text-1)', fontSize: 11, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 4,
            }}><Icon name="download" size={12}/>Export CSV</button>
            <button style={{
              padding: '6px 12px', background: 'rgba(123,140,255,0.18)',
              border: '1px solid rgba(123,140,255,0.32)', borderRadius: 6,
              color: 'var(--indigo)', fontSize: 11, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 4,
            }}><Icon name="sparkles" size={12}/>Ask Genie</button>
          </div>
        </div>
      </div>
    </div>
  );
};

window.DrilldownModal = DrilldownModal;
