/* ═══════════════════════════════════════════════════════════
   UNIUTY PORTAL — SHARED HELPERS
   Reusable rendering functions used by all page modules.
═══════════════════════════════════════════════════════════ */

/* ── Grade logic ── */
function getGrade(total) {
  if (total >= 70) return { g: 'A', cls: 'p-ok' };
  if (total >= 60) return { g: 'B', cls: 'p-b'  };
  if (total >= 50) return { g: 'C', cls: 'p-w'  };
  if (total >= 45) return { g: 'D', cls: 'p-w'  };
  return { g: 'F', cls: 'p-d' };
}

/* ── Pill / badge ── */
function pill(label, cls) {
  return `<span class="pill ${cls}">${label}</span>`;
}

function gradePill(g) {
  const m = { A: 'p-ok', B: 'p-b', C: 'p-w', D: 'p-w', F: 'p-d', '—': 'p-g' };
  return pill(g, m[g] || 'p-g');
}

/* ── Alert banners ── */
function alert_(type, msg) {
  const map = {
    ok: { cls: 'al-ok', ico: 'check_circle' },
    w:  { cls: 'al-w',  ico: 'alert_tri'   },
    d:  { cls: 'al-d',  ico: 'alert_tri'   },
    i:  { cls: 'al-i',  ico: 'info_circle' },
  };
  const { cls, ico } = map[type] || map.i;
  return `<div class="alert ${cls}">${icon(ico, 14)}<span>${msg}</span></div>`;
}

/* ── Bio verified badge ── */
function bioBadge(ok) {
  return ok
    ? `<span style="display:inline-flex;align-items:center;gap:4px;color:var(--success);font-size:11px">${icon('check_circle', 12)} Verified</span>`
    : `<span style="display:inline-flex;align-items:center;gap:4px;color:var(--warn);font-size:11px">${icon('alert_tri', 12)} Pending</span>`;
}

/* ── Progress bar ── */
function barTrack(pct, color = 'var(--gold)') {
  return `<div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>`;
}

/* ── Trend bar chart ── */
function trendBars(vals, highlightLast = true) {
  const max = Math.max(...vals);
  return vals.map((v, i) => {
    const isLast = highlightLast && i === vals.length - 1;
    const h = Math.round((v / max) * 100);
    const bg = isLast ? 'var(--navy)' : 'var(--gold)';
    return `<div style="flex:1;height:${h}%;border-radius:3px 3px 0 0;background:${bg};opacity:${isLast ? 1 : 0.7}"></div>`;
  }).join('');
}

/* ── Biometric scanner cards ── */
const BIO_META = [
  { key: 'fingerprint', label: 'Fingerprint', iconName: 'fingerprint' },
  { key: 'retina',      label: 'Retina',      iconName: 'retina'      },
  { key: 'facial',      label: 'Facial Scan', iconName: 'face_scan'   },
  { key: 'nfc',         label: 'NFC Card',    iconName: 'nfc'         },
];

function bioCards(resultId = 'bioResult') {
  const cards = BIO_META.map((m, i) => `
    <div class="bio-card" id="bc${i}" onclick="runBio(${i},'${resultId}')">
      <div class="bio-ico">${icon(m.iconName, 22)}</div>
      <div class="bio-nm">${m.label}</div>
      <div class="bio-st st-idle" id="bs${i}">Tap to scan</div>
    </div>`).join('');
  return `<div class="bio-grid">${cards}</div><div id="${resultId}" style="display:none"></div>`;
}

/* ── Messages page ── */
function messagesPage(msgs) {
  const unread = msgs.filter(m => m.unread).length;
  return `
    <div class="pg-title">Messages</div>
    <div class="pg-sub">${unread} unread message${unread !== 1 ? 's' : ''}</div>
    <div class="panel">
      ${msgs.map(m => `
        <div class="msg-item">
          <div class="msg-avi" style="background:${m.bg};color:${m.tc}">${m.avi}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
              <div style="font-size:13px;font-weight:${m.unread ? '600' : '500'}">${m.from}</div>
              <div style="font-size:11px;color:var(--muted);flex-shrink:0">${m.time}</div>
            </div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.preview}</div>
          </div>
          ${m.unread ? '<div class="unread-dot"></div>' : ''}
        </div>`).join('')}
    </div>`;
}

/* ── Result filter ── */
function filterAdminResults(q) {
  const rows = document.querySelectorAll('#adminResultsTb tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}
