# UNIUTY University Portal
## Full Setup Guide — Biometric System + Node.js Server

---

## 📁 Project Structure

```
uniuty/
├── public/                    ← Frontend (HTML/CSS/JS)
│   ├── index.html             ← Main HTML (single entry point)
│   ├── css/
│   │   └── main.css           ← All styles (mobile-first)
│   └── js/
│       ├── main.js            ← App logic, auth, nav, biometric
│       ├── data.js            ← Demo data & sidebar configs
│       ├── pages-admin.js     ← Admin portal pages
│       ├── pages-vc.js        ← Vice Chancellor pages
│       ├── pages-lecturer.js  ← Lecturer pages
│       └── pages-student.js   ← Student pages
│
├── server/
│   ├── app.js                 ← Express server entry point
│   ├── config/
│   │   └── database.js        ← PostgreSQL connection + schema
│   ├── routes/
│   │   ├── auth.js            ← Login, logout, /me
│   │   ├── biometric.js       ← Biometric API endpoints
│   │   ├── results.js         ← Exam results CRUD
│   │   ├── students.js        ← Student management
│   │   ├── faculty.js         ← Staff management
│   │   ├── courses.js         ← Course registry
│   │   └── dashboard.js       ← Dashboard stats
│   └── middleware/
│       └── auth.js            ← JWT auth + role guard + audit
│
├── biometric/
│   └── fingerprintService.js  ← Fingerprint scanner SDK wrapper
│
├── .env.example               ← Environment variable template
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Step 1 — Install Node.js
Download from https://nodejs.org (v18 or later)

### Step 2 — Install PostgreSQL
- Download from https://postgresql.org
- Create database: `CREATE DATABASE uniuty_db;`
- Run the SQL schema in `server/config/database.js` (the comments at the bottom)

### Step 3 — Install Dependencies
```bash
cd uniuty
npm install
```

### Step 4 — Configure Environment
```bash
cp .env.example .env
# Edit .env with your database password, JWT secret, etc.
```

### Step 5 — Start the Server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

### Step 6 — Open in Browser
```
http://localhost:3000
```

---

## 🖐 Fingerprint Hardware Setup

### Supported Scanners

| Scanner | Protocol | OS Support | SDK Package |
|---------|----------|------------|-------------|
| DigitalPersona U.are.U 4500 | USB HID | Win/Linux/Mac | `node-digitalpersona` |
| Secugen HamsterPro 20 | USB | Win/Linux | `node-secugen` |
| ZKTeco SLK20R | USB/Serial | Win/Linux | `node-zkteco` |
| Suprema BioMini | USB | Win/Linux/Mac | `node-suprema` |

### Step-by-Step: DigitalPersona U.are.U 4500 (Recommended)

#### 1. Install the Hardware Driver
- Download DigitalPersona SDK from:
  `https://www.hidglobal.com/drivers`
- Install the Windows driver (or use libusb on Linux)
- Plug in the USB fingerprint reader
- Windows: should show "DigitalPersona U.are.U Fingerprint Reader" in Device Manager

#### 2. Install the Node.js SDK
```bash
# Windows
npm install node-digitalpersona

# Linux — also needs libusb
sudo apt-get install libusb-1.0-0-dev
npm install node-digitalpersona
```

#### 3. Update .env
```
FINGERPRINT_SDK=digitalpersona
FINGERPRINT_TIMEOUT=10000
FINGERPRINT_MIN_QUALITY=60
FINGERPRINT_MATCH_THRESHOLD=40
```

#### 4. The service auto-detects hardware
The `biometric/fingerprintService.js` tries to load the SDK on startup.
If it fails (no hardware), it falls back to **simulation mode** automatically.
You'll see in the console:
```
✅ Fingerprint hardware SDK loaded (DigitalPersona)
✅ Fingerprint reader initialized and ready
```
or in simulation mode:
```
⚠️  Fingerprint hardware SDK not found — running in SIMULATION mode
```

### How the Biometric Flow Works

```
Browser clicks "Verify Fingerprint"
        ↓
POST /api/biometric/verify/fingerprint  { userId, purpose }
        ↓
Server emits Socket.IO → browser shows "Scanning..." 
        ↓
fingerprintService.capture()  ← hardware reads finger
        ↓
fingerprintService.verify()   ← compares to stored template
        ↓
match score returned (0-100)
        ↓
if score ≥ 40 → SUCCESS → issue biometric JWT token
if score < 40 → FAILURE → browser shows error
        ↓
Socket.IO pushes result to browser in real-time
```

### Enrolment Flow (First-time setup per user)
1. Admin goes to User Management → select user → "Enrol Biometric"
2. POST `/api/biometric/enroll/fingerprint` with `{ userId, finger: 'right_index' }`
3. System asks for 3 fingerprint captures
4. Templates are merged, encrypted with AES-256, stored in DB
5. User can now authenticate using their fingerprint

---

## 📱 Mobile Responsiveness

The portal is fully mobile-responsive:

| Screen Size | Behaviour |
|-------------|-----------|
| Desktop (>768px) | Sidebar always visible, full layout |
| Tablet (768px) | Sidebar hidden, hamburger menu, collapsed grids |
| Mobile (480px) | Bottom navigation bar, single column, large touch targets |
| Small (380px) | All grids collapse to 1 column |

### Mobile-specific features:
- **Bottom navigation bar** — quick access to main 5 pages
- **Hamburger menu** — slides in sidebar as full overlay
- **44px minimum touch targets** — all buttons meet Apple/Google guidelines
- **No zoom on input focus** — `font-size: 14px` on all inputs prevents iOS auto-zoom
- **Safe area insets** — handles iPhone notch with `env(safe-area-inset-bottom)`
- **Dynamic viewport height** — uses `100dvh` so address bar doesn't overlap content

---

## 🔒 Security Notes

1. **Templates are encrypted** — fingerprint data is AES-256 encrypted before DB storage
2. **Biometric JWT** — result submission requires a short-lived (15min) biometric token
3. **Audit trail** — every action logged with timestamp, IP, and biometric verification status
4. **Rate limiting** — add `express-rate-limit` to prevent brute force (see below)
5. **Never store raw templates** — always encrypt before storage

```javascript
// Add to server/app.js for production rate limiting:
const rateLimit = require('express-rate-limit');
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 login attempts
  message: { error: 'Too many attempts — try again in 15 minutes' }
}));
app.use('/api/biometric', rateLimit({
  windowMs: 60 * 1000,        // 1 minute
  max: 10,                    // 10 scan attempts
}));
```

---

## 🌐 Deployment

### Option 1: Simple VPS (Recommended for University)
```bash
# On Ubuntu server
sudo apt install nodejs postgresql nginx

# Clone project, install deps
git clone your-repo
cd uniuty && npm install

# Use PM2 for process management
npm install -g pm2
pm2 start server/app.js --name uniuty-portal
pm2 save && pm2 startup

# Nginx reverse proxy
# /etc/nginx/sites-available/uniuty
server {
    listen 80;
    server_name portal.uniuty.edu.ng;
    location / { proxy_pass http://localhost:3000; }
}
```

### Option 2: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server/app.js"]
```

---

## 📞 Hardware Vendor Contacts (Nigeria)

For fingerprint scanners with local support:
- **ZKTeco Nigeria**: Lagos office — sells SLK20R (~₦25,000–₦45,000)
- **Suprema distributors**: Available on Jumia and IT hardware stores
- **DigitalPersona (HID)**: Order via international vendors, delivered to Nigeria
