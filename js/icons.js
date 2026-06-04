/* ═══════════════════════════════════════════════════════════
   UNIUTY PORTAL — PROFESSIONAL SVG ICON LIBRARY
   All icons are inline SVG (16×16 viewBox), stroke-based,
   Lucide-style. No external fonts or icon kits required.
═══════════════════════════════════════════════════════════ */

const ICONS = {
  /* ─── Navigation & Layout ─── */
  grid:        '<rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>',
  list:        '<path d="M2 4h12M2 8h8M2 12h10"/>',
  menu:        '<path d="M2 4h12M2 8h12M2 12h12"/>',
  house:       '<path d="M3 14V5.5l5-3.5 5 3.5V14"/><rect x="6" y="10" width="4" height="4"/>',
  search:      '<circle cx="6.5" cy="6.5" r="4.5"/><path d="M10.5 10.5l3.5 3.5"/>',
  bell:        '<path d="M8 2a5 5 0 015 5v3l1 2H2l1-2V7a5 5 0 015-5z"/><path d="M6.5 13.5a1.5 1.5 0 003 0"/>',
  logout:      '<path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"/>',
  chevron_r:   '<path d="M6 4l4 4-4 4"/>',
  chevron_d:   '<path d="M4 6l4 4 4-4"/>',
  x:           '<path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/>',
  refresh:     '<path d="M13 6A5 5 0 002 9M3 9l-1.5 2.5 2.5-.5"/><path d="M3 12A5 5 0 0014 9M13 9l1.5-2.5-2.5.5"/>',

  /* ─── People & Identity ─── */
  person:      '<circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>',
  people:      '<circle cx="5.5" cy="5" r="2.5"/><path d="M1 13c0-2.8 2.2-5 4.5-5"/><circle cx="11" cy="6.5" r="2"/><path d="M9 13c0-2.2 1.3-4 3.5-4M14 13c0-2-1.2-3.8-3-4.5"/>',
  user:        '<circle cx="8" cy="6" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>',

  /* ─── Role Icons (replacing emojis) ─── */
  shield:      '<path d="M8 1.5L2 4.5v5C2 13 4.8 15.5 8 16.5c3.2-1 6-3.5 6-7v-5L8 1.5z" stroke-linejoin="round"/><path d="M5.5 8.5l2 2 3-3.5"/>',
  mortarboard: '<path d="M8 3.5L1.5 7 8 10.5 14.5 7 8 3.5z"/><path d="M5 8.5v3l3 1.5 3-1.5v-3"/><line x1="14.5" y1="7" x2="14.5" y2="11"/>',
  lectern:     '<rect x="3" y="5" width="10" height="9" rx="1.5"/><path d="M1 5h14M6 5V3h4v2"/><path d="M6 10h4M6 12.5h2"/>',
  student_hat: '<path d="M3 8.5L8 6l5 2.5-5 2.5L3 8.5z"/><path d="M5.5 9.5v2.5c0 1.1 1.1 2 2.5 2s2.5-.9 2.5-2V9.5"/><circle cx="13" cy="8.5" r=".8" fill="currentColor"/>',

  /* ─── Documents & Files ─── */
  doc:         '<rect x="3" y="1" width="10" height="14" rx="1.5"/><path d="M5.5 5h5M5.5 8h5M5.5 11h3"/>',
  audit:       '<rect x="2" y="1" width="12" height="14" rx="1.5"/><path d="M5 5h6M5 8h6M5 11h4"/>',
  book:        '<path d="M2 4a2 2 0 012-2h5v12H4a2 2 0 01-2-2V4z"/><path d="M14 4a2 2 0 00-2-2H9v12h3a2 2 0 002-2V4z"/>',
  file_text:   '<rect x="3" y="1" width="10" height="14" rx="1.5"/><path d="M6 5h4M6 8h4M6 11h2.5"/>',
  file_chart:  '<rect x="3" y="1" width="10" height="14" rx="1.5"/><path d="M6 11V8M8.5 11V6M11 11V9"/>',
  folder:      '<path d="M2 5a2 2 0 012-2h3l1.5 1.5H14a1 1 0 011 1v7a1 1 0 01-1 1H4a2 2 0 01-2-2V5z"/>',
  upload:      '<path d="M8 10V3M5.5 5.5L8 3l2.5 2.5"/><path d="M3 13h10"/>',
  download:    '<path d="M8 3v9M5.5 9.5L8 12l2.5-2.5"/><path d="M3 13h10"/>',

  /* ─── Academic & Results ─── */
  chart:       '<path d="M2 12l4-5 3 3 5-7"/><path d="M12 5h3v3"/>',
  bar_chart:   '<path d="M3 12V8M8 12V4M13 12V7"/>',
  award:       '<circle cx="8" cy="6.5" r="4"/><path d="M5.5 10l-2 5 4.5-1.5L12.5 15l-2-5"/>',
  trending_up: '<path d="M2 12l4-5 3 3 5-7"/><path d="M11 5h4v4"/>',
  check_sq:    '<rect x="2" y="2" width="12" height="12" rx="2"/><path d="M5 8l2 2 4-4"/>',

  /* ─── Finance ─── */
  money:       '<rect x="1" y="4" width="14" height="9" rx="1.5"/><path d="M1 7.5h14"/><circle cx="5" cy="10.5" r="1" fill="currentColor"/>',
  banknote:    '<rect x="1" y="5" width="14" height="8" rx="1.5"/><circle cx="8" cy="9" r="2"/><path d="M3 8h.5M12.5 8h.5M3 10.5h.5M12.5 10.5h.5"/>',
  credit_card: '<rect x="1" y="4" width="14" height="9" rx="1.5"/><path d="M1 7.5h14M4 11h3"/>',

  /* ─── Time & Calendar ─── */
  cal:         '<rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M5 2v2M11 2v2M2 7h12"/><rect x="5" y="9" width="2" height="2" fill="currentColor"/><rect x="9" y="9" width="2" height="2" fill="currentColor"/>',
  clock:       '<circle cx="8" cy="8" r="6"/><path d="M8 5v3.5l2 1.5"/>',

  /* ─── Communication ─── */
  msg:         '<path d="M2 3h12v9H9l-3 2.5V12H2V3z"/>',
  mail:        '<rect x="2" y="4" width="12" height="9" rx="1.5"/><path d="M2 4.5l6 4.5 6-4.5"/>',
  phone:       '<path d="M4.5 2h2l1 3.5-1.5 1c.8 1.6 2 2.8 3.5 3.5l1-1.5L14 9.5v2A1.5 1.5 0 0112.5 13C7 13 3 9 3 3.5A1.5 1.5 0 014.5 2z"/>',
  chat:        '<path d="M2 3h12v8H9l-3 2.5V11H2V3z"/>',

  /* ─── Security & Auth ─── */
  lock:        '<rect x="3" y="7" width="10" height="8" rx="1.5"/><path d="M5 7V5a3 3 0 016 0v2"/><circle cx="8" cy="11" r="1.5" fill="currentColor"/>',
  key:         '<circle cx="6" cy="9" r="3.5"/><path d="M8.5 6.5l5 5M11.5 8.5l1.5 1.5M14 8l-1.5-1.5"/>',
  eye:         '<path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2" fill="currentColor"/>',
  eye_off:     '<path d="M2 2l12 12M6.5 6.5A3 3 0 0011.5 11.5"/><path d="M3.5 5C2.3 6 1 8 1 8s3 5 7 5c1.3 0 2.5-.4 3.5-1M7 3.1C7.3 3 7.7 3 8 3c4 0 7 5 7 5s-.7 1.2-1.8 2.3"/>',

  /* ─── Biometric (hardware-specific) ─── */
  fingerprint: '<path d="M8 1.5a6.5 6.5 0 016.5 6.5"/><path d="M1.5 8A6.5 6.5 0 018 1.5"/><path d="M8 5a3 3 0 013 3c0 2-.8 3.5-2 4.5"/><path d="M5 8a3 3 0 001.5 2.6"/><path d="M8 5v3.5"/><path d="M2.5 12A7.5 7.5 0 008 14.5"/><path d="M11.5 13A6 6 0 0014 8"/>',
  retina:      '<circle cx="8" cy="8" r="6.5"/><circle cx="8" cy="8" r="3.5"/><circle cx="8" cy="8" r="1" fill="currentColor"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/>',
  face_scan:   '<path d="M3 4V3h1M13 3h1v1M4 13H3v-1M13 13v1h-1"/><circle cx="8" cy="8" r="3"/><circle cx="8" cy="8" r="1" fill="currentColor"/><path d="M6 6l-1-1M10 6l1-1M6 10l-1 1M10 10l1 1"/>',
  nfc:         '<rect x="2" y="2" width="12" height="12" rx="2.5"/><path d="M5 11V8a3 3 0 016 0v3"/><path d="M5 9.5h6"/><circle cx="8" cy="13" r="0" fill="currentColor"/>',
  contactless: '<path d="M10 5a5 5 0 010 6"/><path d="M12.5 2.5a9 9 0 010 11"/><path d="M5 6.5a2.5 2.5 0 000 3"/><path d="M2.5 4a7 7 0 000 8"/><circle cx="3.5" cy="8" r="1" fill="currentColor"/>',

  /* ─── Settings & Config ─── */
  cog:         '<circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M3.5 12.5l1.5-1.5M11 5l1.5-1.5"/>',
  sliders:     '<path d="M4 14V9M4 5V2"/><path d="M8 14V11M8 7V2"/><path d="M12 14V11M12 7V2"/><circle cx="4" cy="7" r="2"/><circle cx="8" cy="9" r="2"/><circle cx="12" cy="9" r="2"/>',
  plus:        '<path d="M8 2v12M2 8h12"/>',
  minus:       '<path d="M3 8h10"/>',
  check:       '<path d="M2.5 8.5l3.5 3.5 7-7"/>',

  /* ─── Status ─── */
  check_circle: '<circle cx="8" cy="8" r="6"/><path d="M5.5 8l2 2 3.5-3"/>',
  alert_tri:    '<path d="M8 3L1.5 13.5h13L8 3z"/><path d="M8 8v2.5"/><circle cx="8" cy="12" r=".7" fill="currentColor"/>',
  info_circle:  '<circle cx="8" cy="8" r="6"/><path d="M8 7.5V11"/><circle cx="8" cy="6" r=".7" fill="currentColor"/>',
  x_circle:     '<circle cx="8" cy="8" r="6"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5"/>',
  wifi:         '<path d="M1.5 6.5a9 9 0 0113 0"/><path d="M4 9a6 6 0 018 0"/><path d="M6.5 11.5a3 3 0 013 0"/><circle cx="8" cy="14" r="1" fill="currentColor"/>',
  server:       '<rect x="2" y="2" width="12" height="5" rx="1.5"/><rect x="2" y="9" width="12" height="5" rx="1.5"/><circle cx="5" cy="4.5" r="1" fill="currentColor"/><circle cx="5" cy="11.5" r="1" fill="currentColor"/>',
  cpu:          '<rect x="3" y="3" width="10" height="10" rx="1.5"/><path d="M6 3V1M10 3V1M6 15v-2M10 15v-2M3 6H1M3 10H1M15 6h-2M15 10h-2"/><rect x="6" y="6" width="4" height="4"/>',
  database:     '<ellipse cx="8" cy="4" rx="6" ry="2"/><path d="M14 4v4c0 1.1-2.7 2-6 2S2 9.1 2 8V4"/><path d="M14 8v4c0 1.1-2.7 2-6 2S2 13.1 2 12V8"/>',

  /* ─── Report & Print ─── */
  print:        '<rect x="3" y="7" width="10" height="6" rx="1"/><path d="M3 7V4h10v3"/><path d="M5 13v-2h6v2"/><circle cx="12" cy="10" r=".8" fill="currentColor"/>',

  /* ─── Map / Location ─── */
  map_pin:      '<path d="M8 2a4 4 0 00-4 4c0 3.5 4 8 4 8s4-4.5 4-8a4 4 0 00-4-4z"/><circle cx="8" cy="6" r="1.5" fill="currentColor"/>',
  building:     '<rect x="2" y="4" width="12" height="11" rx="1"/><path d="M2 8h12"/><rect x="5" y="11" width="2" height="4" fill="currentColor" rx=".5"/><rect x="9" y="11" width="2" height="4" fill="currentColor" rx=".5"/><rect x="5" y="5.5" width="2" height="1.5" rx=".5"/><rect x="9" y="5.5" width="2" height="1.5" rx=".5"/>',
};

/**
 * Render an inline SVG icon.
 * @param {string} name   - Key from ICONS
 * @param {number} size   - Width/height in px (default 14)
 * @param {string} extra  - Extra CSS string applied to the SVG element
 */
function icon(name, size = 14, extra = '') {
  const path = ICONS[name] || ICONS.file_text;
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0${extra ? ';' + extra : ''}">${path}</svg>`;
}

/** Convenience: render icon from raw SVG path string (legacy support) */
function iconPath(path, size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">${path}</svg>`;
}

function navIcon(k) { return icon(k, 14); }
