// === Geographic map of South Asia, rendered from world-atlas TopoJSON
// + natural-earth state/province lines.
//
// Uses topojson-client (loaded via CDN in index.html) and a hand-rolled
// Mercator projection focused on the South Asian DMC region.

const { useState: useMapState, useEffect: useMapEffect, useRef: useMapRef, useMemo: useMapMemo } = React;

// 3-letter ISO codes used by world-atlas's id field for our DMCs of interest.
// world-atlas countries-50m uses numeric ISO 3166-1 ids though, so map by name too.
const COUNTRY_IDS = {
  pakistan:    { iso3: 'PAK', name: 'Pakistan',    numeric: '586' },
  india:       { iso3: 'IND', name: 'India',       numeric: '356' },
  bangladesh:  { iso3: 'BGD', name: 'Bangladesh',  numeric: '050' },
  nepal:       { iso3: 'NPL', name: 'Nepal',       numeric: '524' },
  bhutan:      { iso3: 'BTN', name: 'Bhutan',      numeric: '064' },
  srilanka:    { iso3: 'LKA', name: 'Sri Lanka',   numeric: '144' },
};
const NAME_TO_ID = {};
Object.entries(COUNTRY_IDS).forEach(([id, o]) => {
  NAME_TO_ID[o.name.toLowerCase()] = id;
  NAME_TO_ID[o.iso3] = id;
  NAME_TO_ID[o.numeric] = id;
});

const RISK_COLOR = {
  'very high': '#ef4444',
  'high': '#f59e0b',
  'moderate': '#eab308',
  'low': '#22c55e',
};

// ---- Projection (Mercator, focused on South Asia) ----
const REGION = { lonMin: 58, lonMax: 100, latMin: 4, latMax: 39 };
function makeProjector(W, H) {
  const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2));
  const yMin = mercY(REGION.latMin), yMax = mercY(REGION.latMax);
  const lonRange = REGION.lonMax - REGION.lonMin;
  const yRange = yMax - yMin;
  return (lon, lat) => {
    const x = ((lon - REGION.lonMin) / lonRange) * W;
    const y = (1 - (mercY(lat) - yMin) / yRange) * H;
    return [x, y];
  };
}

// Convert a GeoJSON geometry to an SVG path string using the projector.
function geometryToPath(geom, project) {
  if (!geom) return '';
  const ringToPath = (ring) => {
    return ring.map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ') + ' Z';
  };
  if (geom.type === 'Polygon') {
    return geom.coordinates.map(ringToPath).join(' ');
  }
  if (geom.type === 'MultiPolygon') {
    return geom.coordinates.map(poly => poly.map(ringToPath).join(' ')).join(' ');
  }
  if (geom.type === 'LineString') {
    return geom.coordinates.map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }
  if (geom.type === 'MultiLineString') {
    return geom.coordinates.map(line =>
      line.map(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ')
    ).join(' ');
  }
  return '';
}

// Best-effort centroid of a (Multi)Polygon — average of outer-ring vertices.
function geometryCentroid(geom) {
  let pts = [];
  if (!geom) return null;
  if (geom.type === 'Polygon') pts = geom.coordinates[0];
  else if (geom.type === 'MultiPolygon') {
    // pick the largest ring
    let biggest = geom.coordinates[0][0], maxLen = biggest.length;
    geom.coordinates.forEach(poly => {
      if (poly[0].length > maxLen) { biggest = poly[0]; maxLen = poly[0].length; }
    });
    pts = biggest;
  }
  if (!pts.length) return null;
  let sx = 0, sy = 0;
  pts.forEach(([lon, lat]) => { sx += lon; sy += lat; });
  return [sx / pts.length, sy / pts.length];
}

// ---- Data fetcher (memoized at module scope) ----
let _geoCache = null;
async function loadGeo() {
  if (_geoCache) return _geoCache;
  const [worldRes, statesRes] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'),
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces_lines.geojson'),
  ]);
  const worldTopo = await worldRes.json();
  const states = await statesRes.json();
  const countries = window.topojson.feature(worldTopo, worldTopo.objects.countries);
  // Filter state lines to our DMCs (admin 0 ISO codes vary; use adm0_a3 / adm0_name)
  const dmcA3 = new Set(['PAK','IND','BGD','NPL','BTN','LKA']);
  const stateLines = {
    type: 'FeatureCollection',
    features: states.features.filter(f =>
      dmcA3.has(f.properties.adm0_a3) ||
      dmcA3.has(f.properties.ADM0_A3) ||
      dmcA3.has((f.properties.adm0_a3_us || ''))
    ),
  };
  _geoCache = { countries, stateLines };
  return _geoCache;
}

