// === AI Chat Panel ===

const ChatRefList = ({ refs }) => (
  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
    <div className="t-eyebrow" style={{ marginBottom: 6 }}>
      References
    </div>
    {refs.map(r => (
      <div key={r.n} style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-1)', marginBottom: 4 }}>
        <span className="mono" style={{ color: 'var(--text-3)', minWidth: 18 }}>{r.n}.</span>
        <a href={r.url} style={{ color: '#9aaaff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {r.label}
          <Icon name="external" size={10} style={{ opacity: 0.7 }}/>
        </a>
      </div>
    ))}
  </div>
);

const FormulaCard = () => (
  <div style={{
    padding: 14, background: 'var(--inset-bg)', borderRadius: 10,
    border: '1px solid var(--indigo-line)',
  }}>
    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Formula <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 400, marginLeft: 6 }}>indicative composite</span></div>
    <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.55, marginBottom: 12 }}>
      A simplified Debt Sustainability Index combining the debt-snowball term (interest rate ÷ growth) with the debt stock and inflation. It is illustrative only — formal sustainability assessments use IMF/WB DSF/DSA frameworks. Values above 3.0 indicate heightened concerns.
    </div>
    <div className="t-eyebrow" style={{ marginBottom: 6 }}>Equation</div>
    <div className="mono" style={{
      padding: 10, background: 'rgba(123,140,255,0.07)', borderRadius: 6, fontSize: 13,
      border: '1px solid rgba(123,140,255,0.18)', color: 'var(--text-0)', marginBottom: 10,
    }}>
      DSI = <span style={{display:'inline-block',verticalAlign:'middle',textAlign:'center'}}>
        <span style={{display:'block',borderBottom:'1px solid currentColor',padding:'0 4px'}}>Total Debt</span>
        <span style={{display:'block',padding:'0 4px'}}>GDP</span>
      </span> × <span style={{display:'inline-block',verticalAlign:'middle',textAlign:'center'}}>
        <span style={{display:'block',borderBottom:'1px solid currentColor',padding:'0 4px'}}>Interest Rate</span>
        <span style={{display:'block',padding:'0 4px'}}>GDP Growth</span>
      </span> × (1 + Inflation)
    </div>
    <div className="t-eyebrow" style={{ marginBottom: 6 }}>Calculation</div>
    <div className="mono" style={{
      padding: 8, background: 'rgba(123,140,255,0.07)', borderRadius: 6, fontSize: 12,
      border: '1px solid rgba(123,140,255,0.18)', color: 'var(--text-0)', marginBottom: 10,
    }}>
      DSI = (77.5 / 100) × (17.5 / 2.4) × (1 + 0.234) = <strong>6.97</strong>
    </div>
    <div style={{
      padding: 10, background: 'rgba(239,88,118,0.08)', borderRadius: 6,
      border: '1px solid rgba(239,88,118,0.25)', fontSize: 12, color: '#ffb6c2',
    }}>
      <strong>DSI = 6.97</strong> → Critical risk threshold exceeded (&gt; 3.0)
    </div>
    <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-1)', lineHeight: 1.55 }}>
      <strong style={{color:'var(--text-0)'}}>Interpretation:</strong> Pakistan's DSI of 6.97 sits well above the heightened-risk threshold.
      Combined with FX reserves of 1.3 months of imports, this is consistent with the country's continued reliance on
      IMF program support for external buffers and new project financing.
    </div>
  </div>
);

