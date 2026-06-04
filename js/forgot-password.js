/* ═══════════════════════════════════════════════════════════
   UNIUTY PORTAL — FORGOT PASSWORD / ACCOUNT RECOVERY
   Role-specific security policies:
     Admin    → Security question + email OTP + biometric re-enroll
     VC       → Email OTP + Senate Registrar notification
     Lecturer → Email OTP + dept. head confirmation flag
     Student  → Email OTP + matric number cross-check
═══════════════════════════════════════════════════════════ */

/* Role-specific recovery policies */
const FG_POLICIES = {
  admin: {
    label:     'Administrator Account Recovery',
    icon:      'shield',
    policy:    'For security, Administrator password recovery requires: (1) a verified security question, (2) a one-time code sent to your registered institutional email, and (3) biometric re-verification. All recovery actions are permanently audit-logged and reported to the Chief Security Officer.',
    needsBio:  true,
    needsSecQ: true,
    approver:  'Chief Security Officer will be notified',
  },
  vc: {
    label:     'Vice Chancellor Account Recovery',
    icon:      'mortarboard',
    policy:    'VC account recovery requires your registered email OTP and automatically notifies the Senate Registrar and the Board Secretary. A signed recovery acknowledgement form must be submitted within 48 hours.',
    needsBio:  false,
    needsSecQ: false,
    approver:  'Senate Registrar will be notified',
  },
  lecturer: {
    label:     'Lecturer Account Recovery',
    icon:      'lectern',
    policy:    'Lecturer password recovery is via email OTP sent to your institutional address. Your Head of Department will receive an automated alert. No action required from HoD unless flagged.',
    needsBio:  false,
    needsSecQ: false,
    approver:  'Head of Department will be notified',
  },
  student: {
    label:     'Student Account Recovery',
    icon:      'student_hat',
    policy:    'Student password recovery uses your registered email OTP. Ensure your matric number matches the account on file. If you no longer have access to your registered email, visit the ICT Help Desk with your student ID.',
    needsBio:  false,
    needsSecQ: false,
    approver:  null,
  },
};

let _fgRole = null;
let _fgBioVerified = false;
let _fgOtpSent     = false;
let _fgResendCount = 0;

/* ─── Open modal ─── */
function openForgotModal() {
  const modal = document.getElementById('forgotModal');
  modal.style.display = 'flex';
  // Pre-fill user ID if already typed
  const loginId = document.getElementById('loginId').value.trim();
  if (loginId) {
    document.getElementById('fgUserId').value = loginId;
    fgDetectRole(loginId);
  } else {
    fgSetRole(null);
  }
  // Reset to step 1
  fgShowStep(1);
  _fgBioVerified = false;
  _fgOtpSent     = false;
  _fgResendCount  = 0;
}

