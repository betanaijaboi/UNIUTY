/* ═══════════════════════════════════════════════════════════
   UNIUTY PORTAL — BIOMETRIC HARDWARE PLUGIN API
   ─────────────────────────────────────────────────────────
   This file defines the BiometricAPI interface.
   It ships with a built-in simulation layer so the portal
   works in development / demo without any hardware.

   To integrate real hardware, create a plugin file (e.g.
   js/plugins/zkteco-fingerprint.js) and call:

     BiometricAPI.register('fingerprint', MyPlugin);

   The portal UI calls BiometricAPI.scan() and never touches
   hardware directly — swap plugins without touching the UI.
═══════════════════════════════════════════════════════════ */

const BiometricAPI = (() => {

  /* ── Registered hardware plugins (keyed by method name) ── */
  const _plugins = {};

  /* ── Event listeners ── */
  const _listeners = { scan: [], enroll: [], error: [] };

  /* ── Internal helpers ── */
  function _emit(event, data) {
    (_listeners[event] || []).forEach(fn => fn(data));
  }

  function _log(level, method, msg, data = {}) {
    const entry = { ts: new Date().toISOString(), level, method, msg, ...data };
    console[level === 'error' ? 'error' : 'info']('[BiometricAPI]', entry);
    // Append to an in-memory audit trail accessible from the UI
    BiometricAPI._auditTrail.push(entry);
    if (BiometricAPI._auditTrail.length > 500) BiometricAPI._auditTrail.shift();
  }

  /* ── Simulation layer (no hardware required) ── */
  const _simulate = {
    /* Simulated fingerprint scan — resolves after 2 s */
    fingerprint: async (userId) => {
      await _delay(2000);
      const ok = Math.random() > 0.08;
      return {
        success:   ok,
        method:    'fingerprint',
        userId,
        quality:   ok ? Math.floor(70 + Math.random() * 30) : 0,
        template:  ok ? btoa(`FP_TMPL_${userId}_${Date.now()}`) : null,
        message:   ok ? 'Fingerprint matched' : 'No match — please retry',
        simulated: true,
      };
    },

    /* Simulated retina scan — resolves after 2.5 s */
    retina: async (userId) => {
      await _delay(2500);
      const ok = Math.random() > 0.06;
      return {
        success:   ok,
        method:    'retina',
        userId,
        quality:   ok ? Math.floor(80 + Math.random() * 20) : 0,
        template:  ok ? btoa(`RETINA_TMPL_${userId}_${Date.now()}`) : null,
        message:   ok ? 'Retina scan verified' : 'Retina not recognised',
        simulated: true,
      };
    },

    /* Simulated facial recognition — resolves after 1.8 s */
    facial: async (userId) => {
      await _delay(1800);
      const ok = Math.random() > 0.10;
      return {
        success:     ok,
        method:      'facial',
        userId,
        confidence:  ok ? (0.85 + Math.random() * 0.14).toFixed(3) : '0.00',
        boundingBox: ok ? { x: 120, y: 80, w: 200, h: 240 } : null,
        message:     ok ? 'Face matched' : 'Face not recognised',
        simulated:   true,
      };
    },

    /* Simulated NFC card read — resolves after 1.2 s */
    nfc: async (userId) => {
      await _delay(1200);
      const ok = Math.random() > 0.05;
      return {
        success:  ok,
        method:   'nfc',
        userId,
        cardId:   ok ? `UNIUTY-NFC-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}` : null,
        message:  ok ? 'NFC card accepted' : 'Card not recognised or expired',
        simulated: true,
      };
    },
  };

  function _delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ══════════════════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════════════════ */
  return {

    /** In-memory audit trail (read-only from outside) */
    _auditTrail: [],

    /**
     * Register a hardware plugin for a given method.
     *
     * Plugin shape:
     * {
     *   name:   string,          // human-readable name e.g. "ZKTeco USB Scanner"
     *   init(): Promise<void>,   // called once at startup; throw to abort
     *   scan(userId: string): Promise<ScanResult>,
     *   enroll(userId: string): Promise<EnrollResult>,
     *   delete(userId: string): Promise<void>,
     *   verify?(template1, template2): boolean,  // optional local verify
     * }
     *
     * @param {'fingerprint'|'retina'|'facial'|'nfc'} method
     * @param {object} plugin
     */
    async register(method, plugin) {
      if (!plugin || typeof plugin.scan !== 'function') {
        throw new Error(`BiometricAPI.register: plugin for "${method}" must implement scan(userId)`);
      }
      if (typeof plugin.init === 'function') {
        await plugin.init();
      }
      _plugins[method] = plugin;
      _log('info', method, `Plugin registered: ${plugin.name || method}`);
    },

    /** Returns whether a real hardware plugin is registered for the method */
    hasPlugin(method) { return !!_plugins[method]; },

    /** Returns all registered plugin names */
    getPlugins() {
      return Object.fromEntries(Object.entries(_plugins).map(([k, v]) => [k, v.name || k]));
    },

    /**
     * Perform a biometric scan.
     * Falls back to simulation if no plugin is registered.
     *
     * @param {'fingerprint'|'retina'|'facial'|'nfc'} method
     * @param {string} userId  - matric / staff ID
     * @returns {Promise<ScanResult>}
     */
    async scan(method, userId = 'unknown') {
      _log('info', method, `Scan initiated`, { userId, plugin: !!_plugins[method] });
      try {
        let result;
        if (_plugins[method]) {
          result = await _plugins[method].scan(userId);
        } else {
          result = await _simulate[method]?.(userId) ?? {
            success: false, method, userId, message: `Unknown method: ${method}`, simulated: true,
          };
        }
        _log(result.success ? 'info' : 'warn', method, result.message, { userId, result });
        _emit('scan', result);
        return result;
      } catch (err) {
        const result = { success: false, method, userId, message: err.message, error: true };
        _log('error', method, `Scan error: ${err.message}`, { userId });
        _emit('error', result);
        return result;
      }
    },

    /**
     * Enroll a new user's biometric template.
     * @param {'fingerprint'|'retina'|'facial'|'nfc'} method
     * @param {string} userId
     * @returns {Promise<EnrollResult>}
     */
    async enroll(method, userId) {
      _log('info', method, `Enroll initiated`, { userId });
      if (_plugins[method]?.enroll) {
        return _plugins[method].enroll(userId);
      }
      // Simulation: just return a fake enroll success
      await _delay(3000);
      const result = {
        success: true, method, userId,
        template: btoa(`ENROLL_${method.toUpperCase()}_${userId}_${Date.now()}`),
        message: `${method} template enrolled (simulated)`,
        simulated: true,
      };
      _emit('enroll', result);
      return result;
    },

    /**
     * Delete a user's stored biometric template.
     * @param {'fingerprint'|'retina'|'facial'|'nfc'} method
     * @param {string} userId
     */
    async delete(method, userId) {
      if (_plugins[method]?.delete) {
        return _plugins[method].delete(userId);
      }
      _log('info', method, `Delete template (simulated)`, { userId });
    },

    /**
     * Subscribe to biometric events.
     * @param {'scan'|'enroll'|'error'} event
     * @param {Function} fn
     */
    on(event, fn) {
      if (_listeners[event]) _listeners[event].push(fn);
    },

    /** Remove event listener */
    off(event, fn) {
      if (_listeners[event]) {
        _listeners[event] = _listeners[event].filter(f => f !== fn);
      }
    },

    /**
     * Get audit trail entries, optionally filtered.
     * @param {object} opts  { method, userId, limit }
     */
    getAuditTrail({ method, userId, limit = 100 } = {}) {
      let trail = [...this._auditTrail];
      if (method)  trail = trail.filter(e => e.method === method);
      if (userId)  trail = trail.filter(e => e.userId === userId);
      return trail.slice(-limit).reverse();
    },
  };

})();

/* ══════════════════════════════════════════════════════════
   EXAMPLE PLUGIN TEMPLATE
   Copy this file to js/plugins/my-device.js, implement the
   methods, then include it AFTER biometric.js in index.html.
══════════════════════════════════════════════════════════

const ZKTecoFingerprintPlugin = {
  name: 'ZKTeco ZK4500 USB Fingerprint',

  async init() {
    // Initialise the SDK / USB connection here
    // throw new Error('Device not found') to stop registration
    console.log('ZKTeco SDK initialised');
  },

  async scan(userId) {
    // Call your native bridge / SDK here
    // Return must match BiometricAPI ScanResult shape:
    return {
      success:  true,
      method:   'fingerprint',
      userId,
      quality:  92,
      template: '<base64 template>',
      message:  'Fingerprint matched',
    };
  },

  async enroll(userId) {
    // Capture and store template on device
    return { success: true, method: 'fingerprint', userId, template: '...' };
  },

  async delete(userId) {
    // Remove template from device memory
  },
};

// Register — must be called AFTER BiometricAPI is loaded:
// BiometricAPI.register('fingerprint', ZKTecoFingerprintPlugin);

*/
