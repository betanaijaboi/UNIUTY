// ═══════════════════════════════════════════════════════
//  UNIUTY University Portal — Main JavaScript
//  public/js/main.js
// ═══════════════════════════════════════════════════════

'use strict';

// ── Socket.IO connection (real-time biometric events) ───
// This connects to the Node.js server for live scanner updates
const socket = typeof io !== 'undefined'
  ? io(window.location.origin, { autoConnect: false })
  : null;

// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
const App = {
  user:        null,
  token:       localStorage.getItem('uniuty_token') || null,
  role:        null,
  page:        'dashboard',
  bioVerified: false,
  bioToken:    null,
  scanScores:  {},
  activeCourse: 0,
};

// ═══════════════════════════════════════════════════════
// API CLIENT
// Wrapper around fetch that auto-attaches JWT token
// ═══════════════════════════════════════════════════════
const API = {
  baseURL: '/api',

  async request(method, endpoint, data = null) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (App.token) {
      headers['Authorization'] = `Bearer ${App.token}`;
    }
    if (App.bioToken) {
      headers['X-Biometric-Token'] = App.bioToken;
    }

    const config = { method, headers };
    if (data) config.body = JSON.stringify(data);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const json     = await response.json();

      if (response.status === 401) {
        // Token expired — redirect to login
        App.logout();
        return null;
      }

      return json;
    } catch (err) {
      console.error(`API Error [${method} ${endpoint}]:`, err);
      UI.showToast('Connection error — please check your internet', 'error');
      return null;
    }
  },

  get:    (endpoint)       => API.request('GET',    endpoint),
  post:   (endpoint, data) => API.request('POST',   endpoint, data),
  put:    (endpoint, data) => API.request('PUT',    endpoint, data),
  delete: (endpoint)       => API.request('DELETE', endpoint),
};

// ═══════════════════════════════════════════════════════
// BIOMETRIC SERVICE (Frontend)
// Talks to the backend biometric API + receives real-time
// updates via Socket.IO from the physical scanner
// ═══════════════════════════════════════════════════════
const Biometric = {

  // Start a biometric scan
  async startScan(method, userId, purpose, cardId, statusElId, resultElId) {
    const card      = document.getElementById(cardId);
    const statusEl  = document.getElementById(statusElId);
    const resultEl  = document.getElementById(resultElId);

    if (!card || card.classList.contains('scanning')) return;

    // Reset UI
    card.classList.remove('done', 'failed');
    card.classList.add('scanning');
    if (statusEl) { statusEl.className = 'bio-st st-spin'; statusEl.textContent = 'Scanning...'; }
    if (resultEl) { resultEl.style.display = 'none'; resultEl.className = 'bio-result'; }

    // Tell server our user is ready for a scan (joins Socket.IO room)
    if (socket && socket.connected) {
      socket.emit('biometric:start-scan', { userId, method });
    }

    try {
      // Call the backend biometric API
      const endpoint = `/biometric/verify/${method}`;
      const result   = await API.post(endpoint, { userId, purpose });

      if (!result) {
        return Biometric.showFailure(card, statusEl, resultEl, 'Connection error');
      }

      if (result.success) {
        Biometric.showSuccess(card, statusEl, resultEl, result, method);
        // Store the biometric token for later use (e.g., result submission)
        if (result.submissionToken) {
          App.bioToken    = result.submissionToken;
          App.bioVerified = true;
        }
      } else {
        Biometric.showFailure(card, statusEl, resultEl, result.error || 'Match failed');
      }

      return result;

    } catch (err) {
      Biometric.showFailure(card, statusEl, resultEl, 'Scan error — try again');
    }
  },

  showSuccess(card, statusEl, resultEl, result, method) {
    card.classList.remove('scanning');
    card.classList.add('done');
    if (statusEl) { statusEl.className = 'bio-st st-ok'; statusEl.textContent = '✓ Verified'; }
    if (resultEl) {
      resultEl.className   = 'bio-result ok';
      resultEl.style.display = 'block';
      resultEl.textContent = `✓ ${method} verified — score: ${result.matchScore || 'N/A'}`;
    }
    UI.showToast('Biometric verification successful', 'success');
  },

  showFailure(card, statusEl, resultEl, message) {
    if (card)     { card.classList.remove('scanning'); card.classList.add('failed'); }
    if (statusEl) { statusEl.className = 'bio-st st-bad'; statusEl.textContent = '✗ Failed'; }
    if (resultEl) {
      resultEl.className   = 'bio-result bad';
      resultEl.style.display = 'block';
      resultEl.textContent = `✗ ${message} — try again or use another method`;
    }
    UI.showToast(message, 'error');
  },

  // Simulate scan when backend isn't available (demo mode)
  async simulateScan(method, cardId, statusElId, resultElId) {
    const card     = document.getElementById(cardId);
    const statusEl = document.getElementById(statusElId);
    const resultEl = document.getElementById(resultElId);

    if (!card || card.classList.contains('scanning')) return;

    card.classList.remove('done', 'failed');
    card.classList.add('scanning');
    if (statusEl) { statusEl.className = 'bio-st st-spin'; statusEl.textContent = 'Scanning...'; }
    if (resultEl) { resultEl.style.display = 'none'; }

    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% pass rate
        const score   = success
          ? Math.floor(Math.random() * 25) + 68  // 68-93
          : Math.floor(Math.random() * 30);       // 0-30

        if (success) {
          Biometric.showSuccess(card, statusEl, resultEl, { matchScore: score }, method);
          App.bioVerified = true;
          App.bioToken    = 'sim_token_' + Date.now(); // Demo token
        } else {
          Biometric.showFailure(card, statusEl, resultEl, `Score too low (${score}) — try again`);
        }
        resolve({ success, matchScore: score });
      }, 2000);
    });
  },

  // Listen for real-time scan results pushed from server
  setupSocketListeners(userId) {
    if (!socket) return;
    socket.connect();

    // Server pushes this when finger is detected on hardware
    socket.on('biometric:scanning', ({ method, message }) => {
      console.log(`📡 Scanner: ${message}`);
    });

    // Server pushes final result
    socket.on('biometric:result', ({ success, matchScore, method }) => {
      console.log(`📡 Biometric result — ${method}: ${success ? '✓' : '✗'} (${matchScore})`);
    });

    // Progress during enrolment (3 captures)
    socket.on('biometric:progress', ({ step, total, message }) => {
      UI.showToast(`${message} (${step}/${total})`, 'info');
    });

    // Enrolment complete
    socket.on('biometric:enrolled', ({ method }) => {
      UI.showToast(`${method} enrolled successfully!`, 'success');
    });

    // Hardware error
    socket.on('biometric:error', ({ message }) => {
      UI.showToast(`Scanner error: ${message}`, 'error');
    });
  },
};

