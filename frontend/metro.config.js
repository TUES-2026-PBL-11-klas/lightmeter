const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable watchman on Windows to avoid file watching issues
config.watchman = true;

module.exports = config;
