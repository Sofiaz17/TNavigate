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

const mongoose = require('mongoose');
const TestUtils = require('./test-utils');

// Global test setup
beforeAll(async () => {
    // Test database connection
    const isConnected = await TestUtils.testDatabaseConnection();
    if (!isConnected) {
        throw new Error('Database connection failed. Make sure MongoDB is running.');
    }
    
    console.log(' Database connection established for tests');
});

// Global test teardown
afterAll(async () => {
    // Clean up any remaining test data
    await TestUtils.cleanupTestUsers();
    console.log(' Test cleanup completed');
});

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global test utilities
global.TestUtils = TestUtils;