// ═══════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════
const UI = {

  // Show a toast notification
  showToast(message, type = 'info') {
    const existing = document.getElementById('uniuty-toast');
    if (existing) existing.remove();

    const colors = {
      success: { bg: '#EBF5EC', color: '#0e5e3b', border: 'rgba(26,127,90,0.2)' },
      error:   { bg: '#FCEAEA', color: '#791f1f', border: 'rgba(179,58,58,0.2)' },
      info:    { bg: '#E6F0FB', color: '#0c447c', border: 'rgba(26,95,158,0.2)'  },
      warning: { bg: '#FFF5E0', color: '#8a6a1a', border: 'rgba(201,168,76,0.3)' },
    };
    const c = colors[type] || colors.info;

    const toast = document.createElement('div');
    toast.id    = 'uniuty-toast';
    Object.assign(toast.style, {
      position:     'fixed',
      bottom:       window.innerWidth <= 768 ? '70px' : '24px',
      left:         '50%',
      transform:    'translateX(-50%)',
      background:   c.bg,
      color:        c.color,
      border:       `1px solid ${c.border}`,
      borderRadius: '10px',
      padding:      '12px 20px',
      fontSize:     '13px',
      fontWeight:   '500',
      zIndex:       '9999',
      boxShadow:    '0 4px 20px rgba(0,0,0,0.12)',
      maxWidth:     '90vw',
      textAlign:    'center',
      fontFamily:   "'DM Sans', sans-serif",
      animation:    'toastIn 0.3s ease',
    });
    toast.textContent = message;

    // Add animation keyframe
    if (!document.getElementById('toast-style')) {
      const style = document.createElement('style');
      style.id    = 'toast-style';
      style.textContent = `
        @keyframes toastIn  { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        @keyframes toastOut { from { opacity:1; } to { opacity:0; } }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Show loading spinner inside an element
  showLoading(elementId, message = 'Loading...') {
    const el = document.getElementById(elementId);
    if (el) {
      el.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;gap:10px;padding:20px;color:var(--muted);font-size:13px">
          <div style="width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite"></div>
          ${message}
        </div>`;
      // Ensure spin animation exists
      if (!document.getElementById('spin-style')) {
        const s = document.createElement('style');
        s.id    = 'spin-style';
        s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(s);
      }
    }
  },

  // Update topbar title
  setTitle(text) {
    const el = document.getElementById('pgTitle');
    if (el) el.textContent = text;
  },
};

