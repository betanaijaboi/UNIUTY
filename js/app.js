/* ═══════════════════════════════════════════════════════════
   UNIUTY PORTAL — CORE APPLICATION
   Login, logout, sidebar, navigation, biometric scan runner
═══════════════════════════════════════════════════════════ */

/* ── App State ── */
let currentRole  = 'admin';
let currentPage  = 'dashboard';
let bioVerified  = false;
let scores       = {};

/* ── Known accounts (username → role + display name) ── */
const KNOWN_ACCOUNTS = {
  'ADM-001':            { role: 'admin',    name: 'Dr. A. Dankwa',    pwd: 'Admin@2024!' },
  'ADM-002':            { role: 'admin',    name: 'Mrs. F. Obi',       pwd: 'Admin@2024!' },
  'VC-001':             { role: 'vc',       name: 'Prof. A. Chukwu',  pwd: 'VC@Secure24!' },
  'LEC-0042':           { role: 'lecturer', name: 'Dr. Obiora Nwosu',  pwd: 'Lec@2024!' },
  'LEC-0011':           { role: 'lecturer', name: 'Prof. A. Ikenna',   pwd: 'Lec@2024!' },
  'UNIUTY/2022/0814':   { role: 'student',  name: 'Emeka Obi',         pwd: 'Student@1234' },
  'UNIUTY/2021/0011':   { role: 'student',  name: 'Amara Okonkwo',     pwd: 'Student@1234' },
};

/* ── Role → portal IDs ── */
const ROLE_IDS = {
  admin:    'ADM-001',
  vc:       'VC-001',
  lecturer: 'LEC-0042',
  student:  'UNIUTY/2022/0814',
};

/* ── Role detection from username pattern ── */
function detectRoleFromId(val) {
  val = val.trim().toUpperCase();
  const chip     = document.getElementById('detectedRoleChip');
  const chipIcon = document.getElementById('chipIcon');
  const chipLbl  = document.getElementById('chipLabel');
  const chipMeta = document.getElementById('chipMeta');
  const chipTick = document.getElementById('chipTick');

  if (!val) { chip.style.display = 'none'; return; }

  let role = null, label = '', meta = '';
  if (val.startsWith('ADM'))     { role = 'admin';    label = 'Administrator';     meta = 'System Administrator Portal'; }
  else if (val.startsWith('VC')) { role = 'vc';       label = 'Vice Chancellor';   meta = 'Executive Portal'; }
  else if (val.startsWith('LEC')){ role = 'lecturer'; label = 'Lecturer';          meta = 'Faculty Portal'; }
  else if (val.startsWith('UNIUTY')){ role = 'student'; label = 'Student';         meta = 'Student Portal'; }

  if (!role) { chip.style.display = 'none'; return; }

  const roleIconMap = { admin: 'shield', vc: 'mortarboard', lecturer: 'lectern', student: 'student_hat' };
  chipIcon.innerHTML = icon(roleIconMap[role], 18);
  chipLbl.textContent  = label;
  chipMeta.textContent = meta;
  chipTick.innerHTML   = icon('check_circle', 14);
  chipTick.style.color = 'var(--success)';
  chip.style.display   = 'block';

  // Set role so login uses it
  currentRole = role;
}

/* ══════════════════════════════════════════════════════════
   LOGIN
══════════════════════════════════════════════════════════ */
async function triggerBioLogin() {
  const strip = document.getElementById('bioPad');
  const icon_el = strip.querySelector('.lbs-icon');
  if (icon_el) icon_el.innerHTML = icon('fingerprint', 20);
  strip.querySelector('.lbs-text').textContent = 'Scanning biometric…';
  strip.querySelector('.lbs-sub').textContent  = 'Please hold still';
  strip.classList.add('scanning');

  const result = await BiometricAPI.scan('fingerprint', ROLE_IDS[currentRole]);
  if (result.success) {
    strip.classList.remove('scanning');
    strip.classList.add('verified');
    if (icon_el) icon_el.innerHTML = icon('check_circle', 20);
    strip.querySelector('.lbs-text').style.color = 'var(--success)';
    strip.querySelector('.lbs-text').textContent = 'Biometric verified!';
    strip.querySelector('.lbs-sub').textContent  = 'Identity confirmed — proceed to sign in';
    bioVerified = true;
  } else {
    strip.classList.remove('scanning');
    strip.querySelector('.lbs-text').style.color = 'var(--danger)';
    strip.querySelector('.lbs-text').textContent = 'Scan failed — try again or use password';
    strip.querySelector('.lbs-sub').textContent  = result.message || '';
  }
}