const StylizedMap = ({
  selected = 'pakistan',
  showProjects = true,
  showClimate = true,
  showInfra = false,
  onSelect = () => {},
  riskByCountry = {},
  showLabels = true,
}) => {
  const W = 1000, H = 600;
  const project = useMapMemo(() => makeProjector(W, H), [W, H]);
  const [geo, setGeo] = useMapState(null);
  const [error, setError] = useMapState(null);

  // Pan transform (in viewBox units). Drag updates immediately; selection
  // changes animate via CSS transition.
  const [pan, setPan] = useMapState({ x: 0, y: 0 });
  const [dragging, setDragging] = useMapState(false);
  const svgRef = useMapRef(null);
  const dragRef = useMapRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false });

  const screenToVb = (dx, dy) => {
    const r = svgRef.current && svgRef.current.getBoundingClientRect();
    if (!r || !r.width) return [dx, dy];
    const sx = W / r.width, sy = H / r.height;
    const s = Math.min(sx, sy);
    return [dx * s, dy * s];
  };

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    dragRef.current = { active: true, sx: e.clientX, sy: e.clientY, ox: pan.x, oy: pan.y, moved: false };
    setDragging(true);
    e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const [dx, dy] = screenToVb(e.clientX - d.sx, e.clientY - d.sy);
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 3) d.moved = true;
    setPan({ x: d.ox + dx, y: d.oy + dy });
  };
  const onPointerUp = () => {
    dragRef.current.active = false;
    setDragging(false);
  };

  useMapEffect(() => {
    let cancelled = false;
    loadGeo().then(g => { if (!cancelled) setGeo(g); }).catch(e => !cancelled && setError(e.message));
    return () => { cancelled = true; };
  }, []);

  // index country features by our DMC ids
  const dmcFeatures = useMapMemo(() => {
    if (!geo) return {};
    const out = {};
    geo.countries.features.forEach(f => {
      const id = NAME_TO_ID[(f.properties && f.properties.name || '').toLowerCase()]
              || NAME_TO_ID[String(f.id).padStart(3, '0')]
              || NAME_TO_ID[String(f.id)];
      if (id) out[id] = f;
    });
    return out;
  }, [geo]);

  // anchors derived from real centroids (for labels + overlays)
  const anchors = useMapMemo(() => {
    const out = {};
    Object.entries(dmcFeatures).forEach(([id, f]) => {
      const c = geometryCentroid(f.geometry);
      if (!c) return;
      const [x, y] = project(c[0], c[1]);
      out[id] = { x, y, name: COUNTRY_IDS[id].name, label: COUNTRY_IDS[id].iso3 };
    });
    return out;
  }, [dmcFeatures, project]);

  // Auto-focus: when `selected` changes, recenter on that country's centroid
  useMapEffect(() => {
    const a = anchors[selected];
    if (!a) return;
    setPan({ x: W / 2 - a.x, y: H / 2 - a.y });
  }, [selected, anchors]);

  // deterministic dot scatter for project / climate markers
  const detDots = (id, cx, cy, radius, count, salt = 0) => {
    let seed = id.charCodeAt(0) + id.length + salt;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const pts = [];
    for (let i = 0; i < count; i++) {
      const ang = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * radius;
      pts.push({ x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r });
    }
    return pts;
  };

  const projectCounts = { pakistan: 312, india: 540, bangladesh: 88, nepal: 47, bhutan: 18, srilanka: 64 };
  const climateCounts = { pakistan: 4, india: 7, bangladesh: 3, nepal: 2, bhutan: 1, srilanka: 2 };

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice"
         onPointerDown={onPointerDown}
         onPointerMove={onPointerMove}
         onPointerUp={onPointerUp}
         onPointerCancel={onPointerUp}
         style={{ width: '100%', height: '100%', display: 'block',
                  background: 'var(--map-water, #0a1428)',
                  cursor: dragging ? 'grabbing' : 'grab',
                  touchAction: 'none', userSelect: 'none' }}>
      <defs>
        <filter id="country-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.2"/>
        </filter>
      </defs>

      {/* Graticule */}
      <g opacity="0.35">
        {[10, 20, 30].map(lat => {
          const [, y] = project(REGION.lonMin, lat);
          return <line key={'lat'+lat} x1={0} y1={y} x2={W} y2={y} stroke="var(--map-grid, rgba(255,255,255,0.06))" strokeDasharray="2 6"/>;
        })}
        {[60, 70, 80, 90, 100].map(lon => {
          const [x] = project(lon, REGION.latMin);
          return <line key={'lon'+lon} x1={x} y1={0} x2={x} y2={H} stroke="var(--map-grid, rgba(255,255,255,0.06))" strokeDasharray="2 6"/>;
        })}
      </g>

      {error && (
        <text x={W/2} y={H/2} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="14">
          Map data failed to load: {error}
        </text>
      )}

      {!geo && !error && (
        <text x={W/2} y={H/2} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="13"
              fontFamily="'JetBrains Mono', monospace">
          Loading geography…
        </text>
      )}

      <g style={{
        transform: `translate(${pan.x}px, ${pan.y}px)`,
        transition: dragging ? 'none' : 'transform 0.55s cubic-bezier(.2,.7,.2,1)',
      }}>

      {/* All countries — neighbors faded, DMCs colored by risk */}
      {geo && geo.countries.features.map((f, i) => {
        const id = NAME_TO_ID[(f.properties && f.properties.name || '').toLowerCase()]
                || NAME_TO_ID[String(f.id).padStart(3, '0')]
                || NAME_TO_ID[String(f.id)];
        const isDmc = !!id;
        const isSel = id === selected;
        const risk = id ? (riskByCountry[id] || 'moderate') : null;
        const fill = isDmc ? RISK_COLOR[risk] : 'var(--map-land, #1c2440)';
        const opacity = isDmc ? (isSel ? 0.85 : 0.45) : 0.55;
        return (
          <path key={i}
            d={geometryToPath(f.geometry, project)}
            fill={fill}
            fillOpacity={opacity}
            stroke={isDmc ? (isSel ? 'rgba(255,255,255,0.65)' : 'var(--map-coast)') : 'var(--map-coast)'}
            strokeWidth={isSel ? 1.0 : 0.4}
            style={{ cursor: isDmc ? 'pointer' : 'default', transition: 'fill-opacity 0.2s, stroke 0.2s' }}
            onClick={() => { if (isDmc && !dragRef.current.moved) onSelect(id); }}
          />
        );
      })}

      {/* State / province lines — only inside DMCs */}
      {geo && geo.stateLines.features.map((f, i) => (
        <path key={'s'+i}
          d={geometryToPath(f.geometry, project)}
          fill="none"
          stroke="var(--map-state, rgba(255,255,255,0.14))"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          pointerEvents="none"
        />
      ))}

      {/* Infra corridor */}
      {showInfra && anchors.pakistan && anchors.india && anchors.bangladesh && anchors.srilanka && (
        <g pointerEvents="none">
          <path d={`M${anchors.pakistan.x},${anchors.pakistan.y} Q${anchors.india.x},${anchors.india.y - 80} ${anchors.bangladesh.x},${anchors.bangladesh.y}`}
                fill="none" stroke="#c39bff" strokeWidth="2" strokeDasharray="4 6" opacity="0.8"/>
          <path d={`M${anchors.india.x},${anchors.india.y} L${anchors.srilanka.x},${anchors.srilanka.y}`}
                fill="none" stroke="#c39bff" strokeWidth="2" strokeDasharray="4 6" opacity="0.8"/>
        </g>
      )}

      {/* Project markers */}
      {showProjects && Object.entries(anchors).map(([id, a]) => {
        const count = Math.min(18, Math.floor((projectCounts[id] || 0) / 30) + 3);
        const pts = detDots(id, a.x, a.y, 28, count, 1);
        return (
          <g key={'p'+id} pointerEvents="none">
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2.4" fill="#7b8cff" opacity="0.95"
                      stroke="rgba(123,140,255,0.35)" strokeWidth="3"/>
            ))}
          </g>
        );
      })}

      {/* Climate triangles */}
      {showClimate && Object.entries(anchors).map(([id, a]) => {
        const count = climateCounts[id] || 0;
        const pts = detDots(id, a.x + 4, a.y - 4, 22, count, 7);
        return (
          <g key={'c'+id} pointerEvents="none">
            {pts.map((p, i) => (
              <polygon key={i}
                points={`${p.x},${p.y-4} ${p.x-3.5},${p.y+2.5} ${p.x+3.5},${p.y+2.5}`}
                fill="#ef5876" opacity="0.95"/>
            ))}
          </g>
        );
      })}

      {/* Country labels */}
      {showLabels && Object.entries(anchors).map(([id, a]) => {
        const isSel = id === selected;
        return (
          <g key={'l'+id} onClick={() => { if (!dragRef.current.moved) onSelect(id); }} style={{ cursor: 'pointer' }}>
            <text x={a.x} y={a.y + 4} textAnchor="middle"
                  fill={isSel ? '#fff' : 'rgba(255,255,255,0.85)'}
                  fontSize={isSel ? 14 : 11}
                  fontWeight={isSel ? 700 : 600}
                  fontFamily="'JetBrains Mono', monospace"
                  style={{ pointerEvents: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.85)' }}>
              {a.label}
            </text>
          </g>
        );
      })}
      </g>
    </svg>
  );
};

window.StylizedMap = StylizedMap;
window.RISK_COLOR = RISK_COLOR;
