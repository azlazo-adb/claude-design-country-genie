// === Publisher selector — multiple variants exposed via tweaks ===

const { useState: usePubState } = React;

// Variant A — header dropdown (clean global filter)
const PublisherDropdown = ({ value, onChange, compact = false }) => {
  const { PUBLISHERS } = window.GenieData;
  const [open, setOpen] = usePubState(false);
  const current = PUBLISHERS.find(p => p.id === value) || PUBLISHERS[0];

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: compact ? '6px 10px' : '8px 12px',
        background: 'var(--bg-2)', border: '1px solid var(--line)',
        borderRadius: 8, color: 'var(--text-0)', fontSize: 12, fontFamily: 'inherit',
        minWidth: 170,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: current.color, flexShrink: 0 }}/>
        <span style={{ fontWeight: 600, flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>{current.name}</span>
        <Icon name="chevronDown" size={12} style={{ color: 'var(--text-3)', flexShrink: 0 }}/>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0,
            minWidth: 280, background: 'var(--bg-2)', border: '1px solid var(--line-2)',
            borderRadius: 10, padding: 6, zIndex: 51,
            boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
          }}>
            <div className="t-eyebrow" style={{ padding: '8px 10px 4px' }}>
              Publisher Group
            </div>
            {PUBLISHERS.map(p => (
              <button key={p.id} onClick={() => { onChange(p.id); setOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', background: value === p.id ? 'rgba(123,140,255,0.1)' : 'transparent',
                border: 'none', borderRadius: 6, color: 'var(--text-0)', textAlign: 'left',
                fontSize: 12, fontFamily: 'inherit',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{p.desc}</div>
                </div>
                {value === p.id && <Icon name="check" size={14} style={{ color: 'var(--indigo)' }}/>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Variant B — chip rail
const PublisherChips = ({ value, onChange }) => {
  const { PUBLISHERS } = window.GenieData;
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 11, color: 'var(--text-3)', marginRight: 4 }}>Publisher Group:</span>
      {PUBLISHERS.map(p => (
        <button key={p.id} onClick={() => onChange(p.id)} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500,
          background: value === p.id ? p.color + '24' : 'transparent',
          border: '1px solid', borderColor: value === p.id ? p.color + '60' : 'var(--line)',
          color: value === p.id ? p.color : 'var(--text-2)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          {value === p.id && <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.color }}/>}
          {p.short}
        </button>
      ))}
    </div>
  );
};

// Variant C — sources matrix card (full panel showing all sources w/ toggles)
const PublisherMatrix = ({ value, onChange, multi = [], onMultiChange }) => {
  const { PUBLISHERS } = window.GenieData;
  return (
    <div className="panel" style={{ padding: 14, width: 280 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div className="t-eyebrow">
          Publisher Groups
        </div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{PUBLISHERS.length} groups</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {PUBLISHERS.map(p => (
          <button key={p.id} onClick={() => onChange(p.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', background: value === p.id ? 'rgba(123,140,255,0.08)' : 'transparent',
            border: '1px solid', borderColor: value === p.id ? 'rgba(123,140,255,0.32)' : 'transparent',
            borderRadius: 8, color: 'var(--text-0)', textAlign: 'left',
            fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
          }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 12 }}>{p.short}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.desc.split(',')[0]}</div>
            </div>
            <span style={{
              width: 14, height: 14, borderRadius: 4,
              background: value === p.id ? p.color : 'transparent',
              border: '1px solid', borderColor: value === p.id ? p.color : 'var(--line-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {value === p.id && <Icon name="check" size={10} style={{ color: 'white' }}/>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Variant D — segmented bar
const PublisherSegmented = ({ value, onChange }) => {
  const { PUBLISHERS } = window.GenieData;
  return (
    <div style={{
      display: 'flex', padding: 3, background: 'var(--bg-2)',
      border: '1px solid var(--line)', borderRadius: 10, gap: 2,
    }}>
      {PUBLISHERS.map(p => (
        <button key={p.id} onClick={() => onChange(p.id)} style={{
          padding: '6px 11px', background: value === p.id ? p.color + '2a' : 'transparent',
          border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 600,
          color: value === p.id ? p.color : 'var(--text-2)',
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.color, opacity: value === p.id ? 1 : 0.5 }}/>
          {p.short}
        </button>
      ))}
    </div>
  );
};

// Variant E — stacked tower (sources vertically with current at top)
const PublisherStack = ({ value, onChange }) => {
  const { PUBLISHERS } = window.GenieData;
  const others = PUBLISHERS.filter(p => p.id !== value);
  const current = PUBLISHERS.find(p => p.id === value) || PUBLISHERS[0];
  return (
    <div style={{ position: 'relative', minWidth: 180 }}>
      <div style={{
        padding: '8px 12px', background: current.color + '14',
        border: '1px solid', borderColor: current.color + '40',
        borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: current.color }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: 'var(--text-3)' }}>PUBLISHER GROUP</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-0)' }}>{current.short}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        {others.map(p => (
          <button key={p.id} onClick={() => onChange(p.id)} title={p.name}
            style={{
              flex: 1, padding: 6, background: 'var(--hover-tint)',
              border: '1px solid var(--line)', borderRadius: 6,
              color: p.color, fontSize: 10, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
            {p.short}
          </button>
        ))}
      </div>
    </div>
  );
};

window.PublisherDropdown = PublisherDropdown;
window.PublisherChips = PublisherChips;
window.PublisherMatrix = PublisherMatrix;
window.PublisherSegmented = PublisherSegmented;
window.PublisherStack = PublisherStack;
