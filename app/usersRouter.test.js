// Add this at the top of your test file or a setup file
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const request = require('supertest');
const app = require('./app');
const User = require('./models/user');

describe('User Registration and Authentication', () => {
    let testUserId;

    beforeAll(async () => {
        // Clear any existing test users
        await User.deleteMany({ email: { $in: ['test@example.com', 'test2@example.com'] } });
    });

    afterAll(async () => {
        // Clean up test users
        await User.deleteMany({ email: { $in: ['test@example.com', 'test2@example.com'] } });
    });

    test('POST /api/v1/users/register should register a new base user', async () => {
        const userData = {
            userType: 'base_user',
            name: 'John',
            surname: 'Doe',
            email: 'test@example.com',
            password: 'password123',
            phone: '+39 123 456 7890',
            address: 'Via Test, 1, Trento TN'
        };

        const response = await request(app)
            .post('/api/v1/users/register')
            .send(userData)
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.userId).toBeDefined();
        
        testUserId = response.body.userId;
    });

    test('POST /api/v1/users/register should register a new shop owner', async () => {
        const userData = {
            userType: 'shop_owner',
            name: 'Jane',
            surname: 'Smith',
            email: 'test2@example.com',
            password: 'password123',
            phone: '+39 987 654 3210',
            address: 'Via Shop, 2, Trento TN'
        };

        const response = await request(app)
            .post('/api/v1/users/register')
            .send(userData)
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.userId).toBeDefined();
    });

    test('POST /api/v1/users/register should reject duplicate email', async () => {
        const userData = {
            userType: 'base_user',
            name: 'Duplicate',
            surname: 'User',
            email: 'test@example.com', // Same email as first test
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/v1/users/register')
            .send(userData)
            .expect(409);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User with this email already exists');
    });

    test('POST /api/v1/users/register should reject invalid userType', async () => {
        const userData = {
            userType: 'invalid_type',
            name: 'Test',
            surname: 'User',
            email: 'invalid@example.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/v1/users/register')
            .send(userData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Invalid userType');
    });

    test('POST /api/v1/users/register should reject weak password', async () => {
        const userData = {
            userType: 'base_user',
            name: 'Test',
            surname: 'User',
            email: 'weak@example.com',
            password: '123' // Too short
        };

        const response = await request(app)
            .post('/api/v1/users/register')
            .send(userData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Password must be at least 6 characters long');
    });

    test('POST /api/v1/authentications should authenticate user and return complete profile', async () => {
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/v1/authentications')
            .send(loginData)
            .expect(200);

        expect(response.body.token).toBeDefined();
        expect(response.body.email).toBe('test@example.com');
        expect(response.body.id).toBeDefined();
        expect(response.body.userType).toBe('base_user');
        expect(response.body.name).toBe('John');
        expect(response.body.surname).toBe('Doe');
        expect(response.body.phone).toBe('+39 123 456 7890');
        expect(response.body.address).toBe('Via Test, 1, Trento TN');
    });

    test('POST /api/v1/authentications should reject invalid credentials', async () => {
        const loginData = {
            email: 'test@example.com',
            password: 'wrongpassword'
        };

        const response = await request(app)
            .post('/api/v1/authentications')
            .send(loginData)
            .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Authentication failed. Wrong password.');
    });
});
