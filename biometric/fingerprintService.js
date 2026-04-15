// ═══════════════════════════════════════════════════════
//  UNIUTY Portal — Fingerprint Biometric Service
//  biometric/fingerprintService.js
//
//  Supports: DigitalPersona U.are.U 4500 (USB)
//            Secugen HU20 (USB)
//            ZKTeco SLK20R (USB/Serial)
//
//  HOW IT WORKS:
//  1. User places finger on scanner
//  2. SDK captures raw image → extracts minutiae template
//  3. Template is compared against stored template in DB
//  4. Match score returned (0-100). Threshold = 40+
//  5. Result pushed to browser via Socket.IO in real-time
// ═══════════════════════════════════════════════════════

const EventEmitter = require('events');
const crypto       = require('crypto');
const { query }    = require('../server/config/database');

// ── Try to load hardware SDK ─────────────────────────────
// These are the real SDK packages. Install the one that
// matches your physical fingerprint scanner hardware.
//
//  DigitalPersona:  npm install node-digitalpersona
//  Secugen:         npm install node-secugen  
//  ZKTeco:          npm install node-zkteco
//
// For development/testing without hardware, we fall back
// to a software simulation mode automatically.

let FingerprintSDK = null;
let HARDWARE_MODE  = false;

try {
  // Attempt to load real SDK — will fail if not installed
  // Replace 'node-digitalpersona' with your actual SDK package
  FingerprintSDK = require('node-digitalpersona');
  HARDWARE_MODE  = true;
  console.log('✅ Fingerprint hardware SDK loaded (DigitalPersona)');
} catch (err) {
  console.warn('⚠️  Fingerprint hardware SDK not found — running in SIMULATION mode');
  console.warn('   Install your scanner SDK: npm install node-digitalpersona');
  HARDWARE_MODE = false;
}

class FingerprintService extends EventEmitter {
  constructor() {
    super();
    this.reader     = null;
    this.isScanning = false;
    this.quality    = parseInt(process.env.FINGERPRINT_MIN_QUALITY) || 60;
    this.threshold  = parseInt(process.env.FINGERPRINT_MATCH_THRESHOLD) || 40;
    this.timeout    = parseInt(process.env.FINGERPRINT_TIMEOUT) || 10000;
  }

  // ── Initialize hardware connection ─────────────────────
  async initialize() {
    if (!HARDWARE_MODE) {
      console.log('🔬 Fingerprint service: simulation mode active');
      return { success: true, mode: 'simulation' };
    }

    try {
      // Initialize the DigitalPersona SDK reader
      // This opens the USB connection to the scanner
      this.reader = new FingerprintSDK.Reader();

      // Event: finger placed on scanner
      this.reader.on('fingerDetected', () => {
        this.emit('fingerDetected');
        console.log('🖐 Finger detected on scanner');
      });

      // Event: finger lifted from scanner
      this.reader.on('fingerRemoved', () => {
        this.emit('fingerRemoved');
      });

      // Event: reader disconnected (e.g., USB unplugged)
      this.reader.on('readerDisconnected', () => {
        console.error('❌ Fingerprint reader disconnected!');
        this.emit('readerDisconnected');
        this.reader = null;
      });

      await this.reader.open();
      console.log('✅ Fingerprint reader initialized and ready');
      return { success: true, mode: 'hardware' };

    } catch (err) {
      console.error('❌ Failed to initialize fingerprint reader:', err.message);
      console.warn('   Falling back to simulation mode');
      HARDWARE_MODE = false;
      return { success: false, error: err.message, mode: 'simulation' };
    }
  }

  // ── Capture a fingerprint template from the scanner ────
  async capture() {
    return new Promise(async (resolve, reject) => {

      // ── SIMULATION MODE (no hardware) ──────────────────
      if (!HARDWARE_MODE) {
        console.log('🔬 Simulating fingerprint capture...');
        setTimeout(() => {
          // Generate a fake template for testing
          const fakeTemplate = crypto.randomBytes(512);
          resolve({
            success:  true,
            template: fakeTemplate,
            quality:  Math.floor(Math.random() * 20) + 75, // 75-95
            simulated: true
          });
        }, 1500); // Simulate 1.5s scan time
        return;
      }

      // ── HARDWARE MODE ──────────────────────────────────
      if (this.isScanning) {
        return reject(new Error('Scanner already in use'));
      }

      this.isScanning = true;
      let timeoutId;

      try {
        // Set timeout so we don't hang forever
        timeoutId = setTimeout(() => {
          this.isScanning = false;
          reject(new Error('Fingerprint scan timed out — please try again'));
        }, this.timeout);

        // Tell the SDK to start capturing
        const result = await this.reader.capture({
          quality:    this.quality,      // Min quality score
          maxRetries: 3                  // Retry up to 3 times if poor quality
        });

        clearTimeout(timeoutId);
        this.isScanning = false;

        if (result.quality < this.quality) {
          return reject(new Error(`Poor scan quality (${result.quality}). Please clean finger and try again.`));
        }

        resolve({
          success:  true,
          template: result.template,     // Binary minutiae template
          quality:  result.quality,      // Quality score 0-100
          simulated: false
        });

      } catch (err) {
        clearTimeout(timeoutId);
        this.isScanning = false;
        reject(err);
      }
    });
  }

  // ── Encrypt template before storing in database ─────────
  // IMPORTANT: Never store raw biometric data — always encrypt
  encryptTemplate(template) {
    const key = crypto.scryptSync(
      process.env.JWT_SECRET + '_biometric',
      'uniuty_salt_2024',
      32
    );
    const iv         = crypto.randomBytes(16);
    const cipher     = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted  = Buffer.concat([cipher.update(template), cipher.final()]);
    return {
      iv:        iv.toString('hex'),
      data:      encrypted.toString('hex')
    };
  }