// ═══════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════
let selectedRole = 'admin';

function selectRole(el, role) {
  document.querySelectorAll('.login-role-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedRole = role;

  const defaults = {
    admin:    'ADM-001',
    vc:       'VC-001',
    lecturer: 'LEC-0042',
    student:  'UNIUTY/2022/0814',
  };
  const idField = document.getElementById('loginId');
  if (idField) idField.value = defaults[role] || '';
}

async function triggerBioLogin() {
  const strip = document.getElementById('bioPad');
  if (!strip) return;

  strip.innerHTML = `<span class="lbs-icon">⏳</span><div><div class="lbs-text">Scanning fingerprint...</div><div class="lbs-sub">Place finger on the reader</div></div>`;

  // In production: call the biometric verify endpoint
  // In demo: simulate after 1.5 seconds
  setTimeout(() => {
    strip.innerHTML = `<span class="lbs-icon">✅</span><div><div class="lbs-text" style="color:var(--success)">Biometric verified!</div><div class="lbs-sub">Identity confirmed — proceed to sign in</div></div>`;
    strip.style.background = '#EBF5EC';
    strip.style.borderColor = 'rgba(26,127,90,0.3)';
    App.bioVerified = true;
    UI.showToast('Fingerprint verified — ready to sign in', 'success');
  }, 1500);
}

async function doLogin() {
  const portalId = document.getElementById('loginId')?.value?.trim();
  const password = document.getElementById('loginPwd')?.value;

  if (!portalId) {
    UI.showToast('Please enter your Portal ID', 'error');
    return;
  }

  const loginBtn = document.querySelector('.login-btn');
  if (loginBtn) { loginBtn.textContent = 'Signing in...'; loginBtn.disabled = true; }

  try {
    // Try real API first
    const result = await API.post('/auth/login', { portalId, password });

    if (result?.success) {
      App.token = result.token;
      App.user  = result.user;
      App.role  = result.user.role;
      localStorage.setItem('uniuty_token', result.token);
    } else {
      // Demo mode: login with selected role tile
      App.role = selectedRole;
      App.user = DEMO_DATA.roles[selectedRole];
      console.log('🔬 Demo mode — using mock user data');
    }

    // Transition to portal
    const ls = document.getElementById('loginScreen');
    if (ls) {
      ls.style.transition = 'opacity 0.4s';
      ls.style.opacity    = '0';
      setTimeout(() => {
        ls.style.display = 'none';
        const portal = document.getElementById('portalShell');
        if (portal) portal.classList.add('visible');
        buildPortal();

        // Connect Socket.IO for real-time biometric events
        if (App.user?.id) Biometric.setupSocketListeners(App.user.id);
      }, 400);
    }

  } catch (err) {
    UI.showToast('Login failed — check your credentials', 'error');
  } finally {
    if (loginBtn) { loginBtn.textContent = 'Sign In to Portal'; loginBtn.disabled = false; }
  }
}

App.logout = function() {
  localStorage.removeItem('uniuty_token');
  App.token       = null;
  App.user        = null;
  App.role        = null;
  App.bioVerified = false;
  App.bioToken    = null;
  socket?.disconnect();

  const portal = document.getElementById('portalShell');
  if (portal) portal.classList.remove('visible');

  const ls = document.getElementById('loginScreen');
  if (ls) {
    ls.style.opacity    = '0';
    ls.style.display    = 'flex';
    ls.style.transition = 'opacity 0.4s';
    setTimeout(() => ls.style.opacity = '1', 10);
    // Reset bio strip
    const strip = document.getElementById('bioPad');
    if (strip) {
      strip.style.background  = '';
      strip.style.borderColor = '';
      strip.innerHTML = `<span class="lbs-icon">🖐</span><div><div class="lbs-text">Use Biometric Login</div><div class="lbs-sub">Fingerprint · Retina · Facial Recognition</div></div>`;
    }
  }
};

function doLogout() { App.logout(); }

// ═══════════════════════════════════════════════════════
// SIDEBAR & NAVIGATION
// ═══════════════════════════════════════════════════════
function buildPortal() {
  buildSidebar();
  buildBottomNav();
  goPage('dashboard');

  const role = DEMO_DATA.roles[App.role] || DEMO_DATA.roles.admin;
  const bioLabel = document.getElementById('bioMethodLabel');
  if (bioLabel) bioLabel.textContent = role.bioMethod + ' · 8:41 AM';
}

function buildSidebar() {
  const role  = DEMO_DATA.roles[App.role] || DEMO_DATA.roles.admin;
  const nav   = SIDEBARS[App.role] || SIDEBARS.admin;
  const sb    = document.getElementById('sidebar');
  if (!sb) return;

  sb.innerHTML = `
    <div class="sb-brand">
      <div class="sb-brand-name">UNIUTY</div>
      <div class="sb-brand-sub">University Portal</div>
      <div class="sb-portal-tag">${role.badge} Portal</div>
    </div>
    <div style="padding:8px 10px 0">
      <div class="sb-profile">
        <div class="sb-avi">${role.avi}</div>
        <div class="sb-name">${role.name}</div>
        <div class="sb-meta">${role.meta}</div>
        <span class="sb-badge">${role.badge}</span>
      </div>
    </div>
    ${nav.map(section => `
      <nav class="nav-sec">
        <div class="nav-lbl">${section.lbl}</div>
        ${section.items.map(item => {
          const badge = item.badge ? `<span class="nb ${item.badgeCls || ''}">${item.badge}</span>` : '';
          return `<div class="nav-item" id="nav-${item.id}" onclick="goPage('${item.id}');closeSidebar()">${navIcon(item.icon)} ${item.label}${badge}</div>`;
        }).join('')}
      </nav>`).join('')}
    <div class="sb-footer">
      <div><span class="bio-dot"></span>Biometric session active</div>
      <div style="margin-top:3px">2024/2025 Academic Session</div>
      <div class="logout-btn" onclick="doLogout()">
        ${svgIcon('<path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"/>',12)}
        Sign Out
      </div>
    </div>`;
}

function buildBottomNav() {
  const nav = document.getElementById('bottomNav');
  if (!nav) return;

  const items = (SIDEBARS[App.role] || SIDEBARS.admin)[0]?.items?.slice(0, 5) || [];
  nav.innerHTML = items.map(item => `
    <div class="bnav-item" id="bnav-${item.id}" onclick="goPage('${item.id}')">
      ${navIcon(item.icon)}
      <span>${item.label.split(' ')[0]}</span>
    </div>`).join('');
}

// Mobile sidebar toggle
function toggleSidebar() {
  const sb      = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sb) return;
  sb.classList.toggle('open');
  if (overlay) overlay.classList.toggle('visible');
}