function doLogin() {
  const id  = document.getElementById('loginId').value.trim();
  const pwd = document.getElementById('loginPwd').value.trim();

  if (!id)  { showToast('Please enter your Portal ID.', 'warn'); return; }
  if (!pwd) { showToast('Please enter your password.', 'warn');  return; }

  const account = KNOWN_ACCOUNTS[id.toUpperCase()] || KNOWN_ACCOUNTS[id];

  if (!account) {
    showToast('Portal ID not recognised. Check your ID or contact the registrar.', 'err');
    return;
  }
  if (account.pwd !== pwd) {
    _loginAttempts = (_loginAttempts || 0) + 1;
    if (_loginAttempts >= 3) {
      showToast('Account temporarily locked after 3 failed attempts. Use "Forgot password?" to recover.', 'err');
      document.querySelector('.login-btn').disabled = true;
      setTimeout(() => {
        document.querySelector('.login-btn').disabled = false;
        _loginAttempts = 0;
      }, 30000);
      return;
    }
    showToast(`Incorrect password. ${3 - _loginAttempts} attempt(s) remaining.`, 'err');
    return;
  }

  _loginAttempts = 0;
  currentRole = account.role;

  const screen = document.getElementById('loginScreen');
  screen.style.opacity = '0';
  screen.style.transition = 'opacity 0.4s';
  setTimeout(() => {
    screen.style.display = 'none';
    document.getElementById('portalShell').classList.add('visible');
    buildPortal();
  }, 400);
}

let _loginAttempts = 0;

/* ══════════════════════════════════════════════════════════
   LOGOUT
══════════════════════════════════════════════════════════ */
function doLogout() {
  document.getElementById('portalShell').classList.remove('visible');
  const ls = document.getElementById('loginScreen');
  ls.style.opacity = '0';
  ls.style.display = 'flex';
  ls.style.transition = '';
  setTimeout(() => { ls.style.transition = 'opacity 0.4s'; ls.style.opacity = '1'; }, 10);
  // Reset bio strip
  const strip = document.getElementById('bioPad');
  if (strip) {
    strip.classList.remove('verified', 'scanning');
    strip.querySelector('.lbs-icon').innerHTML = icon('fingerprint', 20);
    strip.querySelector('.lbs-text').style.color = '';
    strip.querySelector('.lbs-text').textContent = 'Use Biometric Login';
    strip.querySelector('.lbs-sub').textContent  = 'Fingerprint · Retina · Facial · NFC';
  }
  bioVerified = false;
  scores = {};
  closeSidebar();
}

