#!/usr/bin/env node
/**
 * Metro bundler starter that listens on all interfaces for LAN access
 */
const Metro = require('metro');
const path = require('path');

const config = require('./metro.config');

// Start Metro server on 0.0.0.0 (all interfaces)
Metro.runServer(config, {
  host: '0.0.0.0',
  port: 8081,
  secure: false,
  secureCert: undefined,
  secureKey: undefined,
  onReady: () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  Metro Bundler Started                                     ║
║  Local:   http://localhost:8081                           ║
║  LAN:     http://192.168.1.163:8081                       ║
║  Press Ctrl+C to exit                                      ║
╚════════════════════════════════════════════════════════════╝
    `);
  },
}).catch(err => {
  console.error('Metro error:', err);
  process.exit(1);
});
