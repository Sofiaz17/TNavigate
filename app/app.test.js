// Add this at the top of your test file or a setup file
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const request = require('supertest');
const app = require('./app');

test('app module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET / should return 200', () => {
    return request(app)
    .get('/')
    .expect(200);
});