function closeSidebar() {
  const sb      = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sb)      sb.classList.remove('open');
  if (overlay) overlay.classList.remove('visible');
}

function goPage(id) {
  App.page = id;

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');

  // Update bottom nav active state
  document.querySelectorAll('.bnav-item').forEach(n => n.classList.remove('active'));
  const bnavEl = document.getElementById('bnav-' + id);
  if (bnavEl) bnavEl.classList.add('active');

  // Render page
  const pages  = { ...(PAGES[App.role] || {}), ...(PAGES.shared || {}) };
  const pageFn = pages[id];
  const title  = PAGE_TITLES[id] || id.replace(/_/g, ' ');

  UI.setTitle(title + ' — 2024/2025');

  const content = document.getElementById('mainContent');
  if (content) {
    content.innerHTML = pageFn
      ? `<div class="pg active">${pageFn()}</div>`
      : `<div class="pg active"><div class="pg-title">${title}</div><div class="pg-sub">This section is coming soon.</div></div>`;
  }
}

// ═══════════════════════════════════════════════════════
// ICON HELPERS
// ═══════════════════════════════════════════════════════
const ICON_PATHS = {
  grid:   '<rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>',
  list:   '<path d="M2 4h12M2 8h8M2 12h10"/>',
  person: '<circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>',
  people: '<circle cx="6" cy="5" r="2.5"/><path d="M1 13c0-2.8 2.2-5 5-5"/><circle cx="11" cy="7" r="2"/><path d="M9 13c0-2.2 1.8-4 4-4"/>',
  doc:    '<rect x="3" y="1" width="10" height="14" rx="1.5"/><path d="M5.5 5h5M5.5 8h5M5.5 11h3"/>',
  cal:    '<rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M5 2v2M11 2v2M2 7h12"/>',
  plus:   '<path d="M8 2v12M2 8h12"/>',
  house:  '<path d="M3 14V5l5-3 5 3v9"/><rect x="6" y="10" width="4" height="4"/>',
  msg:    '<path d="M2 3h12v9H2zM2 12l3-3M14 12l-3-3"/>',
  chart:  '<path d="M2 12l4-5 3 3 5-7"/>',
  cog:    '<circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4"/>',
  audit:  '<rect x="2" y="1" width="12" height="14" rx="1.5"/><path d="M5 5h6M5 8h6M5 11h4"/>',
  user:   '<circle cx="8" cy="6" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>',
  lock:   '<rect x="3" y="7" width="10" height="8" rx="1.5"/><path d="M5 7V5a3 3 0 016 0v2"/>',
  clock:  '<circle cx="8" cy="8" r="6"/><path d="M8 5v4l2 2"/>',
  check:  '<rect x="2" y="2" width="12" height="12" rx="2"/><path d="M5 8l2 2 4-4"/>',
  book:   '<rect x="2" y="2" width="12" height="12" rx="2"/><path d="M5 6h6M5 9h4"/>',
  money:  '<rect x="1" y="4" width="14" height="9" rx="1.5"/><path d="M1 7h14"/><circle cx="5" cy="10" r="1"/>',
  info:   '<circle cx="8" cy="8" r="6"/><path d="M8 6v4"/>',
  warn:   '<path d="M8 2L14 13H2L8 2z"/><path d="M8 7v3"/>',
  tick:   '<path d="M2 8l4 4 8-8"/>',
};

