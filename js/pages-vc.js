/* ═══════════════════════════════════════════════════════════
   UNIUTY PORTAL — VICE CHANCELLOR PAGES
═══════════════════════════════════════════════════════════ */

const PAGES_VC = {

  dashboard: () => `
    <div class="pg-title">University Overview</div>
    <div class="pg-sub">Executive dashboard — 2024/2025 Academic Session</div>
    <div class="kgrid" style="grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:16px">
      <div class="kcard"><div class="kcard-lbl">Total Students</div><div class="kcard-val">12,847</div><div class="kcard-sub" style="color:var(--success)">+847</div></div>
      <div class="kcard"><div class="kcard-lbl">Academic Staff</div><div class="kcard-val">634</div></div>
      <div class="kcard"><div class="kcard-lbl">Pass Rate</div><div class="kcard-val">87.4%</div><div class="kcard-sub" style="color:var(--success)">+2.1%</div></div>
      <div class="kcard"><div class="kcard-lbl">First Class</div><div class="kcard-val">6.2%</div><div class="kcard-sub" style="color:var(--muted)">142 students</div></div>
      <div class="kcard"><div class="kcard-lbl">Revenue</div><div class="kcard-val">₦4.8B</div><div class="kcard-sub" style="color:var(--success)">91% collected</div></div>
    </div>
    ${alert_('d', '3 departments have not submitted 2nd Semester results — deadline April 18. Immediate action required.')}
    ${alert_('ok', 'Biometric system operational — 8,419 verifications processed today with 99.6% uptime.')}
    <div class="three-col">
      <div class="panel">
        <div class="ph"><div class="pt">Enrolment Trend</div><span style="font-size:10px;color:var(--muted)">5-year</span></div>
        <div style="display:flex;align-items:flex-end;gap:4px;height:60px;margin-bottom:5px">${trendBars([9842,10411,11203,12000,12847])}</div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted)"><span>2021</span><span>2022</span><span>2023</span><span>2024</span><span>2025</span></div>
      </div>
      <div class="panel">
        <div class="ph"><div class="pt">Department Rankings</div></div>
        ${DATA.depts.slice(0,5).sort((a,b)=>b.pass-a.pass).map((d,i) => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <div class="rank-num" style="background:${i<3?'var(--gold-pale)':'var(--cream)'};color:${i<3?'var(--warn)':'var(--muted)'}">${i+1}</div>
            <div style="flex:1">
              <div style="font-size:11px;font-weight:500">${d.name}</div>
              ${barTrack(d.pass, d.pass>=90?'#1A7F5A':'#C9A84C')}
            </div>
            <div style="font-size:11px;font-weight:500;color:${d.pass>=90?'var(--success)':'var(--warn)'}">${d.pass}%</div>
          </div>`).join('')}
      </div>
      <div class="panel">
        <div class="ph"><div class="pt">Key Metrics</div></div>
        <div class="kgrid g2" style="margin-bottom:0">
          ${[{v:'94%',l:'Results posted'},{v:'81%',l:'Avg. attendance'},{v:'3.72',l:'Avg. CGPA'},{v:'142',l:'First class'}].map(m => `
            <div style="text-align:center;padding:10px;background:var(--cream);border-radius:var(--r)">
              <div style="font-size:18px;font-weight:500;font-family:'Playfair Display',serif">${m.v}</div>
              <div style="font-size:10px;color:var(--muted)">${m.l}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`,

  academic: () => `
    <div class="pg-title">Academic Performance</div>
    <div class="pg-sub">University-wide results analysis — 2024/2025</div>
    <div class="three-col">
      <div class="panel">
        <div class="ph"><div class="pt">Grade Distribution</div></div>
        <div style="display:flex;align-items:flex-end;gap:8px;height:80px;margin-bottom:6px">
          ${[{v:6840,c:'#1A7F5A'},{v:12410,c:'#1A5F9E'},{v:8980,c:'#C9A84C'},{v:3240,c:'#B37A1A'},{v:1620,c:'#B33A3A'}].map(b => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
              <div style="font-size:10px;font-weight:500">${(b.v/1000).toFixed(1)}K</div>
              <div style="width:100%;height:${Math.round(b.v/12410*70)}px;border-radius:3px 3px 0 0;background:${b.c}"></div>
            </div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-around;font-size:10px;color:var(--muted)"><span>A</span><span>B</span><span>C</span><span>D</span><span>F</span></div>
      </div>
      <div class="panel">
        <div class="ph"><div class="pt">Pass Rate Trend</div></div>
        <div style="display:flex;align-items:flex-end;gap:4px;height:60px;margin-bottom:5px">${trendBars([81,83,84,85.3,87.4])}</div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted)"><span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span></div>
      </div>
      <div class="panel">
        <div class="ph"><div class="pt">Honours Classification</div></div>
        ${[
          {c:'#C9A84C',l:'First Class',     n:'142 (6.2%)' },
          {c:'#1A5F9E',l:'2nd Class Upper', n:'1,024 (44.8%)'},
          {c:'#1A7F5A',l:'2nd Class Lower', n:'812 (35.5%)' },
          {c:'#8A95A3',l:'Third Class',     n:'183 (8.0%)'  },
          {c:'#B33A3A',l:'Pass',            n:'125 (5.5%)'  },
        ].map(h => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:12px">
            <div style="width:10px;height:10px;border-radius:2px;background:${h.c};flex-shrink:0"></div>
            <div style="flex:1">${h.l}</div>
            <span style="font-weight:500">${h.n}</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="panel">
      <div class="ph"><div class="pt">Top Performing Students University-Wide</div></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Rank</th><th>Student</th><th>Matric No.</th><th>Department</th><th>Level</th><th>CGPA</th><th>Class</th></tr></thead>
        <tbody>${[
          {r:1,name:'Ngozi Eze',     matric:'UNIUTY/2022/0102',dept:'Computer Science',level:'300L',cgpa:4.87},
          {r:2,name:'Amara Okonkwo', matric:'UNIUTY/2021/0011',dept:'Medicine',        level:'400L',cgpa:4.82},
          {r:3,name:'David Olawale', matric:'UNIUTY/2021/0299',dept:'Engineering',     level:'300L',cgpa:4.79},
          {r:4,name:'Emeka Obi',     matric:'UNIUTY/2022/0814',dept:'Computer Science',level:'300L',cgpa:4.72},
          {r:5,name:'Halima Musa',   matric:'UNIUTY/2022/0415',dept:'Pharmacy',        level:'400L',cgpa:4.70},
        ].map(s => `<tr>
          <td><div class="rank-num" style="background:${s.r<=3?'var(--gold-pale)':'var(--cream)'};color:${s.r<=3?'var(--warn)':'var(--muted)'}">${s.r}</div></td>
          <td style="font-weight:500">${s.name}</td>
          <td style="font-family:monospace;font-size:11px">${s.matric}</td>
          <td>${s.dept}</td>
          <td>${s.level}</td>
          <td style="font-weight:500;color:var(--gold);font-family:'Playfair Display',serif;font-size:16px">${s.cgpa.toFixed(2)}</td>
          <td>${pill('First Class','p-ok')}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`,

  departments: () => `
    <div class="pg-title">Departments</div>
    <div class="pg-sub">All 14 academic departments at UNIUTY</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
      ${DATA.depts.map((d, i) => {
        const bgs = ['#E6F0FB','#EBF5EC','#FFF5E0','#EEEDFE','#F1EFE8','#FCEAEA','#E1F5EE','#FAECE7','#FBEAF0','#EAF3DE','#FAEEDA','#FCEBEB','#E6F1FB','#F7F1E3'];
        const tcs = ['#0c447c','#0e5e3b','#8a6a1a','#3C3489','#5F5E5A','#791f1f','#085041','#712B13','#72243E','#27500A','#633806','#791F1F','#0C447C','#8a6a1a'];
        return `<div class="dept-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="width:36px;height:36px;border-radius:8px;background:${bgs[i]};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${tcs[i]}">${d.code}</div>
            <span style="font-size:11px;font-weight:500;color:${d.pass>=90?'#0e5e3b':d.pass>=85?'#8a6a1a':'#0c447c'};background:${d.pass>=90?'#EBF5EC':d.pass>=85?'#FFF5E0':'#E6F0FB'};padding:2px 7px;border-radius:5px">${d.pass}% pass</span>
          </div>
          <div style="font-size:13px;font-weight:500">${d.name}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:3px">${d.students.toLocaleString()} students · ${d.staff} staff</div>
          <div class="mini-bar"><div class="mini-fill" style="width:${d.pass}%;background:${tcs[i]}"></div></div>
        </div>`;
      }).join('')}
    </div>`,

  vc_students: () => `
    <div class="pg-title">Students & Staff</div>
    <div class="pg-sub">University population overview</div>
    <div class="kgrid g4">
      <div class="kcard"><div class="kcard-lbl">Undergraduates</div><div class="kcard-val">11,204</div></div>
      <div class="kcard"><div class="kcard-lbl">Postgraduates</div><div class="kcard-val">1,643</div></div>
      <div class="kcard"><div class="kcard-lbl">Academic Staff</div><div class="kcard-val">634</div></div>
      <div class="kcard"><div class="kcard-lbl">Non-Academic</div><div class="kcard-val">412</div></div>
    </div>
    <div class="kgrid g2">
      <div class="panel">
        <div class="ph"><div class="pt">Staff-Student Ratio by Department</div></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Department</th><th>Staff</th><th>Students</th><th>Ratio</th><th>Rating</th></tr></thead>
          <tbody>${[
            {d:'Computer Science',s:48,st:1842,r:'1:38',ok:true},
            {d:'Engineering',s:82,st:2104,r:'1:26',ok:true},
            {d:'Medicine',s:96,st:1127,r:'1:12',ok:true},
            {d:'Law',s:22,st:934,r:'1:42',ok:true},
            {d:'Social Sciences',s:18,st:876,r:'1:49',ok:false},
            {d:'Arts',s:14,st:712,r:'1:51',ok:false},
          ].map(x => `<tr>
            <td>${x.d}</td><td>${x.s}</td><td>${x.st.toLocaleString()}</td>
            <td style="font-family:monospace">${x.r}</td>
            <td>${pill(x.ok?'Good':'Poor', x.ok?'p-b':'p-d')}</td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>
      <div class="panel">
        <div class="ph"><div class="pt">Admissions Growth</div></div>
        ${[{y:'2020/21',n:9842,p:77},{y:'2021/22',n:10411,p:82},{y:'2022/23',n:11203,p:88},{y:'2023/24',n:12000,p:94},{y:'2024/25',n:12847,p:100}].map(a => `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
              <span style="color:var(--muted)">${a.y}</span>
              <span style="font-weight:500">${a.n.toLocaleString()}</span>
            </div>${barTrack(a.p,'#C9A84C')}
          </div>`).join('')}
      </div>
    </div>`,

  biometric: () => `
    <div class="pg-title">Biometric Reports</div>
    <div class="pg-sub">University-wide authentication overview</div>
    <div class="kgrid" style="grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:16px">
      <div class="kcard"><div class="kcard-lbl">Total Today</div><div class="kcard-val">8,419</div></div>
      <div class="kcard"><div class="kcard-lbl">Success Rate</div><div class="kcard-val">99.6%</div><div class="kcard-sub" style="color:var(--success)">Excellent</div></div>
      <div class="kcard"><div class="kcard-lbl">Failures</div><div class="kcard-val">34</div><div class="kcard-sub" style="color:var(--warn)">3 flagged</div></div>
      <div class="kcard"><div class="kcard-lbl">Enrolled</div><div class="kcard-val">13,893</div></div>
      <div class="kcard"><div class="kcard-lbl">Uptime</div><div class="kcard-val">99.9%</div></div>
    </div>
    <div class="kgrid g2">
      <div class="panel">
        <div class="ph"><div class="pt">Verification Log — Today</div></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Time</th><th>User</th><th>Method</th><th>Purpose</th><th>Result</th></tr></thead>
          <tbody>${DATA.bioLog.map(b => `<tr>
            <td style="font-family:monospace;font-size:11px">${b.time}</td>
            <td style="font-weight:500">${b.user}</td>
            <td>${b.method}</td>
            <td style="font-size:11px">${b.purpose}</td>
            <td style="font-size:11px;color:${b.result?'var(--success)':'var(--danger)'}">${b.result?'✓ Pass':'✗ Failed'}</td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>
      <div class="rc">
        <div class="panel">
          <div class="ph"><div class="pt">Method Breakdown</div></div>
          ${[{l:'Fingerprint',p:50,v:'4,201',c:'#C9A84C'},{l:'Facial',p:35,v:'2,948',c:'#1A5F9E'},{l:'NFC Card',p:12,v:'1,018',c:'#1A7F5A'},{l:'Retina',p:3,v:'252',c:'#B33A3A'}].map(x => `
            <div style="margin-bottom:8px">
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px"><span>${x.l}</span><span style="font-weight:500">${x.v} (${x.p}%)</span></div>
              ${barTrack(x.p, x.c)}
            </div>`).join('')}
        </div>
        <div class="panel">
          <div class="ph"><div class="pt">Security Flags</div></div>
          ${alert_('d', 'Repeated fail — Exam Hall C · 8:15 AM')}
          ${alert_('w', 'Duplicate NFC — Library · 7:50 AM')}
          ${alert_('w', 'Unregistered print — Admin block · 7:30 AM')}
        </div>
      </div>
    </div>`,

  approvals: () => `
    <div class="pg-title">Approvals Queue</div>
    <div class="pg-sub">Items awaiting Vice Chancellor's approval — 5 urgent</div>
    <div class="panel">
      <div class="table-wrap"><table>
        <thead><tr><th>Type</th><th>From</th><th>Subject</th><th>Date</th><th>Priority</th><th>Action</th></tr></thead>
        <tbody>${[
          {type:'Result Correction', from:'Dr. O. Nwosu',    subj:'CSC 301 — Score amendment for UNIUTY/2021/0011',          date:'Apr 11', prio:'Urgent'},
          {type:'New Appointment',   from:'HR Office',       subj:'Dr. Fatima Garba — Asst. Lecturer, Statistics',           date:'Apr 10', prio:'Urgent'},
          {type:'Budget Request',    from:'Bursary',         subj:'2025/26 Capital Expenditure — ₦280M proposal',            date:'Apr 9',  prio:'High'  },
          {type:'Curriculum Change', from:'CSC Dept.',       subj:'New elective — Cloud Computing (CSC 418)',                date:'Apr 8',  prio:'High'  },
          {type:'Senate Report',     from:'Academic Affairs',subj:'2024/25 Annual Academic Report — for VC signature',       date:'Apr 7',  prio:'Normal'},
        ].map(a => `<tr>
          <td>${pill(a.type, 'p-b')}</td>
          <td style="font-weight:500">${a.from}</td>
          <td style="font-size:12px">${a.subj}</td>
          <td style="font-size:11px;color:var(--muted)">${a.date}</td>
          <td>${pill(a.prio, a.prio==='Urgent'?'p-d':a.prio==='High'?'p-w':'p-g')}</td>
          <td><div style="display:flex;gap:4px"><button class="btn btn-success btn-sm" onclick="showToast('Approved!','ok')">Approve</button><button class="btn btn-danger btn-sm" onclick="showToast('Declined.','err')">Decline</button></div></td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`,

  reports: () => PAGES_ADMIN.reports(),
  audit:   () => PAGES_ADMIN.audit(),
};
