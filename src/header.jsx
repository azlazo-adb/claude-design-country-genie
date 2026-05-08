// === Header — search + view switcher + publisher + role ===

const { useState: useHState } = React;

// View switcher variants
const ViewSegmented = ({ value, onChange }) => {
  const views = [
    { id: 'map', label: 'Map', icon: 'map' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'grid', label: 'Catalog', icon: 'grid' },
  ];
  return (
    <div style={{
      display: 'flex', padding: 3, background: 'var(--bg-2)',
      border: '1px solid var(--line)', borderRadius: 10,
    }}>
      {views.map(v => (
        <button key={v.id} onClick={() => onChange(v.id)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', background: value === v.id ? 'rgba(123,140,255,0.18)' : 'transparent',
          border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 500,
          color: value === v.id ? 'var(--indigo)' : 'var(--text-2)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <Icon name={v.icon} size={13}/>
          {v.label}
        </button>
      ))}
    </div>
  );
};

const ViewTabs = ({ value, onChange }) => {
  const views = [
    { id: 'map', label: 'Map' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'grid', label: 'Catalog' },
  ];
  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {views.map(v => (
        <button key={v.id} onClick={() => onChange(v.id)} style={{
          padding: '14px 18px', background: 'transparent', border: 'none',
          borderBottom: '2px solid', borderBottomColor: value === v.id ? 'var(--indigo)' : 'transparent',
          color: value === v.id ? 'white' : 'var(--text-2)', fontSize: 13, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          {v.label}
        </button>
      ))}
    </div>
  );
};

const ViewFloatingDock = ({ value, onChange }) => {
  const views = [
    { id: 'map', label: 'Map', icon: 'map' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'grid', label: 'Catalog', icon: 'grid' },
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', padding: 6, gap: 4, zIndex: 30,
      background: 'var(--panel-grad)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--line-2)', borderRadius: 14,
      boxShadow: 'var(--shadow-strong)',
    }}>
      {views.map(v => (
        <button key={v.id} onClick={() => onChange(v.id)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', background: value === v.id ? 'rgba(123,140,255,0.2)' : 'transparent',
          border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 500,
          color: value === v.id ? 'white' : 'var(--text-2)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <Icon name={v.icon} size={14}/>
          {v.label}
        </button>
      ))}
    </div>
  );
};

const ViewIconRail = ({ value, onChange }) => {
  const views = [
    { id: 'map', label: 'Map', icon: 'map' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'grid', label: 'Catalog', icon: 'grid' },
  ];
  return (
    <div style={{
      width: 56, height: '100%', display: 'flex', flexDirection: 'column',
      gap: 4, padding: '12px 8px', background: 'var(--bg-1)',
      borderRight: '1px solid var(--line)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, marginBottom: 12,
        background: 'linear-gradient(135deg, #5468ee, #7b8cff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="globe" size={18} style={{ color: 'white' }}/>
      </div>
      {views.map(v => (
        <button key={v.id} onClick={() => onChange(v.id)} title={v.label} style={{
          width: 40, height: 40, borderRadius: 8,
          background: value === v.id ? 'rgba(123,140,255,0.18)' : 'transparent',
          border: '1px solid', borderColor: value === v.id ? 'rgba(123,140,255,0.32)' : 'transparent',
          color: value === v.id ? 'var(--indigo)' : 'var(--text-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <Icon name={v.icon} size={18}/>
        </button>
      ))}
    </div>
  );
};

const ViewCommand = ({ value, onChange }) => {
  // Inline command palette style trigger
  const views = [
    { id: 'map', label: 'Map', icon: 'map', kbd: 'M' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', kbd: 'D' },
    { id: 'grid', label: 'Catalog', icon: 'grid', kbd: 'C' },
  ];
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {views.map(v => (
        <button key={v.id} onClick={() => onChange(v.id)} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '6px 10px 6px 10px', background: value === v.id ? 'rgba(123,140,255,0.12)' : 'var(--bg-2)',
          border: '1px solid', borderColor: value === v.id ? 'rgba(123,140,255,0.32)' : 'var(--line)',
          borderRadius: 8, fontSize: 12,
          color: value === v.id ? 'white' : 'var(--text-2)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <Icon name={v.icon} size={13}/>
          {v.label}
          <span className="mono" style={{
            padding: '1px 5px', background: 'var(--inset-bg)',
            border: '1px solid var(--line)', borderRadius: 4,
            fontSize: 9, color: 'var(--text-3)', marginLeft: 4,
          }}>⌘{v.kbd}</span>
        </button>
      ))}
    </div>
  );
};

const ViewPills = ({ value, onChange }) => {
  const views = [
    { id: 'map', label: 'Map', icon: 'map' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'grid', label: 'Catalog', icon: 'grid' },
  ];
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 0,
      padding: 0, background: 'transparent', borderRadius: 999,
      border: '1px solid var(--line-2)',
    }}>
      {views.map(v => (
        <button key={v.id} onClick={() => onChange(v.id)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px',
          background: value === v.id ? 'var(--indigo)' : 'transparent',
          border: 'none', borderRadius: 999, fontSize: 12, fontWeight: 600,
          color: value === v.id ? 'white' : 'var(--text-2)',
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.15s',
        }}>
          <Icon name={v.icon} size={13}/>
          {v.label}
        </button>
      ))}
    </div>
  );
};

const ViewSwitcher = ({ variant, value, onChange }) => {
  if (variant === 'tabs') return <ViewTabs value={value} onChange={onChange}/>;
  if (variant === 'dock') return null; // rendered separately as floating
  if (variant === 'rail') return null; // rendered separately as left rail
  if (variant === 'command') return <ViewCommand value={value} onChange={onChange}/>;
  if (variant === 'pills') return <ViewPills value={value} onChange={onChange}/>;
  return <ViewSegmented value={value} onChange={onChange}/>;
};

// Role switcher
const RoleSwitcher = ({ value, onChange }) => {
  const roles = [
    { id: 'general', label: 'General', icon: 'user' },
    { id: 'analyst', label: 'Analyst', icon: 'sliders' },
    { id: 'publisher', label: 'Publisher', icon: 'book' },
  ];
  return (
    <div style={{
      display: 'flex', padding: 2, background: 'var(--bg-2)',
      border: '1px solid var(--line)', borderRadius: 8, gap: 1,
    }}>
      {roles.map(r => (
        <button key={r.id} onClick={() => onChange(r.id)} title={r.label} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 9px', background: value === r.id ? 'var(--indigo-soft)' : 'transparent',
          border: '1px solid', borderColor: value === r.id ? 'var(--indigo-line)' : 'transparent',
          borderRadius: 6, fontSize: 11, fontWeight: 500,
          color: value === r.id ? 'var(--indigo)' : 'var(--text-2)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <Icon name={r.icon} size={12}/>
          {r.label}
        </button>
      ))}
    </div>
  );
};

// Country search box (used in map header)
const CountrySearch = ({ countries, value, onChange }) => {
  const [open, setOpen] = useHState(false);
  const [q, setQ] = useHState('');
  const list = Object.entries(countries).filter(([_, c]) =>
    !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.code.toLowerCase().includes(q.toLowerCase())
  );
  const current = value ? countries[value] : null;
  return (
    <div style={{ position: 'relative', minWidth: 220 }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        padding: '8px 12px', background: 'var(--bg-2)', border: '1px solid var(--line)',
        borderRadius: 8, color: 'var(--text-0)', fontSize: 12, fontFamily: 'inherit',
      }}>
        <Icon name="search" size={13} style={{ color: 'var(--text-3)' }}/>
        <span style={{ flex: 1, textAlign: 'left', color: current ? 'var(--text-0)' : 'var(--text-3)' }}>
          {current ? current.name : 'All countries'}
        </span>
        {current && <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{current.code}</span>}
        <Icon name="chevronDown" size={12} style={{ color: 'var(--text-3)' }}/>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: 'var(--bg-2)', border: '1px solid var(--line-2)',
            borderRadius: 10, padding: 6, zIndex: 41,
            boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
          }}>
            <input autoFocus value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search countries…" style={{
                width: '100%', padding: '8px 10px', background: 'var(--inset-bg)',
                border: '1px solid var(--line)', borderRadius: 6, marginBottom: 4,
                color: 'var(--text-0)', fontFamily: 'inherit', fontSize: 12, outline: 'none',
              }}/>
            <button onClick={() => { onChange(null); setOpen(false); setQ(''); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', background: !value ? 'rgba(123,140,255,0.1)' : 'transparent',
              border: 'none', borderRadius: 6, color: 'var(--text-1)', textAlign: 'left',
              fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
            }}>
              <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', minWidth: 32 }}>—</span>
              <span style={{ flex: 1 }}>All countries</span>
            </button>
            {list.map(([id, c]) => (
              <button key={id} onClick={() => { onChange(id); setOpen(false); setQ(''); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', background: value === id ? 'rgba(123,140,255,0.1)' : 'transparent',
                border: 'none', borderRadius: 6, color: 'var(--text-0)', textAlign: 'left',
                fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
              }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', minWidth: 32 }}>{c.code}</span>
                <span style={{ flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{c.region}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

window.ViewSwitcher = ViewSwitcher;
window.ViewIconRail = ViewIconRail;
window.ViewFloatingDock = ViewFloatingDock;
window.RoleSwitcher = RoleSwitcher;
window.CountrySearch = CountrySearch;
