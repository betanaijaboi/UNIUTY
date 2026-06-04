# UNIUTY University Portal

A professional, role-based university management portal for the **University of Unity (UNIUTY)**. Built as a fully responsive web application accessible on PCs and mobile devices, with a fully integrated biometric authentication system.

---

## 🚀 Quick Start (Frontend — No Server Required)

1. Clone the repository
2. Open `index.html` in any modern browser
3. Sign in with demo credentials:

| Role | Portal ID | Password |
|------|-----------|----------|
| Administrator | `ADM-001` | `Admin@2024!` |
| Vice Chancellor | `VC-001` | `VC@Secure24!` |
| Lecturer | `LEC-0042` | `Lec@2024!` |
| Student | `UNIUTY/2022/0814` | `Student@1234` |

---

## 📁 Project Structure

```
uniuty-portal/
├── index.html                  # Main entry point
├── css/
│   ├── main.css                # UI component styles
│   └── layout.css              # Login, sidebar, topbar, responsive
├── js/
│   ├── icons.js                # 60+ professional SVG icons
│   ├── biometric.js            # Hardware plugin API + simulation
│   ├── data.js                 # Mock data (replace with API)
│   ├── helpers.js              # Shared render helpers
│   ├── app.js                  # Core: login, routing, navigation
│   ├── forgot-password.js      # Role-specific password recovery
│   ├── pages-admin.js          # Administrator portal pages
│   ├── pages-vc.js             # Vice Chancellor pages
│   ├── pages-lecturer.js       # Lecturer pages
│   └── pages-student.js        # Student pages
└── docs/
    ├── index.html              # Documentation hub (open this)
    ├── prd.html                # Product Requirements Document
    ├── user-stories.html       # 40 User Stories
    ├── user-flows.html         # User Flow Diagrams
    ├── erd.html                # Database ERD (14 tables)
    ├── architecture.html       # System Architecture Diagram
    ├── api-docs.html           # REST API Documentation
    ├── wireframes.html         # UI Wireframes (9 screens)
    ├── design-system.html      # Design System & Style Guide
    ├── security.html           # Security Requirements
    ├── acceptance-criteria.html # Acceptance Criteria (Gherkin)
    ├── roadmap.html            # Project Roadmap (4 phases)
    ├── test-plan.html          # Test Plan
    ├── deployment.html         # Deployment & Maintenance Plan
    └── UNIUTY_SRS.docx         # Full SRS Word Document
```

---

## ✨ Features

### Portal Roles
- **Administrator** — Full system control: students, faculty, results, settings, user management
- **Vice Chancellor** — Executive dashboards, approvals queue, senate reports
- **Lecturer** — Post results (biometric-signed), attendance, course materials
- **Student** — Results, transcript, timetable, fee payment, biometric profile

### Authentication
- **Auto role detection** from Portal ID prefix — no role selector needed
- **Biometric login** — fingerprint, retina, facial recognition, NFC card
- **Smart lockout** — 3 failed attempts → 30-second cooldown
- **Role-specific password recovery** with multi-factor security (Admin requires security question + OTP + biometric)

### Biometric System
- Hardware-agnostic **BiometricAPI** plugin interface
- Built-in simulation mode for development (no hardware needed)
- Plug in real hardware with one call: `BiometricAPI.register('fingerprint', YourPlugin)`
- Full audit trail for every biometric event

### Security
- Role-based access control (RBAC)
- VC → Admin promotion requires **Admin biometric co-authorisation**
- All actions audit-logged with timestamp, user, method, and IP
- Password complexity enforcement with live strength indicator

---

## 🔌 Biometric Hardware Integration

```javascript
// Create your plugin (js/plugins/my-device.js)
const MyFingerprintPlugin = {
  name: 'ZKTeco ZK4500',
  async init()          { /* connect to device SDK */ },
  async scan(userId)    { return { success: true, method: 'fingerprint', userId, quality: 94, template: '...' }; },
  async enroll(userId)  { /* capture and store template */ },
  async delete(userId)  { /* remove template */ },
};

// Register before portal loads (index.html script tags)
BiometricAPI.register('fingerprint', MyFingerprintPlugin);
```

Supported methods: `fingerprint` · `retina` · `facial` · `nfc`

---

## 🎨 Design

- **Colour scheme:** Navy `#0A1628` · Gold `#C9A84C` · Cream `#FAFAF7`
- **Typography:** Playfair Display (headings) · DM Sans (body)
- **Icons:** 60+ inline SVG icons — zero emoji dependencies
- **Responsive:** 320px → 2560px, mobile sidebar drawer

---

## 📚 Documentation

Full documentation suite in the `docs/` folder. Open `docs/index.html` for the hub linking all **15 deliverables** including SRS, wireframes, ERD, API specification, test plan, roadmap, and more.

---

## 🏛️ About

**University of Unity (UNIUTY)** · ICT Development Unit · 2024/2025 Academic Session  
Built for Nigerian higher education institutions requiring integrated academic, biometric, and administrative management.

> ⚠️ Demo credentials are for development only. Replace `KNOWN_ACCOUNTS` in `js/app.js` with a secure authentication API before production deployment.
