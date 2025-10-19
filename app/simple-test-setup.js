// Simple test setup without database connection
// This is used for basic API structure tests

// Add polyfills for Node.js compatibility
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add AbortController polyfill
if (typeof global.AbortController === 'undefined') {
    global.AbortController = require('abort-controller');
}

// Add fetch polyfill if needed
if (typeof global.fetch === 'undefined') {
    global.fetch = require('node-fetch');
}

// Increase timeout for tests
jest.setTimeout(30000);
