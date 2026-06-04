/* ═══════════════════════════════════════════════════════════
   UNIUTY PORTAL — ADMIN PAGES
═══════════════════════════════════════════════════════════ */

const PAGES_ADMIN = {

  dashboard: () => `
    <div class="pg-title">Dashboard</div>
    <div class="pg-sub">System overview — 2024/2025 Academic Session</div>
    <div class="kgrid g4">
      <div class="kcard">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div class="kcard-lbl">Total Students</div>
          <div style="opacity:0.1">${icon('people', 28)}</div>
        </div>
        <div class="kcard-val">12,847</div>
        <div class="kcard-sub" style="color:var(--success)">+847 this session</div>
      </div>
      <div class="kcard">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div class="kcard-lbl">Academic Staff</div>
          <div style="opacity:0.1">${icon('user', 28)}</div>
        </div>
        <div class="kcard-val">634</div>
        <div class="kcard-sub" style="color:var(--success)">+12 new</div>
      </div>
      <div class="kcard">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div class="kcard-lbl">Results Posted</div>
          <div style="opacity:0.1">${icon('check_sq', 28)}</div>
        </div>
        <div class="kcard-val">94%</div>
        <div class="kcard-sub" style="color:var(--warn)">47 pending</div>
      </div>
      <div class="kcard">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div class="kcard-lbl">Bio Verifications</div>
          <div style="opacity:0.1">${icon('fingerprint', 28)}</div>
        </div>
        <div class="kcard-val">8,419</div>
        <div class="kcard-sub" style="color:var(--muted)">Today</div>
      </div>
    </div>
    ${alert_('ok', 'All biometric modules online — fingerprint, retina, facial recognition active')}
    ${alert_('w',  '3 departments pending result submission — deadline April 18')}
    ${alert_('d',  'Social Sciences, Arts, Philosophy departments — results overdue')}
    <div class="two-col">
      <div class="panel">
        <div class="ph"><div class="pt">Recent System Activity</div></div>
        ${DATA.auditLog.map(a => `
          <div class="activity-item">
            <div style="width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px;background:${a.bio ? 'var(--success)' : 'var(--danger)'}"></div>
            <div>
              <div style="font-size:12px;font-weight:500">${a.action} — ${a.user}</div>
              <div style="font-size:10px;color:var(--muted)">${a.details} · ${a.ts}</div>
            </div>
          </div>`).join('')}
      </div>
      <div class="rc">
        <div class="panel">
          <div class="ph"><div class="pt">Quick Stats</div></div>
          ${[
            ['Departments',       '14'],
            ['Active Courses',    '312'],
            ['Enrolled Biometric','13,893'],
            ['Fee Collection',    '91%'],
            ['Pass Rate',         '87.4%'],
            ['System Uptime',     '99.9%'],
          ].map(([k, v]) => `
            <div class="si-row">
              <span style="color:var(--muted)">${k}</span>
              <span style="font-weight:500">${v}</span>
            </div>`).join('')}
        </div>
        <div class="panel">
          <div class="ph"><div class="pt">Pending Actions</div></div>
          ${[
            { label: 'Result submissions',      val: 47,  bg: '#fff5e0', c: 'var(--warn)'   },
            { label: 'Bio enrollments pending', val: 234, bg: '#fceaea', c: '#791f1f'       },
            { label: 'Fee waivers to approve',  val: 18,  bg: '#e6f0fb', c: '#0c447c'       },
          ].map(p => `
            <div style="padding:8px 10px;background:${p.bg};border-radius:7px;font-size:11px;color:${p.c};display:flex;justify-content:space-between;margin-bottom:6px">
              <span>${p.label}</span><strong>${p.val}</strong>
            </div>`).join('')}
        </div>
      </div>
    </div>`,

  results: () => `
    <div class="pg-title">Exam Results</div>
    <div class="pg-sub">University-wide results management and oversight</div>
    <div class="kgrid g4">
      <div class="kcard"><div class="kcard-lbl">Total Results</div><div class="kcard-val">38,641</div></div>
      <div class="kcard"><div class="kcard-lbl">Posted</div><div class="kcard-val">36,300</div><div class="kcard-sub" style="color:var(--success)">94%</div></div>
      <div class="kcard"><div class="kcard-lbl">Pending</div><div class="kcard-val">2,341</div><div class="kcard-sub" style="color:var(--warn)">3 depts overdue</div></div>
      <div class="kcard"><div class="kcard-lbl">Bio-Verified</div><div class="kcard-val">35,980</div><div class="kcard-sub" style="color:var(--success)">99.1%</div></div>
    </div>
    ${alert_('d', 'Social Sciences, Arts and Philosophy departments have not submitted — escalation sent')}
    <div class="panel">
      <div class="ph">
        <div class="pt">All Results — 2nd Semester 2024/2025</div>
        <div class="search-row">
          <div class="sbox">${icon('search', 13)}<input placeholder="Search student / matric…" oninput="filterAdminResults(this.value)"></div>
          <select class="flt"><option value="">All Departments</option><option>CSC</option><option>ENG</option><option>MED</option><option>LAW</option></select>
          <button class="btn btn-primary" onclick="showToast('Exporting UNIUTY_Results_2025.csv…','ok')">${icon('download', 12)} Export CSV</button>
        </div>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Matric No.</th><th>Name</th><th>Dept</th><th>Course</th><th>Score</th><th>Grade</th><th>Status</th><th>Lecturer</th><th>Bio Signed</th><th>Action</th></tr></thead>
        <tbody id="adminResultsTb">${DATA.results.map(r => `<tr>
          <td style="font-family:monospace;font-size:11px">${r.matric}</td>
          <td style="font-weight:500">${r.name}</td>
          <td>${pill(r.dept, 'p-b')}</td>
          <td style="font-family:monospace;font-size:11px">${r.course}</td>
          <td style="font-weight:500">${r.score}%</td>
          <td>${gradePill(r.grade)}</td>
          <td style="font-size:11px;color:${r.status === 'Pass' ? 'var(--success)' : 'var(--danger)'}">${r.status}</td>
          <td style="font-size:11px">${r.lecturer}</td>
          <td>${bioBadge(r.bio)}</td>
          <td><button class="btn btn-outline btn-sm" onclick="showToast('Viewing result for ${r.name}','info')">View</button></td>
        </tr>`).join('')}</tbody>
      </table></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
        <span style="font-size:11px;color:var(--muted)">Showing 10 of 38,641 results</span>
        <div style="display:flex;gap:5px">
          <button class="btn btn-outline btn-sm">← Prev</button>
          <button class="btn btn-primary btn-sm">1</button>
          <button class="btn btn-outline btn-sm">2</button>
          <button class="btn btn-outline btn-sm">Next →</button>
        </div>
      </div>
    </div>
    <div class="kgrid g2">
      <div class="panel">
        <div class="ph"><div class="pt">Submission by Department</div></div>
        ${[{d:'Computer Science',p:100,c:'#1A7F5A'},{d:'Engineering',p:96,c:'#C9A84C'},{d:'Medicine',p:100,c:'#1A7F5A'},{d:'Law',p:83,c:'#C9A84C'},{d:'Social Sciences',p:64,c:'#B33A3A'},{d:'Arts',p:50,c:'#B33A3A'}].map(x => `
          <div style="margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">
              <span>${x.d}</span><span style="font-weight:500;color:${x.c}">${x.p}%</span>
            </div>${barTrack(x.p, x.c)}
          </div>`).join('')}
      </div>
      <div class="panel">
        <div class="ph"><div class="pt">Grade Distribution</div></div>
        <div style="display:flex;align-items:flex-end;gap:8px;height:80px;margin-bottom:8px">
          ${[{v:6840,c:'#1A7F5A',l:'A'},{v:12410,c:'#1A5F9E',l:'B'},{v:8980,c:'#C9A84C',l:'C'},{v:3240,c:'#B37A1A',l:'D'},{v:1620,c:'#B33A3A',l:'F'}].map(b => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
              <div style="font-size:10px;font-weight:500">${(b.v/1000).toFixed(1)}K</div>
              <div style="width:100%;height:${Math.round(b.v/12410*70)}px;border-radius:3px 3px 0 0;background:${b.c}"></div>
            </div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-around;font-size:10px;color:var(--muted)"><span>A</span><span>B</span><span>C</span><span>D</span><span>F</span></div>
      </div>
    </div>`,

  biometric: () => `
    <div class="pg-title">Biometric Authentication</div>
    <div class="pg-sub">System-wide biometric management and live monitoring</div>
    <div class="kgrid g4">
      <div class="kcard"><div class="kcard-lbl">Total Verifications</div><div class="kcard-val">8,419</div><div class="kcard-sub" style="color:var(--muted)">Today</div></div>
      <div class="kcard"><div class="kcard-lbl">Success Rate</div><div class="kcard-val">99.6%</div><div class="kcard-sub" style="color:var(--success)">Excellent</div></div>
      <div class="kcard"><div class="kcard-lbl">Failures</div><div class="kcard-val">34</div><div class="kcard-sub" style="color:var(--warn)">3 flagged</div></div>
      <div class="kcard"><div class="kcard-lbl">Enrolled Users</div><div class="kcard-val">13,893</div></div>
    </div>
    ${alert_('ok', 'All hardware online — Fingerprint (12 units), Retina (4 units), Facial cameras (8), NFC terminals (20)')}
    ${alert_('d',  'Security flag: 3 unrecognised attempts at Exam Hall C — investigation required')}
    <div class="panel" style="background:var(--navy);border-color:rgba(201,168,76,0.2)">
      <div class="ph" style="margin-bottom:14px">
        <div class="pt" style="color:var(--gold);font-size:13px">Hardware Plugin Status</div>
        <span style="font-size:11px;color:rgba(255,255,255,0.4)">BiometricAPI v1.0</span>
      </div>
      <div class="kgrid g4" style="margin-bottom:0">
        ${[{m:'fingerprint',l:'Fingerprint',ico:'fingerprint'},{m:'retina',l:'Retina',ico:'retina'},{m:'facial',l:'Facial',ico:'face_scan'},{m:'nfc',l:'NFC Card',ico:'nfc'}].map(h => `
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(201,168,76,0.15);border-radius:10px;padding:14px;text-align:center">
            <div style="display:flex;justify-content:center;margin-bottom:8px;color:var(--gold)">${icon(h.ico, 24)}</div>
            <div style="font-size:12px;font-weight:500;color:#fff">${h.l}</div>
            <div style="font-size:10px;margin-top:4px;color:#3dba7d">● Simulation mode</div>
            <button class="btn btn-sm" style="margin-top:8px;background:rgba(201,168,76,0.15);color:var(--gold);border:1px solid rgba(201,168,76,0.25)" onclick="showToast('Connect ${h.l} plugin to enable hardware','info')">Connect Plugin</button>
          </div>`).join('')}
      </div>
      <div style="margin-top:12px;font-size:10px;color:rgba(255,255,255,0.3);text-align:center">Register hardware: BiometricAPI.register('fingerprint', YourPlugin)</div>
    </div>
    <div class="three-col">
      <div class="panel">
        <div class="ph"><div class="pt">Test a Scan Method</div><span style="font-size:10px;color:var(--muted)">Live demo</span></div>
        ${bioCards('bioAdminResult')}
      </div>
      <div class="panel">
        <div class="ph"><div class="pt">Method Usage Today</div></div>
        ${[{l:'Fingerprint',p:50,v:'4,201',c:'#C9A84C'},{l:'Facial Recognition',p:35,v:'2,948',c:'#1A5F9E'},{l:'NFC Card',p:12,v:'1,018',c:'#1A7F5A'},{l:'Retina Scan',p:3,v:'252',c:'#B33A3A'}].map(x => `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px"><span>${x.l}</span><span style="font-weight:500">${x.v} (${x.p}%)</span></div>
            ${barTrack(x.p, x.c)}
          </div>`).join('')}
      </div>
      <div class="panel">
        <div class="ph"><div class="pt">Security Flags</div></div>
        ${alert_('d', 'Repeated fail — Exam Hall C · 8:15 AM')}
        ${alert_('w', 'Duplicate NFC — Library · 7:50 AM')}
        ${alert_('w', 'Unregistered print — Admin block · 7:30 AM')}
        <button class="btn btn-danger btn-block" style="margin-top:8px" onclick="showToast('Opening security investigation panel…','err')">Investigate Flags</button>
      </div>
    </div>
    <div class="panel">
      <div class="ph"><div class="pt">Live Verification Log</div><button class="btn btn-outline" onclick="showToast('Exporting log…','ok')">${icon('download', 12)} Export Log</button></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Time</th><th>User</th><th>Role</th><th>Method</th><th>Location</th><th>Purpose</th><th>Result</th></tr></thead>
        <tbody>${DATA.bioLog.map(b => `<tr>
          <td style="font-family:monospace;font-size:11px">${b.time}</td>
          <td style="font-weight:500">${b.user}</td>
          <td>${pill(b.role, b.role === 'Student' ? 'p-b' : b.role === 'Lecturer' ? 'p-ok' : b.role === 'VC' ? 'p-gold' : 'p-g')}</td>
          <td>${b.method}</td>
          <td style="font-size:11px;color:var(--muted)">${b.loc}</td>
          <td style="font-size:11px">${b.purpose}</td>
          <td style="font-size:11px;color:${b.result ? 'var(--success)' : 'var(--danger)'};display:flex;align-items:center;gap:4px">${icon(b.result ? 'check_circle' : 'x_circle', 12)} ${b.result ? 'Pass' : 'Failed'}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`,

  students: () => `
    <div class="pg-title">Students</div>
    <div class="pg-sub">All registered students — search, manage, and view profiles</div>
    <div class="kgrid g4">
      <div class="kcard"><div class="kcard-lbl">Total Students</div><div class="kcard-val">12,847</div></div>
      <div class="kcard"><div class="kcard-lbl">Undergrad</div><div class="kcard-val">11,204</div></div>
      <div class="kcard"><div class="kcard-lbl">Postgrad</div><div class="kcard-val">1,643</div></div>
      <div class="kcard"><div class="kcard-lbl">Suspended</div><div class="kcard-val" style="color:var(--danger)">23</div></div>
    </div>
    <div class="panel">
      <div class="ph">
        <div class="pt">Student Directory</div>
        <div class="search-row">
          <div class="sbox">${icon('search', 13)}<input placeholder="Search name / matric…"></div>
          <select class="flt"><option>All Levels</option><option>100L</option><option>200L</option><option>300L</option><option>400L</option></select>
          <select class="flt"><option>All Departments</option><option>CSC</option><option>ENG</option><option>MED</option></select>
          <button class="btn btn-primary" onclick="showToast('Add student form opened.','info')">${icon('plus', 12)} Add Student</button>
        </div>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Matric No.</th><th>Name</th><th>Dept</th><th>Level</th><th>CGPA</th><th>Fees</th><th>Bio</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>${DATA.students.map(s => `<tr>
          <td style="font-family:monospace;font-size:11px">${s.matric}</td>
          <td style="font-weight:500">${s.name}</td>
          <td>${pill(s.dept, 'p-b')}</td>
          <td>${s.level}</td>
          <td style="font-weight:500;color:var(--gold)">${s.cgpa.toFixed(2)}</td>
          <td style="font-size:11px;color:${s.fees === 'Full' ? 'var(--success)' : s.fees === 'Partial' ? 'var(--warn)' : 'var(--danger)'}">${s.fees}</td>
          <td>${bioBadge(s.bio)}</td>
          <td>${pill(s.status, s.status === 'Active' ? 'p-ok' : 'p-w')}</td>
          <td><div style="display:flex;gap:4px"><button class="btn btn-outline btn-sm">View</button><button class="btn btn-danger btn-sm">Suspend</button></div></td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`,

  faculty: () => `
    <div class="pg-title">Faculty</div>
    <div class="pg-sub">Academic staff management and records</div>
    <div class="kgrid g4">
      <div class="kcard"><div class="kcard-lbl">Total Staff</div><div class="kcard-val">634</div></div>
      <div class="kcard"><div class="kcard-lbl">Professors</div><div class="kcard-val">84</div></div>
      <div class="kcard"><div class="kcard-lbl">Senior Lecturers</div><div class="kcard-val">142</div></div>
      <div class="kcard"><div class="kcard-lbl">Asst. Lecturers</div><div class="kcard-val">408</div></div>
    </div>
    <div class="panel">
      <div class="ph"><div class="pt">Faculty Directory</div><button class="btn btn-primary">${icon('plus', 12)} Add Staff</button></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Staff ID</th><th>Name</th><th>Title</th><th>Dept</th><th>Courses</th><th>Results Due</th><th>Bio</th><th>Status</th></tr></thead>
        <tbody>${DATA.faculty.map(f => `<tr>
          <td style="font-family:monospace;font-size:11px">${f.id}</td>
          <td style="font-weight:500">${f.name}</td>
          <td style="font-size:11px">${f.title}</td>
          <td>${pill(f.dept, 'p-b')}</td>
          <td>${f.courses}</td>
          <td style="font-size:11px;color:var(--warn)">${f.due}</td>
          <td>${bioBadge(f.bio)}</td>
          <td>${pill(f.status, 'p-ok')}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`,

  courses: () => `
    <div class="pg-title">Courses</div>
    <div class="pg-sub">Course registry — all active and archived courses</div>
    <div class="kgrid g3">
      <div class="kcard"><div class="kcard-lbl">Total Courses</div><div class="kcard-val">312</div></div>
      <div class="kcard"><div class="kcard-lbl">Active This Semester</div><div class="kcard-val">248</div></div>
      <div class="kcard"><div class="kcard-lbl">Unassigned</div><div class="kcard-val" style="color:var(--warn)">12</div></div>
    </div>
    <div class="panel">
      <div class="ph"><div class="pt">Course Registry</div><button class="btn btn-primary">${icon('plus', 12)} Add Course</button></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Code</th><th>Title</th><th>Dept</th><th>Units</th><th>Level</th><th>Lecturer</th><th>Students</th><th>Results</th></tr></thead>
        <tbody>${DATA.courses.map(c => `<tr>
          <td style="font-family:monospace;font-weight:600">${c.code}</td>
          <td>${c.title}</td>
          <td>${pill(c.dept, 'p-b')}</td>
          <td>${c.units}</td>
          <td>${c.level}</td>
          <td style="font-size:11px">${c.lecturer}</td>
          <td>${c.students}</td>
          <td>${pill(c.results, c.results === 'Posted' ? 'p-ok' : 'p-w')}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`,

  timetable: () => `
    <div class="pg-title">Timetable</div>
    <div class="pg-sub">University-wide lecture and exam schedule</div>
    ${alert_('i', '2nd Semester exams begin April 28 — timetable finalized and published to all students')}
    <div class="panel">
      <div class="ph">
        <div class="pt">Weekly Lecture Schedule</div>
        <div class="search-row">
          <select class="flt"><option>Computer Science</option><option>Engineering</option><option>Medicine</option></select>
          <select class="flt"><option>2nd Semester</option><option>1st Semester</option></select>
        </div>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Day</th><th>Time</th><th>Course</th><th>Lecturer</th><th>Venue</th><th>Level</th><th>Students</th></tr></thead>
        <tbody>
          <tr><td style="font-weight:500">Monday</td><td>8:00–10:00 AM</td><td>CSC 301 — Data Structures</td><td>Dr. O. Nwosu</td><td>Hall B, Rm 204</td><td>300L</td><td>82</td></tr>
          <tr><td style="font-weight:500">Monday</td><td>2:00–4:00 PM</td><td>MTH 312 — Real Analysis</td><td>Dr. C. Uche</td><td>Math Block, Rm 1</td><td>300L</td><td>76</td></tr>
          <tr><td style="font-weight:500">Tuesday</td><td>10:00–12:00 PM</td><td>CSC 315 — OS</td><td>Prof. A. Ikenna</td><td>Hall A, Rm 102</td><td>300L</td><td>80</td></tr>
          <tr><td style="font-weight:500">Wednesday</td><td>9:00–12:00 PM</td><td>CSC 321 — Networks Lab</td><td>Dr. M. Bello</td><td>ICT Lab 3</td><td>300L</td><td>78</td></tr>
          <tr><td style="font-weight:500">Thursday</td><td>8:00–10:00 AM</td><td>STA 311 — Statistics</td><td>Dr. F. Garba</td><td>Stat Block, Rm 3</td><td>300L</td><td>82</td></tr>
          <tr><td style="font-weight:500">Friday</td><td>11:00 AM–1:00 PM</td><td>CSC 405 — AI & ML</td><td>Dr. O. Nwosu</td><td>ICT Lab 2</td><td>400L</td><td>64</td></tr>
        </tbody>
      </table></div>
    </div>
    <div class="panel">
      <div class="ph"><div class="pt">Exam Timetable — 2nd Semester</div><button class="btn btn-primary" onclick="showToast('Published to all students!','ok')">Publish to Students</button></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Date</th><th>Time</th><th>Course</th><th>Dept</th><th>Hall</th><th>Duration</th><th>Supervisor</th></tr></thead>
        <tbody>
          <tr><td style="font-weight:500;color:var(--warn)">Apr 28</td><td>9:00 AM</td><td>CSC 301</td><td>CSC</td><td>Exam Hall A</td><td>2 hrs</td><td>Dr. O. Nwosu</td></tr>
          <tr><td style="font-weight:500;color:var(--warn)">Apr 28</td><td>2:00 PM</td><td>ENG 301</td><td>ENG</td><td>Exam Hall B</td><td>2 hrs</td><td>Mr. T. Adeyemi</td></tr>
          <tr><td style="font-weight:500">Apr 30</td><td>9:00 AM</td><td>MTH 312</td><td>MTH</td><td>Exam Hall C</td><td>3 hrs</td><td>Dr. C. Uche</td></tr>
          <tr><td style="font-weight:500">May 3</td><td>9:00 AM</td><td>CSC 315</td><td>CSC</td><td>Exam Hall A</td><td>2 hrs</td><td>Prof. A. Ikenna</td></tr>
          <tr><td style="font-weight:500">May 5</td><td>2:00 PM</td><td>CSC 321</td><td>CSC</td><td>Exam Hall B</td><td>2 hrs</td><td>Dr. M. Bello</td></tr>
        </tbody>
      </table></div>
    </div>`,

  admissions: () => `
    <div class="pg-title">Admissions</div>
    <div class="pg-sub">Manage new student intake — 2025/2026 session</div>
    <div class="kgrid g4">
      <div class="kcard"><div class="kcard-lbl">Applications</div><div class="kcard-val">4,812</div></div>
      <div class="kcard"><div class="kcard-lbl">Admitted</div><div class="kcard-val">2,204</div><div class="kcard-sub" style="color:var(--success)">46% admit rate</div></div>
      <div class="kcard"><div class="kcard-lbl">Accepted Offer</div><div class="kcard-val">1,876</div></div>
      <div class="kcard"><div class="kcard-lbl">Pending Review</div><div class="kcard-val" style="color:var(--warn)">608</div></div>
    </div>
    <div class="panel">
      <div class="ph">
        <div class="pt">Admissions Queue</div>
        <div class="search-row">
          <div class="sbox">${icon('search', 13)}<input placeholder="Search applicant…"></div>
          <select class="flt"><option>All Statuses</option><option>Pending</option><option>Admitted</option><option>Rejected</option></select>
          <button class="btn btn-primary">Bulk Admit</button>
        </div>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>App. No.</th><th>Name</th><th>Programme</th><th>UTME</th><th>O'Level</th><th>Applied</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td style="font-family:monospace;font-size:11px">APP-2025-0041</td><td>Chisom Okafor</td><td>Computer Science</td><td>312</td><td>6 credits</td><td>Mar 15</td><td>${pill('Pending','p-w')}</td><td><div style="display:flex;gap:4px"><button class="btn btn-success btn-sm">Admit</button><button class="btn btn-danger btn-sm">Reject</button></div></td></tr>
          <tr><td style="font-family:monospace;font-size:11px">APP-2025-0042</td><td>Biodun Fashola</td><td>Engineering</td><td>298</td><td>5 credits</td><td>Mar 16</td><td>${pill('Admitted','p-ok')}</td><td><button class="btn btn-outline btn-sm">View</button></td></tr>
          <tr><td style="font-family:monospace;font-size:11px">APP-2025-0043</td><td>Amina Bello</td><td>Medicine</td><td>341</td><td>7 credits</td><td>Mar 16</td><td>${pill('Admitted','p-ok')}</td><td><button class="btn btn-outline btn-sm">View</button></td></tr>
          <tr><td style="font-family:monospace;font-size:11px">APP-2025-0044</td><td>Emeka Duru</td><td>Law</td><td>277</td><td>4 credits</td><td>Mar 17</td><td>${pill('Rejected','p-d')}</td><td><button class="btn btn-outline btn-sm">Appeal</button></td></tr>
        </tbody>
      </table></div>
    </div>`,

  reports: () => `
    <div class="pg-title">Reports</div>
    <div class="pg-sub">Generate and download institutional reports</div>
    <div class="kgrid g2">
      <div class="panel">
        <div class="ph"><div class="pt">Available Reports</div></div>
        ${[
          { ico: 'bar_chart',   bg: '#E6F0FB', tc: '#0c447c', t: 'Academic Performance Report',  s: 'Session results, CGPA, grade distribution'       },
          { ico: 'fingerprint', bg: '#EBF5EC', tc: '#0e5e3b', t: 'Biometric Activity Report',    s: 'Verifications, failures, security flags'          },
          { ico: 'banknote',    bg: '#FFF5E0', tc: '#8a6a1a', t: 'Fee Collection Report',         s: 'Revenue, outstanding balances, waivers'           },
          { ico: 'cal',         bg: '#EEEDFE', tc: '#3C3489', t: 'Attendance Report',             s: 'Class attendance by dept, course, student'        },
          { ico: 'mortarboard', bg: '#F1EFE8', tc: '#5F5E5A', t: 'Admissions Report',             s: 'Applications, admits, acceptance rates'           },
        ].map(r => `
          <div style="border:1px solid var(--border);border-radius:var(--r);padding:12px;display:flex;align-items:center;gap:12px;cursor:pointer;margin-bottom:8px;transition:all 0.15s" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border)'" onclick="showToast('Generating ${r.t}…','ok')">
            <div style="width:40px;height:40px;border-radius:10px;background:${r.bg};display:flex;align-items:center;justify-content:center;color:${r.tc};flex-shrink:0">${icon(r.ico, 18)}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:500">${r.t}</div>
              <div style="font-size:11px;color:var(--muted)">${r.s}</div>
            </div>
            ${icon('chevron_r', 13)}
          </div>`).join('')}
      </div>
      <div class="panel">
        <div class="ph"><div class="pt">Recent Reports</div></div>
        ${[
          { t: 'Q1 Academic Report 2025',     d: 'Generated Apr 1 · PDF · 2.4 MB'    },
          { t: 'Biometric Activity — March',   d: 'Generated Mar 31 · PDF · 1.1 MB'  },
          { t: 'Fee Collection — 1st Sem',     d: 'Generated Feb 28 · Excel · 890 KB' },
          { t: 'Annual Admissions 2024/25',    d: 'Generated Jan 15 · PDF · 3.8 MB'  },
        ].map(r => `
          <div style="padding:10px;background:var(--cream);border-radius:var(--r);display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <div>
              <div style="font-size:12px;font-weight:500">${r.t}</div>
              <div style="font-size:10px;color:var(--muted)">${r.d}</div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="showToast('Downloading…','ok')">${icon('download', 11)}</button>
          </div>`).join('')}
      </div>
    </div>`,

  settings: () => `
    <div class="pg-title">System Settings</div>
    <div class="pg-sub">Configure portal, security, biometric and notification settings</div>
    <div class="kgrid g2">
      <div class="panel">
        <div class="ph"><div class="pt">General Settings</div></div>
        <div class="form-row"><label class="form-lbl">University Name</label><input class="form-in" value="University of Unity (UNIUTY)"></div>
        <div class="form-2">
          <div class="form-row"><label class="form-lbl">Current Session</label><input class="form-in" value="2024/2025"></div>
          <div class="form-row"><label class="form-lbl">Semester</label><select class="form-in"><option>2nd Semester</option><option>1st Semester</option></select></div>
        </div>
        <div class="form-row"><label class="form-lbl">Result Submission Deadline</label><input class="form-in" type="date" value="2025-04-18"></div>
        <div class="form-row"><label class="form-lbl">Portal URL</label><input class="form-in" value="portal.uniuty.edu.ng"></div>
        <button class="btn btn-primary" onclick="showToast('General settings saved!','ok')">Save Settings</button>
      </div>
      <div class="panel">
        <div class="ph"><div class="pt">Biometric Settings</div></div>
        ${[
          { on: true,  l: 'Fingerprint required for result submission'   },
          { on: true,  l: 'Facial recognition for exam hall entry'        },
          { on: true,  l: 'Retina scan for VC & senior admin'            },
          { on: false, l: 'NFC card for library access only'             },
          { on: true,  l: 'Flag repeated failed attempts'                },
          { on: true,  l: 'Email alert on security flags'                },
        ].map(t => `
          <div class="toggle" onclick="this.querySelector('.toggle-track').classList.toggle('on')">
            <div class="toggle-track${t.on ? ' on' : ''}"><div class="toggle-thumb"></div></div>
            <span class="toggle-label">${t.l}</span>
          </div>`).join('')}
        <div class="form-row" style="margin-top:8px">
          <label class="form-lbl">Max failed attempts before lockout</label>
          <input class="form-in" type="number" value="3" style="width:80px">
        </div>
        <button class="btn btn-primary" onclick="showToast('Biometric settings saved!','ok')">Save Biometric Settings</button>
      </div>
    </div>
    <div class="kgrid g2">
      <div class="panel">
        <div class="ph"><div class="pt">Email & Notifications</div></div>
        <div class="form-row"><label class="form-lbl">SMTP Server</label><input class="form-in" value="smtp.uniuty.edu.ng"></div>
        <div class="form-2">
          <div class="form-row"><label class="form-lbl">SMTP Port</label><input class="form-in" value="587"></div>
          <div class="form-row"><label class="form-lbl">Encryption</label><select class="form-in"><option>TLS</option><option>SSL</option></select></div>
        </div>
        ${[
          { on: true,  l: 'Notify students when results published'   },
          { on: true,  l: 'Alert lecturers on pending deadlines'      },
          { on: false, l: 'SMS alerts for security flags'             },
        ].map(t => `
          <div class="toggle" onclick="this.querySelector('.toggle-track').classList.toggle('on')">
            <div class="toggle-track${t.on ? ' on' : ''}"><div class="toggle-thumb"></div></div>
            <span class="toggle-label">${t.l}</span>
          </div>`).join('')}
        <button class="btn btn-primary" style="margin-top:8px" onclick="showToast('Notification settings saved!','ok')">Save Notifications</button>
      </div>
      <div class="panel">
        <div class="ph"><div class="pt">Grading Scale</div></div>
        ${[{g:'A',min:70,pts:5.0},{g:'B',min:60,pts:4.0},{g:'C',min:50,pts:3.0},{g:'D',min:45,pts:2.0},{g:'F',min:0,pts:0.0}].map(g => `
          <div class="form-2" style="margin-bottom:6px">
            <div class="form-row"><label class="form-lbl">Grade ${g.g} — Min Score</label><input class="form-in" value="${g.min}"></div>
            <div class="form-row"><label class="form-lbl">Grade Points</label><input class="form-in" value="${g.pts.toFixed(1)}"></div>
          </div>`).join('')}
        <button class="btn btn-primary" onclick="showToast('Grading scale saved!','ok')">Save Grading Scale</button>
      </div>
    </div>`,

  audit: () => `
    <div class="pg-title">Audit Logs</div>
    <div class="pg-sub">Complete system action log — all user activity tracked</div>
    <div class="panel">
      <div class="ph">
        <div class="pt">System Audit Trail</div>
        <div class="search-row">
          <div class="sbox">${icon('search', 13)}<input placeholder="Search action / user…"></div>
          <select class="flt"><option>All Actions</option><option>Login</option><option>Result Posted</option><option>Bio Failure</option></select>
          <input type="date" class="flt" value="2025-04-12">
          <button class="btn btn-outline" onclick="showToast('Exporting audit log…','ok')">${icon('download', 12)} Export</button>
        </div>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Details</th><th>IP Address</th><th>Bio Verified</th></tr></thead>
        <tbody>${DATA.auditLog.map(a => `<tr>
          <td style="font-family:monospace;font-size:11px">${a.ts}</td>
          <td style="font-weight:500">${a.user}</td>
          <td>${pill(a.role, a.role === 'Student' ? 'p-b' : a.role === 'Lecturer' ? 'p-ok' : a.role === 'VC' ? 'p-gold' : 'p-g')}</td>
          <td style="font-size:11px">${a.action}</td>
          <td style="font-size:11px;color:var(--muted)">${a.details}</td>
          <td style="font-family:monospace;font-size:11px">${a.ip}</td>
          <td style="font-size:11px;color:${a.bio ? 'var(--success)' : 'var(--danger)'}">${a.bio ? '✓ Verified' : '✗ Failed'}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`,

  users: () => `
    <div class="pg-title">User Management</div>
    <div class="pg-sub">All portal user accounts, roles and permissions</div>
    ${alert_('i', 'Role changes are audit-logged and require biometric confirmation. VC accounts may be promoted to Administrator with Security Officer co-approval.')}
    <div class="panel" style="border-color:rgba(201,168,76,0.3);background:var(--gold-pale)">
      <div class="ph">
        <div>
          <div class="pt">Role Promotion — Vice Chancellor → Administrator</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">Grants full system access. Requires biometric confirmation from an existing Admin.</div>
        </div>
        <button class="btn btn-primary" onclick="promoteVCtoAdmin()">${icon('shield', 12)} Promote VC to Admin</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label class="form-lbl">Select VC Account</label>
          <select class="form-in" id="vcPromoteSelect">
            <option value="">Select Vice Chancellor account…</option>
            <option value="VC-001">VC-001 — Prof. A. Chukwu (Vice Chancellor)</option>
          </select>
        </div>
        <div>
          <label class="form-lbl">New Role</label>
          <select class="form-in" id="vcNewRole">
            <option value="admin">Administrator (Full Access)</option>
            <option value="registrar">Registrar</option>
            <option value="bursar">Bursar</option>
          </select>
        </div>
      </div>
      <div style="margin-top:10px;padding:10px;background:rgba(255,255,255,0.6);border-radius:8px;font-size:11px;color:var(--muted)">
        ${icon('lock', 12)} This action will be biometric-signed by the authorising Administrator and permanently recorded in the audit trail.
      </div>
    </div>
    <div class="kgrid g4">
      <div class="kcard"><div class="kcard-lbl">Total Users</div><div class="kcard-val">14,305</div></div>
      <div class="kcard"><div class="kcard-lbl">Active Today</div><div class="kcard-val">3,841</div></div>
      <div class="kcard"><div class="kcard-lbl">Locked Accounts</div><div class="kcard-val" style="color:var(--danger)">12</div></div>
      <div class="kcard"><div class="kcard-lbl">Pending Activation</div><div class="kcard-val" style="color:var(--warn)">48</div></div>
    </div>
    <div class="panel">
      <div class="ph">
        <div class="pt">User Accounts</div>
        <div class="search-row">
          <div class="sbox">${icon('search', 13)}<input placeholder="Search user…"></div>
          <select class="flt"><option>All Roles</option><option>Admin</option><option>VC</option><option>Lecturer</option><option>Student</option></select>
          <button class="btn btn-primary">${icon('plus', 12)} Create User</button>
        </div>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>Role</th><th>Last Login</th><th>Bio</th><th>Account</th><th>Actions</th></tr></thead>
        <tbody>
          ${[
            {id:'ADM-001',name:'Dr. A. Dankwa',email:'a.dankwa@uniuty.edu.ng',role:'Admin',last:'Today 8:30',bio:true,status:'Active'},
            {id:'VC-001',name:'Prof. A. Chukwu',email:'vc@uniuty.edu.ng',role:'VC',last:'Today 8:00',bio:true,status:'Active'},
            {id:'LEC-0042',name:'Dr. O. Nwosu',email:'o.nwosu@uniuty.edu.ng',role:'Lecturer',last:'Today 8:40',bio:true,status:'Active'},
            {id:'UNIUTY/2022/0814',name:'Emeka Obi',email:'e.obi@student.uniuty.edu.ng',role:'Student',last:'Today 8:41',bio:true,status:'Active'},
            {id:'UNIUTY/2022/0200',name:'Fatima Yusuf',email:'f.yusuf@student.uniuty.edu.ng',role:'Student',last:'Apr 10',bio:false,status:'Warning'},
          ].map(u => `<tr>
            <td style="font-family:monospace;font-size:11px">${u.id}</td>
            <td style="font-weight:500">${u.name}</td>
            <td style="font-size:11px;color:var(--info)">${u.email}</td>
            <td>${pill(u.role, u.role==='Admin'?'p-w':u.role==='VC'?'p-d':u.role==='Student'?'p-b':'p-ok')}</td>
            <td style="font-size:11px;color:var(--muted)">${u.last}</td>
            <td>${bioBadge(u.bio)}</td>
            <td>${pill(u.status, u.status==='Active'?'p-ok':'p-w')}</td>
            <td><div style="display:flex;gap:4px"><button class="btn btn-outline btn-sm">Edit</button><button class="btn btn-danger btn-sm">Lock</button></div></td>
          </tr>`).join('')}
        </tbody>
      </table></div>
    </div>`,
};

/* ─── VC → Admin promotion with biometric confirmation ─── */
async function promoteVCtoAdmin() {
  const vcId   = document.getElementById('vcPromoteSelect')?.value;
  const newRole = document.getElementById('vcNewRole')?.value;

  if (!vcId) { showToast('Please select a VC account to promote.', 'warn'); return; }

  // Confirm with a modal-style prompt
  const roleNames = { admin:'Administrator', registrar:'Registrar', bursar:'Bursar' };
  const confirmed = window.confirm(
    `You are about to change VC-001 (Prof. A. Chukwu) to role: ${roleNames[newRole]}.\n\nThis action requires biometric confirmation from you (the authorising Admin). Proceed to biometric scan?`
  );
  if (!confirmed) return;

  showToast('Biometric scan initiated for Admin confirmation…', 'info');
  const result = await BiometricAPI.scan('fingerprint', 'ADM-001');

  if (!result.success) {
    showToast('Biometric failed — role change cancelled. Retry or contact the Security Officer.', 'err');
    return;
  }

  // Update mock data
  if (KNOWN_ACCOUNTS['VC-001']) KNOWN_ACCOUNTS['VC-001'].role = newRole;
  DATA.roles['vc'] = {
    ...DATA.roles['vc'],
    badge: roleNames[newRole],
    meta: `${roleNames[newRole]} · VC-001`,
  };

  // Audit log
  BiometricAPI._auditTrail.push({
    ts: new Date().toISOString(), level: 'info', method: 'role-change',
    msg: `VC-001 promoted from Vice Chancellor to ${roleNames[newRole]} by ADM-001`,
    authorisedBy: 'ADM-001', biometricVerified: true,
  });

  showToast(`Prof. A. Chukwu has been promoted to ${roleNames[newRole]}. Audit log updated.`, 'ok');
  // Refresh page
  setTimeout(() => goPage('users'), 800);
}
