// Minimal icon set — stroke-based, keeps line weight consistent with the design

const Icon = ({ name, size = 16, className = '', style = {} }) => {
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    chart:   <g {...stroke}><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-6"/></g>,
    users:   <g {...stroke}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/><path d="M15 14c2.5 0 4 1.5 4 4"/></g>,
    leaf:    <g {...stroke}><path d="M4 20c8 0 14-6 16-16-3 0-9 1-13 5s-5 8-3 11z"/><path d="M4 20l8-8"/></g>,
    building:<g {...stroke}><rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M9 8h.01M14 8h.01M9 12h.01M14 12h.01M9 16h6"/></g>,
    flag:    <g {...stroke}><path d="M5 3v18"/><path d="M5 4h11l-2 4 2 4H5"/></g>,
    network: <g {...stroke}><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.5 7.5l3 9M16.5 7.5l-3 9M8 6h8"/></g>,
    search:  <g {...stroke}><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></g>,
    layers:  <g {...stroke}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17l9 5 9-5"/></g>,
    map:     <g {...stroke}><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></g>,
    grid:    <g {...stroke}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></g>,
    dashboard: <g {...stroke}><rect x="3" y="3" width="8" height="10" rx="1"/><rect x="13" y="3" width="8" height="6" rx="1"/><rect x="13" y="11" width="8" height="10" rx="1"/><rect x="3" y="15" width="8" height="6" rx="1"/></g>,
    sparkles:<g {...stroke}><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></g>,
    ai:      <g {...stroke}><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><path d="M12 2v3M8 19l-2 3M16 19l2 3"/></g>,
    chevronDown: <g {...stroke}><path d="M6 9l6 6 6-6"/></g>,
    chevronRight: <g {...stroke}><path d="M9 6l6 6-6 6"/></g>,
    plus:    <g {...stroke}><path d="M12 5v14M5 12h14"/></g>,
    close:   <g {...stroke}><path d="M5 5l14 14M19 5l-14 14"/></g>,
    external:<g {...stroke}><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 13v6a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h6"/></g>,
    moon:    <g {...stroke}><path d="M20 14a8 8 0 11-9-11 6 6 0 009 11z"/></g>,
    send:    <g {...stroke}><path d="M4 12l16-8-6 18-3-7-7-3z"/></g>,
    info:    <g {...stroke}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></g>,
    filter:  <g {...stroke}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/></g>,
    sort:    <g {...stroke}><path d="M7 4v16M3 8l4-4 4 4"/><path d="M17 20V4M13 16l4 4 4-4"/></g>,
    bookmark:<g {...stroke}><path d="M6 3h12v18l-6-4-6 4z"/></g>,
    download:<g {...stroke}><path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 19h16"/></g>,
    sliders: <g {...stroke}><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="14" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></g>,
    user:    <g {...stroke}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></g>,
    sun:     <g {...stroke}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></g>,
    sparkle: <g {...stroke}><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z"/></g>,
    cite:    <g {...stroke}><path d="M7 7h4v4H7zM7 11c0 4-2 4-2 4M13 7h4v4h-4zM13 11c0 4-2 4-2 4"/></g>,
    arrow:   <g {...stroke}><path d="M5 12h14M13 6l6 6-6 6"/></g>,
    raster:  <g {...stroke}><rect x="3" y="3" width="6" height="6"/><rect x="11" y="3" width="6" height="6"/><rect x="3" y="11" width="6" height="6"/><rect x="11" y="11" width="6" height="6"/></g>,
    vector:  <g {...stroke}><path d="M3 6c5-3 13-3 18 0M3 12c5-3 13-3 18 0M3 18c5-3 13-3 18 0"/></g>,
    pin:     <g {...stroke}><path d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></g>,
    book:    <g {...stroke}><path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z"/><path d="M4 17h15"/></g>,
    globe:   <g {...stroke}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></g>,
    dot:     <g {...stroke}><circle cx="12" cy="12" r="3" fill="currentColor"/></g>,
    star:    <g {...stroke}><path d="M12 3l2.7 5.5 6 .9-4.4 4.3 1 6-5.3-2.8-5.3 2.8 1-6L3.4 9.4l6-.9L12 3z"/></g>,
    refresh: <g {...stroke}><path d="M21 12a9 9 0 11-3-6.7L21 8"/><path d="M21 3v5h-5"/></g>,
    check:   <g {...stroke}><path d="M5 12l4 4 10-10"/></g>,
    panel:   <g {...stroke}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></g>,
    panelR:  <g {...stroke}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/></g>,
    minus:   <g {...stroke}><path d="M5 12h14"/></g>,
    eye:     <g {...stroke}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
};

window.Icon = Icon;