function closeForgotModal() {
  document.getElementById('forgotModal').style.display = 'none';
  fgShowStep(1);
  // Clear sensitive fields
  ['fgUserId','fgEmail','fgSecAnswer','fgOtpInput','fgNewPwd','fgConfirmPwd'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

/* ─── Detect role from typed ID ─── */
function fgDetectRole(val) {
  val = (val || '').trim().toUpperCase();
  if (val.startsWith('ADM'))        fgSetRole('admin');
  else if (val.startsWith('VC'))    fgSetRole('vc');
  else if (val.startsWith('LEC'))   fgSetRole('lecturer');
  else if (val.startsWith('UNIUTY'))fgSetRole('student');
  else                              fgSetRole(null);
}

function fgSetRole(role) {
  _fgRole = role;
  const policy = FG_POLICIES[role] || {};
  const lbl    = document.getElementById('fgRoleLabel');
  const policyText = document.getElementById('fgPolicyText');
  const adminExtra = document.getElementById('fgAdminExtra');
  const vcExtra    = document.getElementById('fgVCExtra');

  if (lbl) lbl.textContent = policy.label || 'Security verification required';
  if (policyText) policyText.textContent = policy.policy || 'Enter your Portal ID and registered email to begin recovery.';
  if (adminExtra) adminExtra.style.display = (role === 'admin') ? 'block' : 'none';
  if (vcExtra)    vcExtra.style.display    = (role === 'vc')    ? 'block' : 'none';
}

/* ─── Step navigation ─── */
function fgShowStep(n) {
  [1,2,3].forEach(i => {
    const el = document.getElementById('fgStep' + i);
    if (el) el.style.display = (i === n) ? 'block' : 'none';
  });
}

/* ─── Send OTP ─── */
function fgSendOTP() {
  const userId = document.getElementById('fgUserId').value.trim();
  const email  = document.getElementById('fgEmail').value.trim();

  if (!userId) { showToast('Please enter your Portal ID.', 'warn'); return; }
  if (!email || !email.includes('@')) { showToast('Please enter a valid email address.', 'warn'); return; }

  // Admin: check security question
  if (_fgRole === 'admin') {
    const sq = document.getElementById('fgSecQuestion').value;
    const sa = document.getElementById('fgSecAnswer').value.trim();
    if (!sq) { showToast('Please select a security question.', 'warn'); return; }
    if (!sa) { showToast('Please provide your security answer.', 'warn'); return; }
  }

  // Validate user exists
  const account = KNOWN_ACCOUNTS[userId] || KNOWN_ACCOUNTS[userId.toUpperCase()];
  if (!account) {
    showToast('Portal ID not found. Contact the Registrar if you believe this is an error.', 'err');
    return;
  }

  fgDetectRole(userId);

  // Simulate OTP send
  _fgOtpSent = true;
  const maskedEmail = email.replace(/(.{2})(.+)(@.+)/, '$1***$3');
  const emailMaskEl = document.getElementById('fgEmailMask');
  if (emailMaskEl) emailMaskEl.textContent = maskedEmail;

  // Show bio requirement for admin
  const adminBio = document.getElementById('fgAdminBioReq');
  if (adminBio) adminBio.style.display = (FG_POLICIES[_fgRole]?.needsBio) ? 'block' : 'none';

  const otpIcon = document.getElementById('fgOtpIcon');
  if (otpIcon) otpIcon.innerHTML = icon('mail', 24);

  // Notify approver
  const policy = FG_POLICIES[_fgRole] || {};
  if (policy.approver) showToast(policy.approver + '.', 'info');

  showToast('OTP sent to your registered email. Check your inbox.', 'ok');
  fgShowStep(2);

  // Monitor password strength
  document.getElementById('fgNewPwd').addEventListener('input', fgCheckStrength);
}

/* ─── Resend OTP ─── */
function fgResendOTP() {
  _fgResendCount++;
  if (_fgResendCount > 3) {
    showToast('Maximum resend attempts reached. Please contact the ICT Help Desk.', 'err');
    return;
  }
  showToast('OTP resent. Check your email.', 'ok');
}

/* ─── Biometric for admin step ─── */
async function fgRunBio(i) {
  const cardId  = 'fgBc' + i;
  const statId  = 'fgBs' + i;
  const card = document.getElementById(cardId);
  const stat = document.getElementById(statId);
  if (!card || card.classList.contains('scanning')) return;

  card.classList.add('scanning');
  stat.className = 'bio-st st-spin'; stat.textContent = 'Scanning…';

  const methods = ['fingerprint', 'retina'];
  const result  = await BiometricAPI.scan(methods[i], 'RECOVERY');

  card.classList.remove('scanning');
  if (result.success) {
    card.classList.add('done');
    stat.className = 'bio-st st-ok'; stat.textContent = '✓ Verified';
    _fgBioVerified = true;
    showToast('Biometric verified. You may now set a new password.', 'ok');
  } else {
    card.classList.add('failed');
    stat.className = 'bio-st st-bad'; stat.textContent = '✗ Failed';
    showToast('Biometric failed — try the other method or visit the ICT Desk.', 'err');
  }
}

/* ─── Password strength ─── */
function fgCheckStrength() {
  const pwd = document.getElementById('fgNewPwd').value;
  const bar = document.getElementById('fgPwdBar');
  if (!bar) return;
  let score = 0;
  if (pwd.length >= 8)  score += 20;
  if (pwd.length >= 12) score += 20;
  if (/[A-Z]/.test(pwd)) score += 20;
  if (/[0-9]/.test(pwd)) score += 20;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
  const colors = [0,'#B33A3A','#B37A1A','#C9A84C','#1A7F5A','#1A7F5A'];
  bar.style.width   = score + '%';
  bar.style.background = colors[Math.floor(score / 20)] || '#B33A3A';
}

/* ─── Reset password submit ─── */
function fgResetPassword() {
  const otp     = document.getElementById('fgOtpInput').value.trim();
  const newPwd  = document.getElementById('fgNewPwd').value;
  const confirm = document.getElementById('fgConfirmPwd').value;

  if (!otp || otp.length < 6)   { showToast('Please enter the 6-digit OTP.', 'warn'); return; }
  if (!newPwd)                   { showToast('Please enter a new password.', 'warn'); return; }
  if (newPwd !== confirm)        { showToast('Passwords do not match.', 'err'); return; }
  if (newPwd.length < 8)        { showToast('Password must be at least 8 characters.', 'warn'); return; }

  // Admin requires biometric
  if (FG_POLICIES[_fgRole]?.needsBio && !_fgBioVerified) {
    showToast('Biometric verification is required before setting a new Admin password.', 'err');
    return;
  }

  // Simulate OTP check (any 6-digit code works in demo)
  if (!/^\d{6}$/.test(otp)) { showToast('OTP must be 6 digits.', 'warn'); return; }

  // Update mock account password
  const userId = document.getElementById('fgUserId').value.trim();
  if (KNOWN_ACCOUNTS[userId]) KNOWN_ACCOUNTS[userId].pwd = newPwd;

  // Audit log
  BiometricAPI._auditTrail.push({
    ts: new Date().toISOString(), level: 'info', method: 'password-reset',
    msg: `Password reset for ${userId} (${_fgRole})`, userId,
  });

  const successIcon = document.getElementById('fgSuccessIcon');
  if (successIcon) successIcon.innerHTML = icon('check_circle', 28);
  fgShowStep(3);
  showToast('Password reset successfully. Please sign in with your new password.', 'ok');
}