  // ── Decrypt template for matching ───────────────────────
  decryptTemplate(encryptedObj) {
    const key       = crypto.scryptSync(
      process.env.JWT_SECRET + '_biometric',
      'uniuty_salt_2024',
      32
    );
    const iv        = Buffer.from(encryptedObj.iv, 'hex');
    const encrypted = Buffer.from(encryptedObj.data, 'hex');
    const decipher  = crypto.createDecipheriv('aes-256-cbc', key, iv);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }

  // ── Enroll a user's fingerprint ─────────────────────────
  // Called once when setting up a new user's biometric profile
  async enroll(userId, finger = 'right_index') {
    console.log(`📝 Enrolling fingerprint for user ${userId} (${finger})`);

    try {
      // Capture 3 samples for better template quality
      const samples = [];
      for (let i = 0; i < 3; i++) {
        this.emit('enrollProgress', { step: i + 1, total: 3 });
        console.log(`   Capture ${i + 1}/3 — place finger on scanner...`);
        const sample = await this.capture();
        samples.push(sample.template);

        if (i < 2) {
          // Ask user to lift and replace finger between captures
          this.emit('liftFinger');
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      // Merge 3 captures into one high-quality template
      // In hardware mode, the SDK does this; in sim mode we just use the first
      let finalTemplate;
      if (HARDWARE_MODE) {
        finalTemplate = await this.reader.createTemplate(samples);
      } else {
        finalTemplate = samples[0]; // simulation
      }

      // Encrypt the template before storing
      const encrypted = this.encryptTemplate(finalTemplate);

      // Save to database
      const result = await query(
        `INSERT INTO biometric_templates (user_id, method, template_data, enrolled_at)
         VALUES ($1, 'fingerprint', $2, NOW())
         ON CONFLICT (user_id, method) DO UPDATE
         SET template_data = $2, enrolled_at = NOW()
         RETURNING id`,
        [userId, JSON.stringify(encrypted)]
      );

      console.log(`✅ Fingerprint enrolled for user ${userId}`);
      return {
        success:    true,
        templateId: result.rows[0].id,
        finger:     finger
      };

    } catch (err) {
      console.error(`❌ Enrolment failed for user ${userId}:`, err.message);
      throw err;
    }
  }

  // ── Verify a fingerprint against stored template ─────────
  // Returns { success, matchScore, userId } or throws
  async verify(userId, purpose = 'authentication', ipAddress = '') {
    console.log(`🔐 Verifying fingerprint for user ${userId} — ${purpose}`);

    try {
      // 1. Capture live fingerprint from scanner
      const live = await this.capture();

      // 2. Load stored (encrypted) template from database
      const dbResult = await query(
        `SELECT template_data FROM biometric_templates
         WHERE user_id = $1 AND method = 'fingerprint' AND is_active = TRUE`,
        [userId]
      );

      if (dbResult.rows.length === 0) {
        throw new Error('No fingerprint enrolled for this user. Please enroll first.');
      }

      const storedEncrypted = JSON.parse(dbResult.rows[0].template_data);
      const storedTemplate  = this.decryptTemplate(storedEncrypted);

      // 3. Match live vs stored template
      let matchScore;
      if (HARDWARE_MODE) {
        // Real SDK comparison — returns 0-100 score
        matchScore = await this.reader.match(live.template, storedTemplate);
      } else {
        // Simulation: generate realistic match score
        // 90% chance of success (simulates real-world FAR/FRR)
        matchScore = Math.random() > 0.1
          ? Math.floor(Math.random() * 30) + 65  // 65-95 (match)
          : Math.floor(Math.random() * 35);       // 0-35 (no match)
      }

      const matched = matchScore >= this.threshold;

      // 4. Log the attempt to the audit table
      await query(
        `INSERT INTO biometric_log (user_id, method, purpose, location, success, match_score, ip_address)
         VALUES ($1, 'fingerprint', $2, $3, $4, $5, $6)`,
        [userId, purpose, 'Portal', matched, matchScore, ipAddress]
      );

      // 5. Update last_used timestamp if successful
      if (matched) {
        await query(
          `UPDATE biometric_templates SET last_used = NOW()
           WHERE user_id = $1 AND method = 'fingerprint'`,
          [userId]
        );
      }

      console.log(`${matched ? '✅' : '❌'} Match score: ${matchScore} (threshold: ${this.threshold})`);

      return {
        success:    matched,
        matchScore: matchScore,
        quality:    live.quality,
        userId:     userId,
        purpose:    purpose,
        simulated:  live.simulated || false
      };

    } catch (err) {
      // Log failed attempt
      await query(
        `INSERT INTO biometric_log (user_id, method, purpose, success, ip_address)
         VALUES ($1, 'fingerprint', $2, FALSE, $3)`,
        [userId, purpose, ipAddress]
      ).catch(() => {}); // Don't throw if audit log fails

      throw err;
    }
  }

  // ── Check if reader is connected and ready ──────────────
  async getStatus() {
    if (!HARDWARE_MODE) {
      return { connected: true, mode: 'simulation', ready: true };
    }
    try {
      const status = await this.reader?.getStatus();
      return { connected: !!this.reader, mode: 'hardware', ...status };
    } catch {
      return { connected: false, mode: 'hardware', ready: false };
    }
  }

  // ── Graceful shutdown ───────────────────────────────────
  async close() {
    if (HARDWARE_MODE && this.reader) {
      await this.reader.close();
      this.reader = null;
    }
  }
}

// Export a singleton instance
const fingerprintService = new FingerprintService();
module.exports = fingerprintService;
