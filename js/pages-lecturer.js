/* ═══════════════════════════════════════════════════════════
   UNIUTY PORTAL — LECTURER PAGES
═══════════════════════════════════════════════════════════ */

const PAGES_LECTURER = {

  dashboard: () => `
    <div class="pg-title">Good morning, Dr. Nwosu</div>
    <div class="pg-sub">Saturday, April 12 · 2nd Semester — 3 courses active</div>
    ${alert_('w', 'CSC 301 results deadline is April 18 — 47 students still ungraded')}
    ${alert_('ok','CSC 405 results successfully posted and verified. Students notified.')}
    <div class="kgrid g4">
      <div class="kcard"><div class="kcard-lbl">Total Students</div><div class="kcard-val">312</div><div class="kcard-sub" style="color:var(--muted)">3 courses</div></div>
      <div class="kcard"><div class="kcard-lbl">Results Posted</div><div class="kcard-val">265</div><div class="kcard-sub" style="color:var(--warn)">47 pending</div></div>
      <div class="kcard"><div class="kcard-lbl">Avg. Score</div><div class="kcard-val">71.4</div></div>
      <div class="kcard"><div class="kcard-lbl">Pass Rate</div><div class="kcard-val">88%</div><div class="kcard-sub" style="color:var(--success)">Above avg.</div></div>
    </div>
    <div class="two-col">
      <div>
        <div class="panel">
          <div class="ph"><div class="pt">My Courses</div><button class="btn btn-primary" onclick="goPage('post_results')">Post Results</button></div>
          ${[
            {code:'CSC 301',name:'Data Structures & Algorithms',level:'300L',students:82, posted:35, pct:43 },
            {code:'CSC 405',name:'Artificial Intelligence & ML', level:'400L',students:64, posted:64, pct:100},
            {code:'CSC 201',name:'Data Structures I',           level:'200L',students:166,posted:166,pct:100},
          ].map(c => `
            <div class="course-card" onclick="goPage('post_results')">
              <div style="display:flex;align-items:center;justify-content:space-between">
                ${pill(c.code,'p-b')}
                <span style="font-size:11px;color:${c.pct===100?'var(--success)':'var(--warn)'}">${c.pct}% posted</span>
              </div>
              <div style="font-size:13px;font-weight:500;margin:6px 0 2px">${c.name}</div>
              <div style="font-size:11px;color:var(--muted)">${c.level} · ${c.students} students · ${c.posted} posted</div>
              <div class="mini-bar"><div class="mini-fill" style="width:${c.pct}%;background:${c.pct===100?'var(--success)':'var(--gold)'}"></div></div>
            </div>`).join('')}
        </div>
        <div class="panel">
          <div class="ph"><div class="pt">Recent Submissions</div></div>
          <div class="table-wrap"><table>
            <thead><tr><th>Student</th><th>Course</th><th>Score</th><th>Grade</th><th>Verified</th></tr></thead>
            <tbody>${DATA.results.slice(0,4).map(r => `<tr>
              <td style="font-weight:500">${r.name}</td>
              <td style="font-family:monospace;font-size:11px">${r.course}</td>
              <td style="font-weight:500">${r.score}</td>
              <td>${gradePill(r.grade)}</td>
              <td>${bioBadge(r.bio)}</td>
            </tr>`).join('')}</tbody>
          </table></div>
        </div>
      </div>
      <div class="rc">
        <div class="panel">
          <div class="ph"><div class="pt">Grade Distribution — CSC 301</div></div>
          <div style="display:flex;align-items:flex-end;gap:6px;height:70px;margin-bottom:5px">
            ${[{v:28,c:'#1A7F5A'},{v:22,c:'#1A5F9E'},{v:12,c:'#C9A84C'},{v:8,c:'#B37A1A'},{v:5,c:'#B33A3A'}].map(b => `
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
                <div style="font-size:10px;font-weight:500">${b.v}</div>
                <div style="width:100%;height:${Math.round(b.v/28*60)}px;border-radius:3px 3px 0 0;background:${b.c}"></div>
              </div>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-around;font-size:10px;color:var(--muted)"><span>A</span><span>B</span><span>C</span><span>D</span><span>F</span></div>
        </div>
        <div class="panel">
          <div class="pt" style="margin-bottom:12px">Today's Schedule</div>
          ${[
            {t:'8:00 AM', c:'CSC 301 Lecture',  r:'Hall B, Rm 204', col:'#C9A84C'},
            {t:'11:00 AM',c:'Office Hours',      r:'CSC Dept, Rm 12',col:'#8A95A3'},
            {t:'2:00 PM', c:'CSC 405 Lab',       r:'ICT Lab 3',      col:'#1A5F9E'},
          ].map(s => `
            <div class="sch-item">
              <div style="font-size:11px;color:var(--muted);min-width:60px">${s.t}</div>
              <div class="sch-dot" style="background:${s.col}"></div>
              <div><div style="font-size:12px;font-weight:500">${s.c}</div><div style="font-size:10px;color:var(--muted)">${s.r}</div></div>
            </div>`).join('')}
        </div>
        <div class="panel">
          <div class="pt" style="margin-bottom:10px">Deadlines</div>
          <div style="padding:8px 10px;background:#fff5e0;border:1px solid rgba(201,168,76,0.25);border-radius:7px;font-size:12px;display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-weight:500;color:var(--warn)">CSC 301 Results</span>
            <span style="color:var(--warn)">Apr 18 · 6 days</span>
          </div>
          <div style="padding:8px 10px;background:var(--cream);border:1px solid var(--border);border-radius:7px;font-size:12px;display:flex;justify-content:space-between">
            <span style="font-weight:500">CSC 201 Results</span>
            <span style="color:var(--muted)">Apr 25 · 13 days</span>
          </div>
        </div>
      </div>
    </div>`,

  post_results: () => `
    <div class="pg-title">Post Exam Results</div>
    <div class="pg-sub">Enter scores, verify identity, then submit</div>
    <div style="background:var(--gold-pale);border:1px solid rgba(201,168,76,0.3);border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:14px;margin-bottom:16px" id="bioPostStrip">
      <div style="width:44px;height:44px;border-radius:12px;background:rgba(201,168,76,0.15);display:flex;align-items:center;justify-content:center;color:var(--warn)">${icon('fingerprint', 22)}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;color:var(--navy)" id="bioPostName">Biometric verification required to post results</div>
        <div style="font-size:11px;color:var(--warn);margin-top:2px">Authenticate with fingerprint before submitting</div>
      </div>
      <button class="btn btn-primary" id="bioPostBtn" onclick="doLecturerVerify()">${icon('fingerprint', 12)} Verify Identity</button>
    </div>
    <div class="two-col">
      <div class="panel">
        <div class="ph">
          <div class="pt">CSC 301 — Data Structures & Algorithms</div>
          <div class="search-row">
            <div class="sbox">${icon('search', 13)}<input placeholder="Search student…"></div>
            <select class="flt"><option>2nd Semester</option><option>1st Semester</option></select>
          </div>
        </div>
        <div class="table-wrap"><table>
          <thead><tr><th>Matric No.</th><th>Name</th><th>CA (40)</th><th>Exam (60)</th><th>Total</th><th>Grade</th><th>Save</th></tr></thead>
          <tbody id="lecResultsTb">${DATA.lecturerStudents.map(s => {
            const total = s.ca + s.exam;
            const gr    = getGrade(total);
            return `<tr>
              <td style="font-family:monospace;font-size:11px">${s.matric}</td>
              <td style="font-weight:500">${s.name}</td>
              <td><input class="score-in" type="number" min="0" max="40" value="${s.ca}" onchange="updateLecScore('${s.matric}','ca',this.value)"></td>
              <td><input class="score-in" type="number" min="0" max="60" value="${s.exam}" onchange="updateLecScore('${s.matric}','ex',this.value)"></td>
              <td style="font-weight:500" id="lt_${s.matric.replace(/\//g,'_')}">${total}</td>
              <td id="lg_${s.matric.replace(/\//g,'_')}">${gradePill(gr.g)}</td>
              <td><button class="btn btn-outline btn-sm" onclick="showToast('Saved for ${s.name}!','ok')">Save</button></td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>
        <button class="btn btn-primary btn-lg btn-block" style="margin-top:14px" onclick="submitLecResults()">${icon('check_sq', 14)} Submit All Results</button>
      </div>
      <div class="rc">
        <div class="panel">
          <div class="ph"><div class="pt">Grading Scale</div></div>
          ${[{g:'A',r:'70–100',cls:'al-ok'},{g:'B',r:'60–69',cls:'al-i'},{g:'C',r:'50–59',cls:'al-w'},{g:'D',r:'45–49',cls:'al-w'},{g:'F',r:'0–44',cls:'al-d'}].map(x => `
            <div style="display:flex;justify-content:space-between;padding:6px 10px;border-radius:6px;margin-bottom:4px;font-size:12px;background:${x.cls==='al-ok'?'#EBF5EC':x.cls==='al-i'?'#E6F0FB':x.cls==='al-w'?'#FFF5E0':'#FCEAEA'}">
              <span style="font-weight:600">Grade ${x.g}</span><span>${x.r}</span>
            </div>`).join('')}
        </div>
        <div class="panel">
          <div class="ph"><div class="pt">Submission Status</div></div>
          <div class="si-row"><span style="color:var(--muted)">Total students</span><span style="font-weight:500">${DATA.lecturerStudents.length}</span></div>
          <div class="si-row"><span style="color:var(--muted)">Scores modified</span><span id="lecEnteredCount" style="font-weight:500;color:var(--info)">0</span></div>
          <div class="si-row"><span style="color:var(--muted)">Bio verified</span><span id="lecBioStatus" style="font-weight:500;color:var(--danger)">No</span></div>
        </div>
      </div>
    </div>`,

  attendance: () => `
    <div class="pg-title">Attendance Management</div>
    <div class="pg-sub">Biometric-verified attendance records</div>
    ${alert_('i', 'Attendance is automatically captured via facial recognition at lecture hall entry. Manual override available below.')}
    <div class="two-col">
      <div class="panel">
        <div class="ph">
          <div class="pt">CSC 301 — Attendance Record</div>
          <div class="search-row">
            <select class="flt"><option>Week 10 — Apr 8</option><option>Week 9 — Apr 1</option></select>
            <button class="btn btn-primary" onclick="showToast('Mark attendance via biometric scan initiated.','ok')">${icon('face_scan', 12)} Mark Attendance</button>
          </div>
        </div>
        <div class="table-wrap"><table>
          <thead><tr><th>Matric No.</th><th>Student</th><th>Attendance %</th><th>Last Seen</th><th>Method</th><th>Status</th></tr></thead>
          <tbody>${DATA.attendance.map(a => {
            const sc = a.pct>=75?'var(--success)':a.pct>=60?'var(--warn)':'var(--danger)';
            const sl = a.pct>=75?'Good':a.pct>=60?'Warning':'At Risk';
            return `<tr>
              <td style="font-family:monospace;font-size:11px">${a.matric}</td>
              <td style="font-weight:500">${a.name}</td>
              <td style="font-weight:500;color:${sc}">${a.pct}%</td>
              <td style="font-size:11px;color:var(--muted)">${a.last}</td>
              <td style="font-size:11px">${a.method}</td>
              <td><span class="pill" style="background:${a.pct>=75?'#EBF5EC':a.pct>=60?'#FFF5E0':'#FCEAEA'};color:${sc}">${sl}</span></td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>
      </div>
      <div class="rc">
        <div class="panel">
          <div class="pt" style="margin-bottom:12px">Class Overview</div>
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
            <span style="color:var(--muted)">Class average</span><span style="font-weight:500">81%</span>
          </div>
          ${barTrack(81,'#C9A84C')}
          <div style="margin-top:12px;display:flex;flex-direction:column;gap:6px">
            <div style="padding:8px 10px;background:#EBF5EC;border-radius:7px;font-size:12px;color:#0e5e3b">68 students — Good (≥75%)</div>
            <div style="padding:8px 10px;background:#FFF5E0;border-radius:7px;font-size:12px;color:var(--warn)">10 students — Warning (60–74%)</div>
            <div style="padding:8px 10px;background:#FCEAEA;border-radius:7px;font-size:12px;color:#791f1f">14 students — At Risk (&lt;60%)</div>
          </div>
        </div>
        <div class="panel">
          <div class="pt" style="margin-bottom:10px">Capture Methods</div>
          ${[{l:'Facial recognition',p:64},{l:'NFC card tap',p:28},{l:'Manual override',p:8}].map(m => `
            <div style="display:flex;justify-content:space-between;font-size:12px;padding:6px 0;border-bottom:1px solid rgba(226,228,232,0.4)">
              <span style="color:var(--muted)">${m.l}</span><span style="font-weight:500">${m.p}%</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`,

  materials: () => `
    <div class="pg-title">Course Materials</div>
    <div class="pg-sub">Upload and manage lecture notes, slides, and resources</div>
    <div class="two-col">
      <div>
        <div class="panel">
          <div class="ph"><div class="pt">CSC 301 — Materials</div><button class="btn btn-primary" onclick="showToast('Upload dialog opened.','info')">${icon('upload', 12)} Upload File</button></div>
          ${[
            {ico:'file_text',bg:'#FCEAEA',tc:'#791f1f',t:'Week 1 — Introduction to Data Structures.pdf',   m:'Jan 14 · 2.4 MB · 89 downloads'},
            {ico:'bar_chart', bg:'#FFF5E0',tc:'#8a6a1a',t:'Week 3 — Arrays & Linked Lists.pptx',           m:'Jan 28 · 5.1 MB · 74 downloads'},
            {ico:'file_text',bg:'#FCEAEA',tc:'#791f1f',t:'Week 5 — Trees & Graph Theory.pdf',             m:'Feb 11 · 3.8 MB · 61 downloads'},
            {ico:'doc',       bg:'#E6F0FB',tc:'#0c447c',t:'CSC 301 — Past Questions 2020-2024.docx',      m:'Mar 2 · 1.2 MB · 112 downloads'},
            {ico:'bar_chart', bg:'#FFF5E0',tc:'#8a6a1a',t:'Week 9 — Sorting Algorithms.pptx',             m:'Apr 1 · 4.7 MB · 42 downloads'},
          ].map(f => `
            <div class="mat-item">
              <div class="file-icon" style="background:${f.bg};color:${f.tc}">${icon(f.ico, 16)}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.t}</div>
                <div style="font-size:10px;color:var(--muted)">${f.m}</div>
              </div>
              <button class="btn btn-ghost btn-sm" onclick="showToast('Downloading…','ok')">${icon('download', 12)}</button>
            </div>`).join('')}
        </div>
        <div class="panel">
          <div class="pt" style="margin-bottom:14px">Upload New Material</div>
          <div class="upload-zone" onclick="showToast('File picker opened.','info')">
            <div style="display:flex;justify-content:center;margin-bottom:10px">${icon('upload', 32)}</div>
            <div style="font-size:13px;color:var(--muted)">Click to upload or drag and drop files here</div>
            <div style="font-size:11px;color:var(--muted);margin-top:4px">PDF, PPTX, DOCX, MP4 — max 100 MB</div>
          </div>
        </div>
      </div>
      <div class="rc">
        <div class="panel">
          <div class="pt" style="margin-bottom:10px">Courses</div>
          ${[{code:'CSC 301',n:'Data Structures',f:5,sel:true},{code:'CSC 405',n:'AI & ML',f:7},{code:'CSC 201',n:'Data Structures I',f:4}].map(c => `
            <div style="border:1px solid ${c.sel?'var(--navy)':'var(--border)'};border-radius:8px;padding:10px 12px;cursor:pointer;margin-bottom:6px">
              <div style="font-size:11px;font-weight:500;color:var(--info)">${c.code}</div>
              <div style="font-size:12px;color:var(--navy);margin-top:2px">${c.n} · ${c.f} files</div>
            </div>`).join('')}
        </div>
        <div class="panel">
          <div class="pt" style="margin-bottom:10px">Engagement</div>
          <div class="si-row"><span style="color:var(--muted)">Total downloads</span><span style="font-weight:500">378</span></div>
          <div class="si-row"><span style="color:var(--muted)">Most accessed</span><span style="font-weight:500;font-size:11px">Past Questions</span></div>
          <div class="si-row"><span style="color:var(--muted)">Last upload</span><span style="font-weight:500">Apr 1</span></div>
          <div class="si-row"><span style="color:var(--muted)">Storage used</span><span style="font-weight:500">17.2 MB</span></div>
        </div>
      </div>
    </div>`,

  messages: () => messagesPage([
    {avi:'HoD',bg:'#F1EFE8',tc:'#444441',from:'Head of Department',      preview:'Reminder: All CSC 301 results must be submitted to the exams office by April 18.',         time:'Today',    unread:true },
    {avi:'EO', bg:'#EEEDFE',tc:'#3C3489',from:'Emeka Obi (Student)',      preview:'Good afternoon Dr. Nwosu, I wanted to inquire about my CSC 301 CA score…',              time:'Yesterday',unread:true },
    {avi:'RO', bg:'#EBF5EC',tc:'#0e5e3b',from:"Registrar's Office",      preview:'The exams timetable for 2nd Semester has been updated. Please review your exam halls.',   time:'Apr 10',   unread:true },
    {avi:'IT', bg:'#FFF5E0',tc:'#8a6a1a',from:'IT & Biometric Unit',     preview:'Your biometric profile has been updated. Retina scan successfully enrolled.',             time:'Apr 9',    unread:true },
    {avi:'SA', bg:'#E6F0FB',tc:'#0c447c',from:'Senate Academic Committee',preview:'You are invited to the departmental review meeting scheduled for April 22 at 10AM.',      time:'Apr 5',    unread:false},
  ]),
};

/* ── Lecturer-specific logic ── */
async function doLecturerVerify() {
  const btn = document.getElementById('bioPostBtn');
  if (!btn) return;
  btn.innerHTML = `${icon('fingerprint', 12)} Scanning…`;
  btn.disabled  = true;

  const result = await BiometricAPI.scan('fingerprint', 'LEC-0042');
  if (result.success) {
    bioVerified = true;
    btn.innerHTML = `${icon('check_circle', 12)} Verified`;
    btn.style.background = 'var(--success)';
    const nm = document.getElementById('bioPostName');
    const st = document.getElementById('lecBioStatus');
    if (nm) nm.textContent = 'Identity verified — Dr. Obiora Nwosu · LEC-0042';
    if (st) { st.textContent = 'Yes'; st.style.color = 'var(--success)'; }
    const strip = document.getElementById('bioPostStrip');
    if (strip) { strip.style.background = '#EBF5EC'; strip.style.borderColor = 'rgba(26,127,90,0.3)'; }
  } else {
    btn.disabled = false;
    btn.innerHTML = `${icon('fingerprint', 12)} Retry Verify`;
    showToast(result.message || 'Biometric failed — please retry', 'err');
  }
}

function updateLecScore(matric, type, val) {
  scores[matric + '_' + type] = parseInt(val) || 0;
  const id  = matric.replace(/\//g, '_');
  const s   = DATA.lecturerStudents.find(x => x.matric === matric);
  const ca  = scores[matric + '_ca']  ?? s.ca;
  const ex  = scores[matric + '_ex']  ?? s.exam;
  const total = ca + ex;
  const gr  = getGrade(total);
  const tEl = document.getElementById('lt_' + id);
  const gEl = document.getElementById('lg_' + id);
  if (tEl) tEl.textContent = total;
  if (gEl) gEl.innerHTML   = gradePill(gr.g);
  const entered = document.getElementById('lecEnteredCount');
  if (entered) entered.textContent = Math.floor(Object.keys(scores).length / 2);
}

function submitLecResults() {
  if (!bioVerified) {
    showToast('Please verify your identity with biometrics before submitting.', 'err');
    return;
  }
  showToast('All results submitted and biometric-signed. Students notified.', 'ok');
}