const TimeSeriesCard = ({ title, unit, series, threshold, thresholdLabel }) => {
  const W = 360, H = 130, P = { l: 28, r: 12, t: 12, b: 22 };
  const all = series.flatMap(s => s.values);
  const min = Math.min(...all, threshold ?? Infinity);
  const max = Math.max(...all, threshold ?? -Infinity);
  const pad = (max - min) * 0.12 || 1;
  const yMin = min - pad, yMax = max + pad;
  const years = series[0].years;
  const x = i => P.l + (i / (years.length - 1)) * (W - P.l - P.r);
  const y = v => P.t + (1 - (v - yMin) / (yMax - yMin)) * (H - P.t - P.b);
  const ticks = [yMin, (yMin+yMax)/2, yMax];
  return (
    <div style={{ padding: 12, background: 'var(--inset-bg)', borderRadius: 10, border: '1px solid var(--indigo-line)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{unit}</div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={P.l} x2={W-P.r} y1={y(t)} y2={y(t)} stroke="var(--line)"/>
            <text x={P.l-4} y={y(t)+3} textAnchor="end" fontSize="9" fill="var(--text-3)">{t.toFixed(1)}</text>
          </g>
        ))}
        {threshold != null && (
          <g>
            <line x1={P.l} x2={W-P.r} y1={y(threshold)} y2={y(threshold)} stroke="#ef5876" strokeDasharray="3 3" opacity="0.6"/>
            <text x={W-P.r-2} y={y(threshold)-3} textAnchor="end" fontSize="9" fill="#ef5876">{thresholdLabel}</text>
          </g>
        )}
        {years.map((yr, i) => (
          <text key={yr} x={x(i)} y={H-6} textAnchor="middle" fontSize="9" fill="var(--text-3)">{yr}</text>
        ))}
        {series.map((s, si) => {
          const d = s.values.map((v, i) => `${i?'L':'M'}${x(i)},${y(v)}`).join(' ');
          return (
            <g key={si}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={s.dim ? 1.4 : 2} opacity={s.dim ? 0.7 : 1}/>
              {!s.dim && s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill={s.color}/>
              ))}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--text-2)', marginTop: 4 }}>
        {series.map(s => (
          <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 2, background: s.color, opacity: s.dim ? 0.7 : 1 }}/>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const SocialTable = () => {
  const { SOCIAL_COMPARISON } = window.GenieData;
  const cols = ['Country', 'Poverty Rate (%)', 'Gini Index', 'HDI Rank', 'Gender Gap'];
  return (
    <div style={{
      padding: 12, background: 'var(--inset-bg)', borderRadius: 10,
      border: '1px solid var(--line)', overflowX: 'auto',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c} className="t-eyebrow" style={{ textAlign: 'left', padding: '6px 8px' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SOCIAL_COMPARISON.map((r, i) => (
            <tr key={r.country} style={{ borderTop: '1px solid var(--line)' }}>
              <td style={{ padding: '8px', color: 'var(--text-0)', fontWeight: 500 }}>{r.country}</td>
              <td className="mono" style={{ padding: '8px' }}>{r.pov}</td>
              <td className="mono" style={{ padding: '8px' }}>{r.gini}</td>
              <td className="mono" style={{ padding: '8px' }}>{r.hdi}</td>
              <td className="mono" style={{ padding: '8px' }}>{r.gg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AssistantTurn = ({ children }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
    <div style={{
      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
      background: 'linear-gradient(135deg, #5468ee, #7b8cff)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name="sparkle" size={14} style={{ color: 'white' }}/>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const UserTurn = ({ children }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
    <div style={{
      flex: 1, padding: '10px 14px', background: 'rgba(123,140,255,0.1)',
      border: '1px solid rgba(123,140,255,0.32)', borderRadius: 12,
      fontSize: 13, lineHeight: 1.55, color: 'var(--text-0)',
    }}>{children}</div>
    <div style={{
      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
      background: 'var(--hover-tint-2)', border: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)',
    }}>
      <Icon name="user" size={14}/>
    </div>
  </div>
);

const ChatPanel = ({ width = 480, onClose, onCountryRef, publisher }) => {
  const { REFERENCES } = window.GenieData;
  return (
    <div style={{
      width, height: '100%', background: 'var(--bg-1)',
      borderLeft: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #5468ee, #7b8cff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="sparkle" size={16} style={{ color: 'white' }}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Country Genie</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Ask about country indicators & statistics</div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', padding: 6 }}>
            <Icon name="close" size={16}/>
          </button>
        )}
      </div>

      {/* Conversation */}
      <div style={{ flex: 1, overflow: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <UserTurn>
          Show me Pakistan's inflation trend vs South Asia.
        </UserTurn>

        <AssistantTurn>
          <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6, marginBottom: 12 }}>
            Pakistan's CPI inflation peaked at <strong style={{color:'#ff8b8b'}}>29.2% in 2023</strong>, more
            than 4× the South Asia median, and has been moderating in 2024 as monetary tightening took hold.
          </div>
          <TimeSeriesCard
            title="CPI Inflation — Pakistan vs South Asia median"
            unit="% YoY"
            threshold={10}
            thresholdLabel="10% reference"
            series={[
              { label: 'Pakistan', color: '#7b8cff',
                years: [2019,2020,2021,2022,2023,2024],
                values: [3.9, 9.7, 10.7, 19.9, 29.2, 23.4] },
              { label: 'South Asia median', color: '#9aaaff', dim: true,
                years: [2019,2020,2021,2022,2023,2024],
                values: [4.5, 6.2, 5.8, 7.4, 6.1, 5.2] },
            ]}/>
          <ChatRefList refs={REFERENCES.dsi}/>
        </AssistantTurn>

        <UserTurn>
          What is Pakistan's debt sustainability situation? Is this a concern for our country partnership strategy?
        </UserTurn>

        <AssistantTurn>
          <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6, marginBottom: 12 }}>
            Pakistan's debt sustainability is at a <strong style={{color:'#ff8b8b'}}>critical level</strong> requiring
            close monitoring under the Country Partnership Strategy. The Debt Sustainability Index, calculated
            below from official sources, exceeds the heightened-risk threshold significantly.
          </div>
          <FormulaCard/>
          <ChatRefList refs={REFERENCES.dsi}/>
        </AssistantTurn>

        <UserTurn>
          What about poverty and social indicators? I need to understand the social dimensions for our country strategy.
        </UserTurn>

        <AssistantTurn>
          <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6, marginBottom: 12 }}>
            Pakistan faces significant poverty and social challenges that should inform the Country Partnership
            Strategy. Comparative South Asia social risk assessment using poverty & inequality data
            <span className="cite">1</span>, human development indicators<span className="cite">2</span>, and
            gender equality metrics<span className="cite">3</span>:
          </div>
          <SocialTable/>
          <ChatRefList refs={REFERENCES.social}/>
        </AssistantTurn>

        <div style={{
          padding: 10, background: 'rgba(123,140,255,0.06)', borderRadius: 10,
          border: '1px dashed rgba(123,140,255,0.3)', fontSize: 12, color: 'var(--text-2)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon name="info" size={14} style={{ color: 'var(--indigo)' }}/>
          Try: <button onClick={() => onCountryRef && onCountryRef('bangladesh')}
            style={{ background: 'transparent', border: 'none', color: '#9aaaff', padding: 0, fontSize: 12, textDecoration: 'underline', cursor: 'pointer' }}>
            "Compare Bangladesh climate exposure"
          </button>
        </div>
      </div>

      {/* Composer */}
      <div style={{ padding: 14, borderTop: '1px solid var(--line)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', background: 'var(--bg-2)',
          border: '1px solid var(--line)', borderRadius: 12,
        }}>
          <Icon name="plus" size={16} style={{ color: 'var(--text-3)' }}/>
          <input type="text" placeholder="Ask, Search or Chat…" disabled
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-1)', fontSize: 13, fontFamily: 'inherit',
            }}/>
          <button style={{
            background: 'rgba(123,140,255,0.18)', border: 'none', borderRadius: 6,
            padding: 6, color: 'var(--indigo)',
          }}>
            <Icon name="send" size={14}/>
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: 'var(--text-3)' }}>
          <span>Mock conversation · Input disabled</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="info" size={11}/>
            Publisher Group: {(() => {
              const p = window.GenieData.PUBLISHERS.find(pp => pp.id === publisher) || window.GenieData.PUBLISHERS[0];
              return <span style={{color: p.color}}>{p.short}</span>;
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

window.ChatPanel = ChatPanel;
