/* ═══════════════════════════════════════════════════════════
   UNIUTY PORTAL — MOCK DATA
   In production: replace these constants with API calls.
   All portal pages read from this DATA object.
═══════════════════════════════════════════════════════════ */

const DATA = {

  roles: {
    admin:    { avi:'AD', name:'Dr. A. Dankwa',      meta:'System Administrator · ADM-001',       badge:'Admin',          bioMethod:'Fingerprint verified' },
    vc:       { avi:'VC', name:'Prof. A. Chukwu',    meta:'Vice Chancellor · VC-001',              badge:'Vice Chancellor', bioMethod:'Retina verified' },
    lecturer: { avi:'ON', name:'Dr. Obiora Nwosu',   meta:'Senior Lecturer · LEC-0042',            badge:'Lecturer',        bioMethod:'Fingerprint verified' },
    student:  { avi:'EO', name:'Emeka Obi',           meta:'CSC · 300L · UNIUTY/2022/0814',        badge:'Student',         bioMethod:'Fingerprint verified' },
  },

  results: [
    { matric:'UNIUTY/2021/0011', name:'Amara Okonkwo',    dept:'CSC', course:'CSC 301', score:87, grade:'A', status:'Pass', lecturer:'Dr. O. Nwosu',   bio:true  },
    { matric:'UNIUTY/2021/0045', name:'Tunde Adeleke',    dept:'CSC', course:'CSC 301', score:73, grade:'B', status:'Pass', lecturer:'Dr. O. Nwosu',   bio:true  },
    { matric:'UNIUTY/2022/0102', name:'Ngozi Eze',        dept:'CSC', course:'CSC 301', score:91, grade:'A', status:'Pass', lecturer:'Dr. O. Nwosu',   bio:true  },
    { matric:'UNIUTY/2021/0078', name:'Chidi Nwachukwu',  dept:'ENG', course:'ENG 301', score:55, grade:'C', status:'Pass', lecturer:'Prof. B. Eze',   bio:false },
    { matric:'UNIUTY/2022/0200', name:'Fatima Yusuf',     dept:'CSC', course:'CSC 405', score:38, grade:'F', status:'Fail', lecturer:'Dr. O. Nwosu',   bio:true  },
    { matric:'UNIUTY/2021/0033', name:'Emeka Obi',        dept:'CSC', course:'CSC 301', score:79, grade:'B', status:'Pass', lecturer:'Dr. O. Nwosu',   bio:true  },
    { matric:'UNIUTY/2022/0415', name:'Halima Musa',      dept:'PHM', course:'PHM 201', score:65, grade:'B', status:'Pass', lecturer:'Dr. A. Garba',   bio:true  },
    { matric:'UNIUTY/2021/0299', name:'David Olawale',    dept:'MED', course:'MED 301', score:82, grade:'A', status:'Pass', lecturer:'Prof. I. Nwoke', bio:true  },
    { matric:'UNIUTY/2022/0310', name:'Blessing Okafor',  dept:'LAW', course:'LAW 201', score:71, grade:'A', status:'Pass', lecturer:'Dr. T. Eze',     bio:true  },
    { matric:'UNIUTY/2021/0401', name:'Samuel Dike',      dept:'ENG', course:'ENG 401', score:49, grade:'D', status:'Pass', lecturer:'Prof. B. Eze',   bio:false },
  ],

  students: [
    { matric:'UNIUTY/2022/0814', name:'Emeka Obi',       dept:'CSC', level:'300L', cgpa:4.12, fees:'Partial', bio:true,  status:'Active'  },
    { matric:'UNIUTY/2021/0011', name:'Amara Okonkwo',   dept:'CSC', level:'400L', cgpa:4.87, fees:'Full',    bio:true,  status:'Active'  },
    { matric:'UNIUTY/2022/0102', name:'Ngozi Eze',       dept:'CSC', level:'300L', cgpa:4.79, fees:'Full',    bio:true,  status:'Active'  },
    { matric:'UNIUTY/2021/0078', name:'Chidi Nwachukwu', dept:'ENG', level:'400L', cgpa:3.21, fees:'Full',    bio:false, status:'Active'  },
    { matric:'UNIUTY/2022/0200', name:'Fatima Yusuf',    dept:'CSC', level:'300L', cgpa:2.11, fees:'Owing',   bio:true,  status:'Warning' },
    { matric:'UNIUTY/2022/0415', name:'Halima Musa',     dept:'PHM', level:'300L', cgpa:3.94, fees:'Full',    bio:true,  status:'Active'  },
  ],

  faculty: [
    { id:'LEC-0042', name:'Dr. Obiora Nwosu',   title:'Senior Lecturer', dept:'CSC', courses:3, due:'Apr 18', bio:true,  status:'Active' },
    { id:'LEC-0011', name:'Prof. A. Ikenna',    title:'Professor',       dept:'CSC', courses:2, due:'Apr 25', bio:true,  status:'Active' },
    { id:'LEC-0028', name:'Dr. C. Uche',        title:'Lecturer I',      dept:'MTH', courses:2, due:'Apr 20', bio:true,  status:'Active' },
    { id:'LEC-0055', name:'Mr. T. Adeyemi',     title:'Asst. Lecturer',  dept:'ENG', courses:1, due:'Apr 18', bio:false, status:'Active' },
    { id:'LEC-0063', name:'Dr. F. Garba',       title:'Lecturer II',     dept:'STA', courses:2, due:'May 1',  bio:true,  status:'Active' },
  ],

  courses: [
    { code:'CSC 301', title:'Data Structures & Algorithms', dept:'CSC', units:3, level:'300L', lecturer:'Dr. O. Nwosu',   students:82, results:'Posted'  },
    { code:'CSC 315', title:'Operating Systems',            dept:'CSC', units:3, level:'300L', lecturer:'Prof. A. Ikenna',students:80, results:'Posted'  },
    { code:'CSC 405', title:'AI & Machine Learning',        dept:'CSC', units:3, level:'400L', lecturer:'Dr. O. Nwosu',   students:64, results:'Posted'  },
    { code:'MTH 312', title:'Real Analysis',                dept:'MTH', units:3, level:'300L', lecturer:'Dr. C. Uche',    students:76, results:'Pending' },
    { code:'ENG 301', title:'Technical Writing',            dept:'ENG', units:2, level:'300L', lecturer:'Mr. T. Adeyemi', students:82, results:'Posted'  },
    { code:'STA 311', title:'Probability & Statistics',     dept:'STA', units:2, level:'300L', lecturer:'Dr. F. Garba',   students:82, results:'Pending' },
  ],

  depts: [
    { name:'Engineering',       code:'ENG', students:2104, staff:82,  pass:91 },
    { name:'Computer Science',  code:'CSC', students:1842, staff:48,  pass:88 },
    { name:'Medicine',          code:'MED', students:1127, staff:96,  pass:94 },
    { name:'Law',               code:'LAW', students:934,  staff:22,  pass:82 },
    { name:'Social Sciences',   code:'SOC', students:876,  staff:18,  pass:79 },
    { name:'Arts & Humanities', code:'ART', students:712,  staff:14,  pass:85 },
    { name:'Education',         code:'EDU', students:634,  staff:16,  pass:87 },
    { name:'Agriculture',       code:'AGR', students:521,  staff:20,  pass:83 },
    { name:'Economics',         code:'ECO', students:498,  staff:15,  pass:80 },
    { name:'Pharmacy',          code:'PHM', students:412,  staff:28,  pass:90 },
    { name:'Architecture',      code:'ARC', students:387,  staff:12,  pass:86 },
    { name:'Public Admin',      code:'PAD', students:341,  staff:10,  pass:81 },
    { name:'Mass Comm',         code:'MAC', students:298,  staff:9,   pass:84 },
    { name:'Philosophy',        code:'PHI', students:161,  staff:6,   pass:78 },
  ],

  auditLog: [
    { ts:'08:41:22', user:'Emeka Obi',       role:'Student',  action:'Login',           details:'Portal login via fingerprint',       ip:'197.210.44.12', bio:true  },
    { ts:'08:40:15', user:'Dr. O. Nwosu',    role:'Lecturer', action:'Result Posted',   details:'CSC 301 — 35 results submitted',     ip:'197.210.44.8',  bio:true  },
    { ts:'08:30:00', user:'Prof. A. Chukwu', role:'VC',       action:'Login',           details:'Portal login via retina scan',       ip:'197.210.44.2',  bio:true  },
    { ts:'08:15:30', user:'Unknown',          role:'—',        action:'Bio Failure',     details:'Unrecognised facial — Exam Hall C',  ip:'197.210.44.51', bio:false },
    { ts:'07:50:12', user:'Halima Musa',     role:'Student',  action:'Library Access',  details:'NFC card tap — Entry granted',       ip:'197.210.44.30', bio:true  },
    { ts:'07:30:44', user:'Admin Unit',       role:'Admin',    action:'Settings Changed',details:'Result deadline updated Apr 18',     ip:'197.210.44.1',  bio:true  },
  ],

  bioLog: [
    { time:'08:41 AM', user:'Emeka Obi',       role:'Student',  method:'Fingerprint', purpose:'Portal Login',      loc:'Main Gate', result:true  },
    { time:'08:40 AM', user:'Dr. O. Nwosu',    role:'Lecturer', method:'Fingerprint', purpose:'Result Submission', loc:'CSC Dept',  result:true  },
    { time:'08:30 AM', user:'Prof. A. Chukwu', role:'VC',       method:'Retina',      purpose:'Portal Login',      loc:'VC Office', result:true  },
    { time:'08:15 AM', user:'Unknown',          role:'—',        method:'Facial',      purpose:'Exam Hall Entry',   loc:'Hall C',    result:false },
    { time:'08:10 AM', user:'Halima Musa',     role:'Student',  method:'NFC Card',    purpose:'Library Access',    loc:'Library',   result:true  },
    { time:'07:50 AM', user:'Admin Unit',       role:'Admin',    method:'Fingerprint', purpose:'System Access',     loc:'Admin Blk', result:true  },
  ],

  studentResults: [
    { code:'CSC 301', title:'Data Structures & Algorithms', units:3, score:87, grade:'A', points:15.0, status:'Pass',    posted:true  },
    { code:'CSC 315', title:'Operating Systems',            units:3, score:91, grade:'A', points:15.0, status:'Pass',    posted:true  },
    { code:'CSC 321', title:'Computer Networks',            units:3, score:79, grade:'B', points:12.0, status:'Pass',    posted:true  },
    { code:'MTH 312', title:'Real Analysis',                units:3, score:73, grade:'B', points:12.0, status:'Pass',    posted:true  },
    { code:'ENG 301', title:'Technical Writing',            units:2, score:68, grade:'B', points:8.0,  status:'Pass',    posted:true  },
    { code:'STA 311', title:'Probability & Statistics',     units:2, score:0,  grade:'—', points:0,    status:'Pending', posted:false },
  ],

  transcript: [
    { sem:'100 Level — 1st Semester', gpa:3.90, courses:[
      { code:'CSC 101', title:'Intro to Computing',      units:3, score:81, grade:'A' },
      { code:'MTH 101', title:'Mathematics I',            units:3, score:75, grade:'B' },
      { code:'PHY 101', title:'Physics I',                units:3, score:70, grade:'B' },
      { code:'GST 101', title:'Use of English',           units:2, score:77, grade:'B' },
    ]},
    { sem:'100 Level — 2nd Semester', gpa:4.05, courses:[
      { code:'CSC 102', title:'Programming Fundamentals', units:3, score:89, grade:'A' },
      { code:'MTH 102', title:'Mathematics II',           units:3, score:82, grade:'A' },
      { code:'CSC 110', title:'Logic & Discrete Maths',   units:3, score:78, grade:'B' },
    ]},
    { sem:'200 Level — 1st Semester', gpa:4.18, courses:[
      { code:'CSC 201', title:'Data Structures I',        units:3, score:91, grade:'A' },
      { code:'CSC 211', title:'OOP',                      units:3, score:86, grade:'A' },
      { code:'MTH 201', title:'Linear Algebra',           units:3, score:74, grade:'B' },
    ]},
    { sem:'200 Level — 2nd Semester', gpa:4.22, courses:[
      { code:'CSC 202', title:'Data Structures II',       units:3, score:88, grade:'A' },
      { code:'CSC 215', title:'Database Systems',         units:3, score:84, grade:'A' },
      { code:'STA 201', title:'Statistics I',             units:2, score:72, grade:'B' },
    ]},
  ],

  lecturerStudents: [
    { matric:'UNIUTY/2021/0011', name:'Amara Okonkwo',   ca:36, exam:51 },
    { matric:'UNIUTY/2021/0045', name:'Tunde Adeleke',   ca:30, exam:43 },
    { matric:'UNIUTY/2022/0102', name:'Ngozi Eze',       ca:38, exam:53 },
    { matric:'UNIUTY/2021/0078', name:'Chidi Nwachukwu', ca:22, exam:33 },
    { matric:'UNIUTY/2022/0200', name:'Fatima Yusuf',    ca:15, exam:23 },
    { matric:'UNIUTY/2021/0033', name:'Emeka Obi',       ca:32, exam:47 },
    { matric:'UNIUTY/2022/0415', name:'Halima Musa',     ca:28, exam:37 },
    { matric:'UNIUTY/2021/0299', name:'David Olawale',   ca:34, exam:48 },
  ],

  attendance: [
    { matric:'UNIUTY/2021/0011', name:'Amara Okonkwo',   pct:95,  last:'Apr 11', method:'Facial'  },
    { matric:'UNIUTY/2021/0045', name:'Tunde Adeleke',   pct:88,  last:'Apr 11', method:'NFC'     },
    { matric:'UNIUTY/2022/0102', name:'Ngozi Eze',       pct:100, last:'Apr 11', method:'Facial'  },
    { matric:'UNIUTY/2021/0078', name:'Chidi Nwachukwu', pct:62,  last:'Apr 8',  method:'Manual'  },
    { matric:'UNIUTY/2022/0200', name:'Fatima Yusuf',    pct:55,  last:'Apr 1',  method:'NFC'     },
    { matric:'UNIUTY/2021/0033', name:'Emeka Obi',       pct:88,  last:'Apr 11', method:'Facial'  },
    { matric:'UNIUTY/2022/0415', name:'Halima Musa',     pct:75,  last:'Apr 8',  method:'Facial'  },
    { matric:'UNIUTY/2021/0299', name:'David Olawale',   pct:92,  last:'Apr 11', method:'Facial'  },
  ],
};