/* ══════════════════════════════════════════════════════════
   PORTAL BUILD
══════════════════════════════════════════════════════════ */
function buildPortal() {
  buildSidebar();
  goPage('dashboard');
  const role = DATA.roles[currentRole];
  document.getElementById('bioMethodLabel').textContent = role.bioMethod + ' · 8:41 AM';
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════ */
const SIDEBARS = {
  admin: [
    { lbl: 'Overview', items: [
      { id: 'dashboard',  label: 'Dashboard',        icon: 'grid'     },
      { id: 'results',    label: 'Exam Results',      icon: 'list'     },
      { id: 'biometric',  label: 'Biometric Auth',    icon: 'fingerprint' },
    ]},
    { lbl: 'Management', items: [
      { id: 'students',   label: 'Students',          icon: 'people'   },
      { id: 'faculty',    label: 'Faculty',            icon: 'people'   },
      { id: 'courses',    label: 'Courses',            icon: 'book'     },
      { id: 'timetable',  label: 'Timetable',          icon: 'cal'      },
    ]},
    { lbl: 'Administration', items: [
      { id: 'admissions', label: 'Admissions',         icon: 'plus'     },
      { id: 'reports',    label: 'Reports',             icon: 'chart'    },
      { id: 'settings',   label: 'Settings',            icon: 'cog'      },
      { id: 'audit',      label: 'Audit Logs',          icon: 'audit'    },
      { id: 'users',      label: 'User Management',     icon: 'user'     },
    ]},
  ],
  vc: [
    { lbl: 'Executive', items: [
      { id: 'dashboard',    label: 'University Overview',  icon: 'grid'     },
      { id: 'academic',     label: 'Academic Performance', icon: 'chart'    },
      { id: 'departments',  label: 'Departments',          icon: 'building' },
      { id: 'vc_students',  label: 'Students & Staff',     icon: 'people'   },
      { id: 'biometric',    label: 'Biometric Reports',    icon: 'lock'     },
    ]},
    { lbl: 'Governance', items: [
      { id: 'approvals', label: 'Approvals', icon: 'check_sq', badge: '5', badgeCls: 'nb-red' },
      { id: 'reports',   label: 'Senate Reports',           icon: 'doc'      },
      { id: 'audit',     label: 'Audit Trail',              icon: 'audit'    },
    ]},
  ],
  lecturer: [
    { lbl: 'Main Menu', items: [
      { id: 'dashboard',    label: 'Dashboard',         icon: 'grid'                      },
      { id: 'post_results', label: 'Post Results',       icon: 'list', badge: '!', badgeCls: 'nb-red' },
      { id: 'attendance',   label: 'Attendance',         icon: 'cal'                       },
      { id: 'materials',    label: 'Course Materials',   icon: 'doc'                       },
      { id: 'messages',     label: 'Messages',           icon: 'msg',  badge: '4'          },
    ]},
    { lbl: 'My Courses', items: [
      { id: 'post_results', label: 'CSC 301 — Data Structures',   icon: 'clock' },
      { id: 'post_results', label: 'CSC 405 — AI & ML',           icon: 'clock' },
      { id: 'post_results', label: 'CSC 201 — Data Structures I', icon: 'clock' },
    ]},
  ],
  student: [
    { lbl: 'Main Menu', items: [
      { id: 'dashboard',  label: 'Dashboard',          icon: 'grid'                },
      { id: 'my_results', label: 'My Results',          icon: 'list', badge: '2nd' },
      { id: 'transcript', label: 'Transcript',          icon: 'doc'               },
      { id: 'courses',    label: 'Courses & Schedule',  icon: 'cal'               },
      { id: 'fees',       label: 'Fee Payment',         icon: 'money'             },
      { id: 'biometric',  label: 'Biometric Profile',   icon: 'fingerprint'        },
    ]},
    { lbl: 'Support', items: [
      { id: 'messages',   label: 'Messages',            icon: 'msg',  badge: '3'  },
      { id: 'help',       label: 'Help & Support',       icon: 'person'            },
    ]},
  ],
};

function buildSidebar() {
  const role = DATA.roles[currentRole];
  const nav  = SIDEBARS[currentRole] || SIDEBARS.admin;

  let html = `
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
    </div>`;

  nav.forEach(section => {
    html += `<nav class="nav-sec"><div class="nav-lbl">${section.lbl}</div>`;
    section.items.forEach(item => {
      const badge = item.badge
        ? `<span class="nb ${item.badgeCls || ''}">${item.badge}</span>` : '';
      html += `<div class="nav-item" id="nav-${item.id}" onclick="goPage('${item.id}');closeSidebar()">
        ${navIcon(item.icon)} ${item.label}${badge}</div>`;
    });
    html += `</nav>`;
  });

  html += `
    <div class="sb-footer">
      <div style="display:flex;align-items:center"><span class="bio-dot"></span>Biometric session active</div>
      <div style="margin-top:3px;color:rgba(255,255,255,0.2)">2024/2025 Academic Session</div>
      <div class="logout-btn" onclick="doLogout()">
        ${icon('logout', 12)} Sign Out
      </div>
    </div>`;

  document.getElementById('sidebar').innerHTML = html;
}

/* ── Mobile sidebar open/close ── */
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('active');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

/* ══════════════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════════════ */
const PAGE_TITLES = {
  dashboard:    'Dashboard',           results:      'Exam Results',
  biometric:    'Biometric Auth',      students:     'Students',
  faculty:      'Faculty',             courses:      'Courses',
  timetable:    'Timetable',           admissions:   'Admissions',
  reports:      'Reports',             settings:     'System Settings',
  audit:        'Audit Logs',          users:        'User Management',
  academic:     'Academic Performance',departments:  'Departments',
  vc_students:  'Students & Staff',    approvals:    'Approvals Queue',
  post_results: 'Post Results',        attendance:   'Attendance',
  materials:    'Course Materials',    messages:     'Messages',
  my_results:   'My Results',          transcript:   'Transcript',
  fees:         'Fee Payment',         help:         'Help & Support',
};

function goPage(id) {
  currentPage = id;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');

  const pageFn = (PAGES[currentRole] || {})[id] || (PAGES.admin || {})[id];
  const title  = PAGE_TITLES[id] || id.replace(/_/g, ' ');
  document.getElementById('pgTitle').textContent = title;

  const content = document.getElementById('mainContent');
  content.innerHTML = pageFn
    ? pageFn()
    : `<div class="pg-title">${title}</div><div class="pg-sub">This section is coming soon.</div>`;
  content.scrollTop = 0;
  content.querySelectorAll('.animate-in').forEach(el => el.classList.add('animate-in'));
}

/* ══════════════════════════════════════════════════════════
   BIOMETRIC SCANNER (shared UI runner)
══════════════════════════════════════════════════════════ */
async function runBio(i, resultId) {
  const card   = document.getElementById(`bc${i}`);
  const status = document.getElementById(`bs${i}`);
  if (!card || card.classList.contains('scanning')) return;

  const method = BIO_META[i].key;
  const userId = ROLE_IDS[currentRole] || 'demo';

  card.classList.remove('done', 'failed');
  card.classList.add('scanning');
  status.className = 'bio-st st-spin';
  status.textContent = 'Scanning…';

  const resEl = document.getElementById(resultId);
  if (resEl) resEl.style.display = 'none';

  const result = await BiometricAPI.scan(method, userId);

  card.classList.remove('scanning');
  if (result.success) {
    card.classList.add('done');
    status.className = 'bio-st st-ok';
    status.textContent = '✓ Verified';
    if (resEl) {
      resEl.style.cssText = 'padding:10px 14px;border-radius:8px;font-size:12px;background:#ebf5ec;border:1px solid rgba(26,127,90,0.2);color:#0e5e3b;margin-top:10px;display:flex;align-items:center;gap:8px';
      resEl.innerHTML = `${icon('check_circle', 14)} ${BIO_META[i].label} verified — ${DATA.roles[currentRole].name}`;
    }
    bioVerified = true;
  } else {
    card.classList.add('failed');
    status.className = 'bio-st st-bad';
    status.textContent = '✗ Failed';
    if (resEl) {
      resEl.style.cssText = 'padding:10px 14px;border-radius:8px;font-size:12px;background:#fceaea;border:1px solid rgba(179,58,58,0.2);color:#791f1f;margin-top:10px;display:flex;align-items:center;gap:8px';
      resEl.innerHTML = `${icon('x_circle', 14)} ${result.message || BIO_META[i].label + ' failed — please retry'}`;
    }
  }
}

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════════════════════════ */
function showToast(msg, type = 'info') {
  const colors = { info: '#1A5F9E', warn: '#8a6a1a', ok: '#1A7F5A', err: '#B33A3A' };
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:20px;right:20px;z-index:9999;padding:10px 16px;border-radius:10px;background:${colors[type]||colors.info};color:#fff;font-size:12px;font-family:'DM Sans',sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.2);max-width:280px;animation:fadeIn 0.2s ease`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Pre-fill login icon
  const bioIcon = document.querySelector('.lbs-icon');
  if (bioIcon) bioIcon.innerHTML = icon('fingerprint', 20);
  // Role icons
  const roleIconMap = { admin: 'shield', vc: 'mortarboard', lecturer: 'lectern', student: 'student_hat' };
  document.querySelectorAll('[data-role]').forEach(btn => {
    const r = btn.dataset.role;
    const ic = btn.querySelector('.lrb-icon');
    if (ic && roleIconMap[r]) ic.innerHTML = icon(roleIconMap[r], 20);
  });
  // Notification icon
  const nb = document.querySelector('.notif-btn');
  if (nb) nb.innerHTML = `${icon('bell', 14)}<div class="pip"></div>`;
});

document.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