function svgIcon(path, size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">${path}</svg>`;
}

function navIcon(key) {
  const path = ICON_PATHS[key] || ICON_PATHS.doc;
  // Check if path has fill (for grid icon)
  if (path.includes('fill="currentColor"')) {
    return `<svg width="14" height="14" viewBox="0 0 16 16">${path}</svg>`;
  }
  return svgIcon(path, 14);
}

// ═══════════════════════════════════════════════════════
// TEMPLATE HELPERS
// ═══════════════════════════════════════════════════════
function pill(label, cls) { return `<span class="pill ${cls}">${label}</span>`; }

function gradePill(g) {
  const m = { A:'p-ok', B:'p-b', C:'p-w', D:'p-w', F:'p-d', '—':'p-g' };
  return pill(g, m[g] || 'p-g');
}

function bioBadge(ok) {
  return ok
    ? '<span class="text-success fs-11">✓ Enrolled</span>'
    : '<span class="text-warn fs-11">Pending</span>';
}

function alertBox(type, msg) {
  const cls  = { ok:'al-ok', w:'al-w', d:'al-d', i:'al-i' }[type] || 'al-i';
  const path = {
    ok: ICON_PATHS.tick,
    w:  ICON_PATHS.warn,
    d:  ICON_PATHS.warn,
    i:  ICON_PATHS.info,
  }[type];
  return `<div class="alert ${cls}">${svgIcon(path, 13)} <span>${msg}</span></div>`;
}

function barTrack(pct, color = 'var(--gold)') {
  return `<div class="bar-track"><div class="bar-fill" style="width:${Math.min(100,pct)}%;background:${color}"></div></div>`;
}

function trendBars(vals, highlightLast = true) {
  const max = Math.max(...vals);
  return vals.map((v, i) =>
    `<div style="flex:1;height:${Math.round(v/max*100)}%;border-radius:3px 3px 0 0;background:${(highlightLast && i===vals.length-1)?'var(--navy)':'var(--gold)'};opacity:${(highlightLast&&i===vals.length-1)?1:0.7}"></div>`
  ).join('');
}

