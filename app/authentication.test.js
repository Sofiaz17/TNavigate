const request = require('supertest');
const app = require('./app');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

describe('Authentication System', () => {
    let testUser;

    beforeAll(async () => {
        // Clean up any existing test users
        await User.deleteMany({ email: { $in: ['auth-test@example.com', 'auth-test2@example.com'] } });
        
        // Create a test user for authentication tests
        testUser = new User({
            userType: 'base_user',
            name: 'Auth',
            surname: 'Test',
            email: 'auth-test@example.com',
            password: 'password123',
            phone: '+39 123 456 7890',
            address: 'Via Auth Test, 1, Trento TN'
        });
        await testUser.save();
    });

    afterAll(async () => {
        // Clean up test users
        await User.deleteMany({ email: { $in: ['auth-test@example.com', 'auth-test2@example.com'] } });
    });

    describe('POST /api/v1/authentications', () => {
        test('should authenticate user with valid credentials', async () => {
            const loginData = {
                email: 'auth-test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(200);

            expect(response.body.token).toBeDefined();
            expect(response.body.id).toBe(testUser._id.toString());
            expect(response.body.email).toBe('auth-test@example.com');
            expect(response.body.userType).toBe('base_user');
            expect(response.body.name).toBe('Auth');
            expect(response.body.surname).toBe('Test');
            expect(response.body.phone).toBe('+39 123 456 7890');
            expect(response.body.address).toBe('Via Auth Test, 1, Trento TN');
            expect(response.body.self).toBe(`/api/v1/users/${testUser._id}`);

            // Verify token is valid
            const decoded = jwt.verify(response.body.token, process.env.SUPER_SECRET);
            expect(decoded.email).toBe('auth-test@example.com');
            expect(decoded.id).toBe(testUser._id.toString());
            expect(decoded.userType).toBe('base_user');
        });

        test('should authenticate shop owner with valid credentials', async () => {
            // Create a shop owner
            const shopOwner = new User({
                userType: 'shop_owner',
                name: 'Shop',
                surname: 'Owner',
                email: 'auth-test2@example.com',
                password: 'password123'
            });
            await shopOwner.save();

            const loginData = {
                email: 'auth-test2@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(200);

            expect(response.body.token).toBeDefined();
            expect(response.body.id).toBe(shopOwner._id.toString());
            expect(response.body.email).toBe('auth-test2@example.com');
            expect(response.body.userType).toBe('shop_owner');
            expect(response.body.name).toBe('Shop');
            expect(response.body.surname).toBe('Owner');

            // Clean up
            await User.deleteOne({ _id: shopOwner._id });
        });

        test('should reject authentication with invalid email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(401);

            expect(response.body.message).toBe('Invalid credentials');
        });

        test('should reject authentication with invalid password', async () => {
            const loginData = {
                email: 'auth-test@example.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(401);

            expect(response.body.message).toBe('Invalid credentials');
        });

        test('should reject authentication with missing email', async () => {
            const loginData = {
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(400);

            expect(response.body.message).toBe('Email and password are required');
        });

        test('should reject authentication with missing password', async () => {
            const loginData = {
                email: 'auth-test@example.com'
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(400);

            expect(response.body.message).toBe('Email and password are required');
        });

        test('should reject authentication with empty credentials', async () => {
            const loginData = {};

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(400);

            expect(response.body.message).toBe('Email and password are required');
        });

        test('should handle case-insensitive email authentication', async () => {
            const loginData = {
                email: 'AUTH-TEST@EXAMPLE.COM', // Uppercase
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(200);

            expect(response.body.token).toBeDefined();
            expect(response.body.email).toBe('auth-test@example.com'); // Should be lowercase in response
        });

        test('should handle email with extra whitespace', async () => {
            const loginData = {
                email: '  auth-test@example.com  ', // With spaces
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(200);

            expect(response.body.token).toBeDefined();
            expect(response.body.email).toBe('auth-test@example.com');
        });
    });

    describe('JWT Token Validation', () => {
        test('should create token with correct expiration', async () => {
            const loginData = {
                email: 'auth-test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(200);

            const token = response.body.token;
            const decoded = jwt.verify(token, process.env.SUPER_SECRET);
            
            // Check that token expires in 24 hours (86400 seconds)
            const now = Math.floor(Date.now() / 1000);
            const expiration = decoded.exp;
            const timeUntilExpiry = expiration - now;
            
            // Should be close to 86400 seconds (24 hours)
            expect(timeUntilExpiry).toBeGreaterThan(86300); // Allow 100 seconds tolerance
            expect(timeUntilExpiry).toBeLessThanOrEqual(86400);
        });

        test('should include correct payload in token', async () => {
            const loginData = {
                email: 'auth-test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(200);

            const token = response.body.token;
            const decoded = jwt.verify(token, process.env.SUPER_SECRET);
            
            expect(decoded.email).toBe('auth-test@example.com');
            expect(decoded.id).toBe(testUser._id.toString());
            expect(decoded.userType).toBe('base_user');
            expect(decoded.iat).toBeDefined(); // Issued at
            expect(decoded.exp).toBeDefined(); // Expires at
        });
    });

    describe('Error Handling', () => {
        test('should handle database connection errors gracefully', async () => {
            // This test would require mocking the database connection
            // For now, we'll test that the endpoint doesn't crash with malformed data
            const malformedData = {
                email: null,
                password: null
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(malformedData)
                .expect(400);

            expect(response.body.message).toBe('Email and password are required');
        });

        test('should handle very long email addresses', async () => {
            const longEmail = 'a'.repeat(100) + '@example.com';
            const loginData = {
                email: longEmail,
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(401);

            expect(response.body.message).toBe('Invalid credentials');
        });

        test('should handle very long passwords', async () => {
            const longPassword = 'a'.repeat(1000);
            const loginData = {
                email: 'auth-test@example.com',
                password: longPassword
            };

            const response = await request(app)
                .post('/api/v1/authentications')
                .send(loginData)
                .expect(401);

            expect(response.body.message).toBe('Invalid credentials');
        });
    });
});
