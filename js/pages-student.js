/* ═══════════════════════════════════════════════════════════
   UNIUTY PORTAL — STUDENT PAGES
═══════════════════════════════════════════════════════════ */

const PAGES_STUDENT = {

  dashboard: () => `
    <div style="margin-bottom:18px">
      <div class="pg-title">Good morning, Emeka</div>
      <div class="pg-sub">Saturday, April 12 · 2nd Semester in progress</div>
    </div>
    ${alert_('i', 'Your CSC 301 result has been published. <span style="font-weight:600;cursor:pointer;text-decoration:underline" onclick="goPage(\'my_results\')">View now →</span>')}
    ${alert_('w', 'School fees balance of ₦47,500 is outstanding — deadline April 30.')}
    <div class="kgrid g4">
      <div class="kcard"><div class="kcard-lbl">CGPA</div><div class="kcard-val">4.12</div><div class="kcard-sub" style="color:var(--success)">First Class</div></div>
      <div class="kcard"><div class="kcard-lbl">Courses</div><div class="kcard-val">6</div><div class="kcard-sub" style="color:var(--muted)">This semester</div></div>
      <div class="kcard"><div class="kcard-lbl">Units Earned</div><div class="kcard-val">94</div><div class="kcard-sub" style="color:var(--muted)">of 120</div></div>
      <div class="kcard"><div class="kcard-lbl">Attendance</div><div class="kcard-val">88%</div><div class="kcard-sub" style="color:var(--warn)">Min 75%</div></div>
    </div>
    <div class="two-col">
      <div class="panel">
        <div class="ph">
          <div class="pt">Recent Results</div>
          <span style="font-size:11px;color:var(--info);cursor:pointer" onclick="goPage('my_results')">See all →</span>
        </div>
        <div class="table-wrap"><table>
          <thead><tr><th>Course</th><th>Title</th><th>Score</th><th>Grade</th><th>Status</th></tr></thead>
          <tbody>${DATA.studentResults.filter(r => r.posted).slice(0,4).map(r => `<tr>
            <td style="font-family:monospace;font-size:11px">${r.code}</td>
            <td>${r.title}</td>
            <td style="font-weight:500">${r.score}%</td>
            <td>${gradePill(r.grade)}</td>
            <td style="font-size:11px;color:var(--success)">Pass</td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>
      <div class="rc">
        <div class="panel" style="text-align:center">
          <div class="pt" style="text-align:left;margin-bottom:14px">CGPA Standing</div>
          <div class="cgpa-ring">
            <svg viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="38" fill="none" stroke="#E2E4E8" stroke-width="7"/>
              <circle cx="45" cy="45" r="38" fill="none" stroke="#C9A84C" stroke-width="7" stroke-dasharray="210 239" stroke-dashoffset="60" stroke-linecap="round"/>
            </svg>
            <div class="cgpa-center"><div class="cgpa-num">4.12</div><div class="cgpa-lbl">/ 5.00</div></div>
          </div>
          <div style="font-size:13px;font-weight:600;color:var(--success)">First Class Honours</div>
          <div style="font-size:11px;color:var(--muted);margin-top:3px">Top 5% of department</div>
        </div>
        <div class="panel">
          <div class="pt" style="margin-bottom:12px">Today's Schedule</div>
          ${[
            {t:'8:00 AM', c:'CSC 301 — Lecture',    r:'Hall B, Rm 204',   col:'#C9A84C'},
            {t:'11:00 AM',c:'MTH 312 — Tutorial',   r:'Math Block, Lab 1',col:'#1A7F5A'},
            {t:'2:00 PM', c:'CSC 315 — Lab',        r:'ICT Lab 3',         col:'#1A5F9E'},
          ].map(s => `
            <div class="sch-item">
              <div style="font-size:11px;color:var(--muted);min-width:62px">${s.t}</div>
              <div class="sch-dot" style="background:${s.col}"></div>
              <div><div style="font-size:12px;font-weight:500">${s.c}</div><div style="font-size:10px;color:var(--muted)">${s.r}</div></div>
            </div>`).join('')}
        </div>
      </div>
    </div>`,

  my_results: () => `
    <div class="pg-title">My Exam Results</div>
    <div class="pg-sub">2024/2025 Session — 2nd Semester</div>
    <div class="panel">
      <div class="ph">
        <div class="pt">2nd Semester Results (Current)</div>
        <select class="flt"><option>2024/2025 — 2nd Sem</option><option>2024/2025 — 1st Sem</option><option>2023/2024 — 2nd Sem</option></select>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Code</th><th>Course Title</th><th>Units</th><th>Score</th><th>Grade</th><th>Points</th><th>Status</th></tr></thead>
        <tbody>${DATA.studentResults.map(r => `<tr>
          <td style="font-family:monospace;font-size:11px">${r.code}</td>
          <td>${r.title}</td>
          <td>${r.units}</td>
          <td style="font-weight:500">${r.posted ? r.score + '%' : '—'}</td>
          <td>${r.posted ? gradePill(r.grade) : pill('Pending','p-g')}</td>
          <td>${r.posted ? r.points.toFixed(1) : '—'}</td>
          <td style="font-size:11px;color:${r.status==='Pass'?'var(--success)':r.status==='Pending'?'var(--muted)':'var(--danger)'}">${r.status}</td>
        </tr>`).join('')}</tbody>
      </table></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
        <div style="font-size:12px;color:var(--muted)">16 credit units registered · 14 units graded</div>
        <div style="font-size:13px;font-weight:500">Semester GPA: <span style="color:var(--gold);font-family:'Playfair Display',serif">4.25</span></div>
      </div>
    </div>
    ${alert_('ok', 'All posted results verified via biometric signature. STA 311 result expected by April 18.')}`,

  transcript: () => `
    <div class="pg-title">Academic Transcript</div>
    <div class="pg-sub">Full academic record — 2022 to present</div>
    <div class="panel">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--border);flex-wrap:wrap">
        ${[{l:'Student',v:'Emeka Obi'},{l:'Matric No.',v:'UNIUTY/2022/0814'},{l:'Programme',v:'B.Sc. Computer Science'}].map(x => `
          <div style="flex:1;min-width:120px">
            <div style="font-size:11px;color:var(--muted)">${x.l}</div>
            <div style="font-size:13px;font-weight:500">${x.v}</div>
          </div>`).join('')}
        <div style="text-align:right">
          <div style="font-size:11px;color:var(--muted)">Cumulative GPA</div>
          <div style="font-size:22px;font-weight:500;font-family:'Playfair Display',serif;color:var(--gold)">4.12</div>
        </div>
      </div>
      ${DATA.transcript.map(sem => `
        <div style="margin-bottom:16px">
          <div style="font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:1px;padding-bottom:6px;border-bottom:1px solid var(--border);margin-bottom:8px;display:flex;justify-content:space-between">
            <span>${sem.sem}</span><span>GPA: ${sem.gpa.toFixed(2)}</span>
          </div>
          <div class="table-wrap"><table>
            <thead><tr><th>Code</th><th>Title</th><th>Units</th><th>Score</th><th>Grade</th></tr></thead>
            <tbody>${sem.courses.map(c => `<tr>
              <td style="font-family:monospace;font-size:11px">${c.code}</td>
              <td>${c.title}</td>
              <td>${c.units}</td>
              <td>${c.score}</td>
              <td>${gradePill(c.grade)}</td>
            </tr>`).join('')}</tbody>
          </table></div>
        </div>`).join('')}
      <div style="text-align:center;margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">
        <button class="btn btn-primary btn-lg" onclick="showToast('Generating official transcript PDF — biometric verification required.','info')">${icon('download', 14)} Download Official Transcript PDF</button>
      </div>
    </div>`,

  courses: () => `
    <div class="pg-title">Courses & Schedule</div>
    <div class="pg-sub">2nd Semester 2024/2025 — 300 Level</div>
    <div class="two-col">
      <div class="panel">
        <div class="ph"><div class="pt">Registered Courses</div><div style="font-size:11px;color:var(--muted)">16 credit units</div></div>
        ${[
          {code:'CSC 301',name:'Data Structures & Algorithms',meta:'Dr. O. Nwosu · 3 units · Lec + Lab'},
          {code:'CSC 315',name:'Operating Systems',          meta:'Prof. A. Ikenna · 3 units · Lecture'},
          {code:'CSC 321',name:'Computer Networks',           meta:'Dr. M. Bello · 3 units · Lec + Lab'},
          {code:'MTH 312',name:'Real Analysis',              meta:'Dr. C. Uche · 3 units · Lecture'},
          {code:'ENG 301',name:'Technical Writing',          meta:'Mr. T. Adeyemi · 2 units · Lecture'},
          {code:'STA 311',name:'Probability & Statistics',   meta:'Dr. F. Garba · 2 units · Lecture'},
        ].map(c => `
          <div class="mat-item">
            ${pill(c.code,'p-b')}
            <div>
              <div style="font-size:12px;font-weight:500">${c.name}</div>
              <div style="font-size:10px;color:var(--muted)">${c.meta}</div>
            </div>
          </div>`).join('')}
      </div>
      <div class="rc">
        <div class="panel">
          <div class="pt" style="margin-bottom:12px">Weekly Timetable</div>
          ${[
            {d:'Mon', t:'CSC 301 (8AM) · MTH 312 (2PM)'},
            {d:'Tue', t:'CSC 315 (10AM) · ENG 301 (1PM)'},
            {d:'Wed', t:'CSC 321 Lab (9AM)'},
            {d:'Thu', t:'STA 311 (8AM) · CSC 301 Lab (2PM)'},
            {d:'Fri', t:'CSC 315 (11AM) · MTH 312 (3PM)'},
          ].map(d => `
            <div style="display:grid;grid-template-columns:30px 1fr;gap:8px;padding:5px 0;border-bottom:1px solid rgba(226,228,232,0.4);font-size:11px">
              <span style="color:var(--muted);font-weight:500">${d.d}</span><span>${d.t}</span>
            </div>`).join('')}
        </div>
        <div class="panel">
          <div class="pt" style="margin-bottom:10px">Upcoming Exams</div>
          ${[
            {date:'Apr 28',c:'CSC 301 Final',r:'Exam Hall A · 9:00 AM',col:'#C9A84C'},
            {date:'Apr 30',c:'MTH 312 Final',r:'Exam Hall B · 2:00 PM',col:'#1A5F9E'},
            {date:'May 3', c:'CSC 315 Final',r:'Exam Hall A · 9:00 AM',col:'#1A7F5A'},
          ].map(e => `
            <div class="sch-item">
              <div style="background:var(--gold-pale);border:1px solid rgba(201,168,76,0.3);border-radius:5px;padding:3px 7px;font-size:10px;font-weight:600;color:var(--warn);min-width:48px;text-align:center;flex-shrink:0">${e.date}</div>
              <div class="sch-dot" style="background:${e.col}"></div>
              <div>
                <div style="font-size:12px;font-weight:500">${e.c}</div>
                <div style="font-size:10px;color:var(--muted)">${e.r}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`,

  fees: () => `
    <div class="pg-title">Fee Payment</div>
    <div class="pg-sub">2024/2025 Academic Session</div>
    <div class="two-col">
      <div class="panel">
        <div class="ph"><div class="pt">Fee Breakdown</div>${pill('Partial Payment','p-w')}</div>
        <div class="bar-track" style="margin-bottom:6px;height:8px"><div class="bar-fill" style="width:65%;background:var(--gold)"></div></div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:16px">65% paid — ₦47,500 remaining · Due April 30</div>
        ${[
          {l:'School Fees',         a:'₦65,000', paid:true },
          {l:'Acceptance Fee',      a:'₦15,000', paid:true },
          {l:'Departmental Levy',   a:'₦10,000', paid:true },
          {l:'Library Fee',         a:'₦5,000',  paid:true },
          {l:'Exam Development Fee',a:'₦22,500', paid:false},
          {l:'ICT Infrastructure',  a:'₦15,000', paid:false},
          {l:'Student Union Dues',  a:'₦10,000', paid:false},
        ].map(f => `
          <div class="fee-row">
            <span>${f.l}</span>
            <span style="font-weight:500;color:${f.paid?'var(--success)':'var(--danger)'};display:flex;align-items:center;gap:4px">
              ${f.paid ? icon('check_circle', 12) : icon('alert_tri', 12)} ${f.a}
            </span>
          </div>`).join('')}
        <div style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px;display:flex;justify-content:space-between;font-size:13px;font-weight:500">
          <span>Total Outstanding</span><span style="color:var(--danger)">₦47,500</span>
        </div>
        <button class="btn btn-primary btn-lg btn-block" style="margin-top:14px" onclick="showToast('Redirecting to UNIUTY payment gateway (Remita/Flutterwave)…','ok')">${icon('credit_card', 14)} Pay Now via Portal</button>
      </div>
      <div class="rc">
        <div class="panel">
          <div class="pt" style="margin-bottom:12px">Payment History</div>
          ${[
            {a:'₦65,000',d:'Jan 12, 2025 · Remita'},
            {a:'₦15,000',d:'Jan 12, 2025 · Remita'},
            {a:'₦10,000',d:'Feb 3, 2025 · Card'},
            {a:'₦5,000', d:'Feb 3, 2025 · Card'},
          ].map(p => `
            <div class="fee-row">
              <div>
                <div style="font-size:13px;font-weight:500">${p.a}</div>
                <div style="font-size:10px;color:var(--muted)">${p.d}</div>
              </div>
              <span style="font-size:11px;color:var(--success);display:flex;align-items:center;gap:4px">${icon('check_circle', 12)} Confirmed</span>
            </div>`).join('')}
        </div>
        <div class="panel">
          <div class="pt" style="margin-bottom:12px">Payment Methods</div>
          <div style="border:2px solid var(--navy);border-radius:8px;padding:10px 12px;display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <div style="width:38px;height:24px;background:#003087;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#fff;font-weight:700">VISA</div>
            <div style="font-size:12px;flex:1">Visa · **** 4821</div>
            <div style="font-size:10px;color:var(--success);font-weight:500">Default</div>
          </div>
          <div style="border:1px solid var(--border);border-radius:8px;padding:10px 12px;display:flex;align-items:center;gap:10px">
            <div style="width:38px;height:24px;background:#e37400;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;font-weight:700">Remita</div>
            <div style="font-size:12px">Remita Bank Transfer</div>
          </div>
        </div>
      </div>
    </div>`,

  biometric: () => `
    <div class="pg-title">Biometric Profile</div>
    <div class="pg-sub">Your identity verification methods — tap any card to test a scan</div>
    ${alert_('ok', 'All 3 biometric methods enrolled and active. Last verified: today 8:41 AM.')}
    <div class="panel" style="margin-bottom:16px">
      <div class="ph"><div class="pt">Identity Verification Methods</div></div>
      ${bioCards('bioStudentResult')}
    </div>
    <div class="panel">
      <div class="ph"><div class="pt">Biometric Use Log</div></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Date & Time</th><th>Method</th><th>Purpose</th><th>Location</th><th>Result</th></tr></thead>
        <tbody>${[
          {dt:'Apr 12 · 8:41 AM', method:'Fingerprint',   purpose:'Portal Login',       loc:'Main Gate Terminal',   ok:true },
          {dt:'Apr 11 · 9:00 AM', method:'Facial Recog.',  purpose:'Lecture Attendance', loc:'Hall B — CSC 301',     ok:true },
          {dt:'Apr 10 · 2:15 PM', method:'NFC Card',       purpose:'Library Access',     loc:'University Library',   ok:true },
          {dt:'Apr 8 · 11:30 AM', method:'Retina Scan',    purpose:'Exam Hall Entry',    loc:'Exam Block C',         ok:true },
          {dt:'Apr 7 · 8:05 AM',  method:'Fingerprint',    purpose:'Portal Login',       loc:'Main Gate Terminal',   ok:false},
        ].map(b => `<tr>
          <td style="font-size:11px">${b.dt}</td>
          <td>${b.method}</td>
          <td>${b.purpose}</td>
          <td style="font-size:11px;color:var(--muted)">${b.loc}</td>
          <td style="font-size:11px;color:${b.ok?'var(--success)':'var(--danger)'};display:flex;align-items:center;gap:4px">${icon(b.ok?'check_circle':'x_circle', 12)} ${b.ok?'Verified':'Failed · Retried'}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`,

  messages: () => messagesPage([
    {avi:'ON',bg:'#E6F0FB',tc:'#0c447c',from:'Dr. O. Nwosu (CSC 301)',  preview:'Your CSC 301 result has been posted. You scored 87/100. Please review and contact me if any concern.',      time:'Today',    unread:true },
    {avi:'RO',bg:'#EBF5EC',tc:'#0e5e3b',from:"Registrar's Office",     preview:'Reminder: 2nd semester exam registration closes April 15. Ensure all fees are settled before registering.',  time:'Yesterday',unread:true },
    {avi:'BU',bg:'#FFF5E0',tc:'#8a6a1a',from:'Bursary Unit',           preview:'Outstanding balance of ₦47,500 on your account. Kindly settle before April 30 to avoid restrictions.',       time:'Apr 9',    unread:true },
    {avi:'CS',bg:'#F1EFE8',tc:'#5F5E5A',from:'CSC Dept. Secretary',    preview:'The departmental seminar has been rescheduled to April 20 at 10AM in the ICT Auditorium.',                  time:'Apr 5',    unread:false},
    {avi:'SA',bg:'#EEEDFE',tc:'#3C3489',from:"Student Affairs",        preview:"Congratulations! You have been nominated for the Dean's List 2025.",                                         time:'Apr 2',    unread:false},
  ]),

  help: () => `
    <div class="pg-title">Help & Support</div>
    <div class="pg-sub">Get assistance with the UNIUTY student portal</div>
    <div class="kgrid g3" style="margin-bottom:16px">
      ${[
        {ico:'mail',  bg:'#E6F0FB',tc:'#0c447c',t:'Email Support', s:'support@uniuty.edu.ng',              b:'Send Email'},
        {ico:'phone', bg:'#EBF5EC',tc:'#0e5e3b',t:'Call Centre',   s:'+234 801 234 5678 · Mon–Fri 8AM–5PM',b:'Call Now'  },
        {ico:'chat',  bg:'#FFF5E0',tc:'#8a6a1a',t:'Live Chat',     s:'Chat with a student support officer', b:'Start Chat'},
      ].map(h => `
        <div class="panel" style="text-align:center">
          <div style="width:52px;height:52px;border-radius:14px;background:${h.bg};display:flex;align-items:center;justify-content:center;margin:0 auto 12px;color:${h.tc}">${icon(h.ico, 22)}</div>
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">${h.t}</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:14px">${h.s}</div>
          <button class="btn btn-primary btn-block" onclick="showToast('${h.b} initiated!','ok')">${h.b}</button>
        </div>`).join('')}
    </div>
    <div class="panel">
      <div class="ph"><div class="pt">Frequently Asked Questions</div></div>
      ${[
        {q:'How do I check my exam results?', a:'Go to "My Results" in the sidebar. Results are published by your lecturer and will appear there once verified.'},
        {q:'What do I do if a result is missing?', a:"Contact your department's examination officer or message your lecturer directly through the portal Messages section."},
        {q:'How do I update my biometric data?', a:'Visit the Biometric Enrolment Centre at the ICT Complex with your student ID and appointment confirmation.'},
        {q:'What if I fail my biometric scan?', a:'Try a different method (NFC card, facial recognition). If all fail, visit the Biometric Desk at the Registry for manual verification.'},
        {q:'How do I pay my school fees online?', a:'Go to "Fee Payment" in the sidebar and click "Pay Now via Portal". We support Visa/Mastercard and Remita bank transfer.'},
      ].map(f => `
        <div style="border-bottom:1px solid var(--border);padding:12px 0">
          <div style="font-size:13px;font-weight:500;margin-bottom:4px;display:flex;align-items:flex-start;gap:8px">${icon('info_circle', 14)} ${f.q}</div>
          <div style="font-size:12px;color:var(--muted);padding-left:22px">${f.a}</div>
        </div>`).join('')}
    </div>`,
};