function bioCards(resultId = 'bioResult') {
  return `
    <div class="bio-grid">
      <div class="bio-card" id="bc0" onclick="Biometric.simulateScan('fingerprint','bc0','bs0','${resultId}')">
        <span class="bio-ico">🖐</span>
        <div class="bio-nm">Fingerprint</div>
        <div class="bio-st st-idle" id="bs0">Click to scan</div>
      </div>
      <div class="bio-card" id="bc1" onclick="Biometric.simulateScan('retina','bc1','bs1','${resultId}')">
        <span class="bio-ico">👁</span>
        <div class="bio-nm">Retina</div>
        <div class="bio-st st-idle" id="bs1">Click to scan</div>
      </div>
      <div class="bio-card" id="bc2" onclick="Biometric.simulateScan('facial','bc2','bs2','${resultId}')">
        <span class="bio-ico">🧬</span>
        <div class="bio-nm">Facial</div>
        <div class="bio-st st-idle" id="bs2">Click to scan</div>
      </div>
      <div class="bio-card" id="bc3" onclick="Biometric.simulateScan('nfc','bc3','bs3','${resultId}')">
        <span class="bio-ico">📡</span>
        <div class="bio-nm">NFC Card</div>
        <div class="bio-st st-idle" id="bs3">Click to scan</div>
      </div>
    </div>
    <div class="bio-result" id="${resultId}"></div>`;
}

function getGrade(total) {
  if (total >= 70) return { g: 'A', cls: 'p-ok' };
  if (total >= 60) return { g: 'B', cls: 'p-b' };
  if (total >= 50) return { g: 'C', cls: 'p-w' };
  if (total >= 45) return { g: 'D', cls: 'p-w' };
  return { g: 'F', cls: 'p-d' };
}

// ═══════════════════════════════════════════════════════
// RESULT POSTING (Lecturer)
// ═══════════════════════════════════════════════════════
function doLecturerVerify() {
  const btn = document.getElementById('bioPostBtn');
  if (!btn) return;
  btn.textContent = 'Scanning...';
  btn.disabled    = true;

  Biometric.simulateScan('fingerprint', 'bioVerifyCard', 'bioVerifySt', null)
    .then(result => {
      if (result?.success) {
        btn.textContent   = '✓ Verified';
        btn.style.background = 'var(--success)';
        App.bioVerified   = true;
        const strip = document.getElementById('bioPostStrip');
        if (strip) strip.style.background = '#EBF5EC';
        const st = document.getElementById('lecBioStatus');
        if (st) { st.textContent = 'Yes'; st.style.color = 'var(--success)'; }
      } else {
        btn.textContent = 'Retry';
        btn.disabled    = false;
      }
    });
}

function updateLecScore(matric, type, val) {
  const key = `${matric}_${type}`;
  App.scanScores[key] = parseInt(val) || 0;

  const id  = matric.replace(/\//g, '_');
  const s   = DEMO_DATA.lecturerStudents.find(x => x.matric === matric);
  const ca  = App.scanScores[`${matric}_ca`]  ?? s.ca;
  const ex  = App.scanScores[`${matric}_ex`]  ?? s.exam;
  const tot = ca + ex;
  const gr  = getGrade(tot);

  const tEl = document.getElementById('lt_' + id);
  const gEl = document.getElementById('lg_' + id);
  if (tEl) tEl.textContent = tot;
  if (gEl) gEl.innerHTML   = gradePill(gr.g);

  const ec = document.getElementById('lecEnteredCount');
  if (ec) ec.textContent = Math.floor(Object.keys(App.scanScores).length / 2);
}

async function submitLecResults() {
  if (!App.bioVerified) {
    UI.showToast('Please verify your identity with biometrics first', 'error');
    return;
  }

  // In production: POST to /api/results with biometric token header
  // const result = await API.post('/results', { courseCode: 'CSC 301', results: App.scanScores });
  UI.showToast('Results submitted and biometrically signed!', 'success');
  setTimeout(() => {
    alert('✅ All results submitted successfully!\n\nBiometric signature attached.\nStudents notified automatically.\nCopies sent to: Exams Office, HOD, Registrar.');
  }, 500);
}

// ═══════════════════════════════════════════════════════
// KEYBOARD & TOUCH SHORTCUTS
// ═══════════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginScreen')?.style.display !== 'none') {
    doLogin();
  }
  if (e.key === 'Escape') closeSidebar();
});

// Prevent double-tap zoom on iOS
document.addEventListener('touchend', (e) => {
  if (e.target.matches('.btn, .nav-item, .bio-card, .login-role-btn')) {
    e.preventDefault();
  }
}, { passive: false });

// ═══════════════════════════════════════════════════════
// SIDEBAR CONFIG, DEMO DATA, PAGES
// (Loaded from separate files in production)
// ═══════════════════════════════════════════════════════

// These are imported from data.js, sidebars.js, pages.js
// For single-file demo, they're defined in those separate files

console.log('🎓 UNIUTY Portal JS loaded');
