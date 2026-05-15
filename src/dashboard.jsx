// === Per-country Dashboard ===

const { useState: useDashState, useMemo: useDashMemo } = React;

// Bigger sparkline / area chart with axis
const TrendChart = ({ data, years, color = '#7b8cff', label, value, unit = '', height = 110 }) => {
  const W = 320, H = height;
  const padL = 32, padR = 8, padT = 8, padB = 18;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;
  const scaleX = (i) => padL + (i / (data.length - 1)) * (W - padL - padR);
  const scaleY = (v) => padT + (1 - (v - min) / range) * (H - padT - padB);
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(v)}`).join(' ');
  const area = `${path} L${scaleX(data.length - 1)},${H - padB} L${scaleX(0)},${H - padB} Z`;
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const delta = last - prev;
  const deltaPct = (delta / Math.abs(prev || 1)) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <div className="t-eyebrow">
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="mono" style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-0)' }}>{value}{unit}</span>
          <span className="mono" style={{ fontSize: 10, color: delta >= 0 ? '#5fdf8e' : '#ff8b8b' }}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(deltaPct).toFixed(1)}%
          </span>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {[0, 0.5, 1].map((p, i) => (
          <line key={i} x1={padL} x2={W - padR} y1={padT + p * (H - padT - padB)} y2={padT + p * (H - padT - padB)}
                stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4"/>
        ))}
        <text x={padL - 4} y={padT + 4} textAnchor="end" fontSize="9" fill="var(--text-3)" fontFamily="'JetBrains Mono', monospace">
          {max.toFixed(0)}
        </text>
        <text x={padL - 4} y={H - padB + 2} textAnchor="end" fontSize="9" fill="var(--text-3)" fontFamily="'JetBrains Mono', monospace">
          {min.toFixed(0)}
        </text>
        <path d={area} fill={color} opacity="0.16"/>
        <path d={path} stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
        {data.map((v, i) => (
          <circle key={i} cx={scaleX(i)} cy={scaleY(v)} r={i === data.length - 1 ? 3 : 1.8}
                  fill={color} opacity={i === data.length - 1 ? 1 : 0.5}/>
        ))}
        {years && years.map((y, i) => (
          <text key={y} x={scaleX(i)} y={H - 3} textAnchor="middle" fontSize="9"
                fill="var(--text-3)" fontFamily="'JetBrains Mono', monospace">
            {String(y).slice(2)}
          </text>
        ))}
      </svg>
    </div>
  );
};

// Stacked dimension card
const DimensionCard = ({ dim, data, indicators, publisher, country, onDrilldown }) => {
  // Generic series builder: first 3 indicators per dimension, using each indicator's
  // own sparkline so every dimension renders consistently.
  const ts = window.GenieData.tsFor(country);
  const tsKeyByDim = { economic: ['gdp','cpi','debt'], social: ['pov'] }; // legacy per-country series
  const series = (indicators || []).slice(0, 3).map((ind, i) => {
    const tsKey = (tsKeyByDim[dim.id] || [])[i];
    const dataPoints = tsKey && ts[tsKey] ? ts[tsKey] : ind.sparkline;
    const val = ind.values?.[publisher] ?? ind.values?.adb ?? Object.values(ind.values || {})[0];
    return {
      key: ind.id,
      label: ind.name,
      value: val,
      unit: ind.unit || '',
      data: dataPoints,
    };
  });

  return (
    <div className="panel-flat" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: dim.color + '22', color: dim.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={dim.icon} size={16}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{dim.label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
            {indicators.length} indicators · {data.summary.split('.')[0]}
          </div>
        </div>
      </div>

      {series.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {series.map((s) => (
            <TrendChart key={s.key} data={s.data || []} years={window.GenieData.YEARS}
                        color={dim.color} label={s.label} value={s.value} unit={s.unit}/>
          ))}
        </div>
      ) : (
        <div style={{ padding: 18, textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>
          Data feed connecting…
        </div>
      )}

      <button onClick={onDrilldown} style={{
        marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '8px 12px', background: 'var(--hover-tint)',
        border: '1px solid var(--line)', borderRadius: 8,
        color: 'var(--text-1)', fontSize: 12,
      }}>
        Detailed indicators
        <Icon name="arrow" size={12}/>
      </button>
    </div>
  );
};

// Hero header for the dashboard
const DashboardHero = ({ country, role }) => {
  return (
    <div className="panel-flat" style={{
      padding: 24,
      background: 'linear-gradient(135deg, rgba(123,140,255,0.10), rgba(195,155,255,0.06))',
      borderColor: 'rgba(123,140,255,0.24)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{country.code}</span>
            <span className="badge badge-blue">{country.region}</span>
            <span className="badge badge-purple">{country.income}</span>
          </div>
          <h1 className="t-display" style={{ margin: 0 }}>
            {country.name}
          </h1>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-1)', maxWidth: 540, lineHeight: 1.55 }}>
            {country.dimensions.economic.summary} {country.dimensions.social.summary}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          <Stat label="Population" value={country.population}/>
          <Stat label="GDP" value={country.gdp}/>
          <Stat label="Active Projects" value="312"/>
          <Stat label="Latest Data" value="2024"/>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, tone }) => (
  <div>
    <div className="t-eyebrow" style={{ marginBottom: 4 }}>{label}</div>
    <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: tone === 'risk' ? '#ff8b8b' : 'var(--text-0)', letterSpacing: '-0.01em' }}>{value}</div>
  </div>
);

const Dashboard = ({ country, publisher, onDrilldown, role, onSelectCountry }) => {
  const { DIMENSIONS, INDICATORS, COUNTRIES, tsFor, YEARS } = window.GenieData;
  if (!country) {
    return (
      <div className="scroll-visible" style={{ height: '100%', overflowY: 'auto', padding: '32px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 24 }}>
            <div className="t-display-md">
              Country Dashboards
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6, maxWidth: 560 }}>
              Select a country to drill into its risk dimensions, indicators &amp; trends. Below are quick-look previews for each DMC in scope.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {Object.entries(COUNTRIES).map(([id, c]) => {
              const ts = tsFor(id);
              const gdp = ts.gdp;
              const cpi = ts.cpi;
              // Build a tiny sparkline for GDP
              const data = gdp;
              const min = Math.min(...data), max = Math.max(...data);
              const range = (max - min) || 1;
              const W = 120, H = 28;
              const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`).join(' ');
              const dimEntries = Object.entries(c.dimensions).slice(0, 4);
              return (
                <button key={id} onClick={() => onSelectCountry && onSelectCountry(id)}
                  className="panel-flat" style={{
                    padding: 14, textAlign: 'left', cursor: 'pointer',
                    fontFamily: 'inherit', color: 'var(--text-0)', display: 'flex',
                    flexDirection: 'column', gap: 12, transition: 'transform 0.12s, border-color 0.12s, box-shadow 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--indigo-line)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{c.flag}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{c.name}</div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                        {c.code} · {c.region}
                      </div>
                    </div>
                    <Icon name="chevronRight" size={14} style={{ color: 'var(--text-3)' }}/>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
                    <div>
                      <div className="t-eyebrow" style={{ marginBottom: 2 }}>GDP growth</div>
                      <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>
                        {gdp[gdp.length - 1] >= 0 ? '+' : ''}{gdp[gdp.length - 1].toFixed(1)}<span style={{ fontSize: 11, color: 'var(--text-3)' }}>%</span>
                      </div>
                    </div>
                    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', flexShrink: 0 }}>
                      <path d={path} fill="none" stroke="var(--indigo)" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {dimEntries.map(([dimId, d]) => {
                      const dim = DIMENSIONS.find(x => x.id === dimId);
                      const cls = `risk-${d.risk.replace(' ', '-')}`;
                      return (
                        <span key={dimId} className={`badge ${cls}`} style={{ fontSize: 10, padding: '2px 7px' }}>
                          {dim?.label || dimId}
                        </span>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  const indicatorsByDim = Object.fromEntries(
    DIMENSIONS.map(d => [d.id, window.GenieData.indicatorsFor(publisher, d.id)])
  );
  const activeDimensions = DIMENSIONS.filter(d => !d.soon && country.dimensions[d.id] && (indicatorsByDim[d.id] || []).length > 0);
  // Dimensions where THIS publisher carries no indicators, but indicators exist from other publishers.
  const uncoveredDimensions = DIMENSIONS.filter(d => {
    if (d.soon) return false;
    const hereCount = (indicatorsByDim[d.id] || []).length;
    const totalCount = (window.GenieData.INDICATORS[d.id] || []).length;
    return hereCount === 0 && totalCount > 0;
  });
  const pubName = (window.GenieData.PUBLISHERS.find(p => p.id === publisher) || {}).name || publisher;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 18, height: '100%', overflow: 'auto' }}>
      <DashboardHero country={country} role={role}/>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 14,
      }}>
        {activeDimensions.map(d => (
          <DimensionCard
            key={d.id}
            dim={d}
            data={country.dimensions[d.id]}
            indicators={indicatorsByDim[d.id]}
            publisher={publisher}
            country={Object.keys(window.GenieData.COUNTRIES).find(k => window.GenieData.COUNTRIES[k] === country)}
            onDrilldown={() => onDrilldown(d.id)}
          />
        ))}
      </div>

      {uncoveredDimensions.length > 0 && (
        <div className="panel-flat" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Icon name="info" size={14} style={{ color: 'var(--text-2)' }}/>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
              Not covered by {pubName}
            </div>
            <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 'auto' }}>coverage gap</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 10, lineHeight: 1.55 }}>
            These dimensions have indicators available from other publishers. Switch the Source above to load them.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {uncoveredDimensions.map(d => (
              <div key={d.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', background: 'var(--hover-tint)',
                border: '1px solid var(--line)', borderRadius: 8, opacity: 0.75,
              }}>
                <Icon name={d.icon} size={14} style={{ color: d.color }}/>
                <span style={{ fontSize: 12 }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Citations footer */}
      <div className="panel-flat" style={{ padding: 14, fontSize: 11, color: 'var(--text-2)', lineHeight: 1.65 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Icon name="book" size={13} style={{ color: 'var(--text-3)' }}/>
          <span className="t-eyebrow">Sources used on this page</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 6 }}>
          <span>1. ADB Asian Development Outlook 2024 ↗</span>
          <span>2. World Bank WDI 2024 ↗</span>
          <span>3. IMF WEO October 2024 ↗</span>
          <span>4. UNDP Human Development Report 2024 ↗</span>
          <span>5. WEF Global Gender Gap Report 2024 ↗</span>
          <span>6. State Bank of {country.name} Q4 2023 ↗</span>
        </div>
      </div>
    </div>
  );
};

window.Dashboard = Dashboard;
window.TrendChart = TrendChart;
