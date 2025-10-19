// TextEncoder/TextDecoder polyfills are now handled in test-setup.js

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

        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.user).toBeDefined();
        expect(response.body.user.id).toBeDefined();
        expect(response.body.user.userType).toBe('base_user');
        expect(response.body.user.name).toBe('John');
        expect(response.body.user.surname).toBe('Doe');
        expect(response.body.user.email).toBe('test@example.com');
        
        testUserId = response.body.user.id;
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

        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.user).toBeDefined();
        expect(response.body.user.id).toBeDefined();
        expect(response.body.user.userType).toBe('shop_owner');
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

        expect(response.body.message).toBe('Email already exists');
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

        expect(response.body.message).toBe('Invalid user type');
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

        expect(response.body.message).toBe('Validation error');
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

        expect(response.body.message).toBe('Invalid credentials');
    });

    test('GET /api/v1/users/{userId} should return user profile with valid token', async () => {
        // First authenticate to get token
        const loginResponse = await request(app)
            .post('/api/v1/authentications')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
            .expect(200);

        const token = loginResponse.body.token;

        const response = await request(app)
            .get(`/api/v1/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body.id).toBe(testUserId);
        expect(response.body.userType).toBe('base_user');
        expect(response.body.name).toBe('John');
        expect(response.body.surname).toBe('Doe');
        expect(response.body.email).toBe('test@example.com');
        expect(response.body.phone).toBe('+39 123 456 7890');
        expect(response.body.address).toBe('Via Test, 1, Trento TN');
    });

    test('GET /api/v1/users/{userId} should reject access without token', async () => {
        const response = await request(app)
            .get(`/api/v1/users/${testUserId}`)
            .expect(401);

        expect(response.body.message).toBe('No token provided.');
    });

    test('GET /api/v1/users/{userId} should reject access to other user profile', async () => {
        // Create another user
        const anotherUser = await request(app)
            .post('/api/v1/users/register')
            .send({
                userType: 'base_user',
                name: 'Another',
                surname: 'User',
                email: 'another@example.com',
                password: 'password123'
            })
            .expect(201);

        // Authenticate as first user
        const loginResponse = await request(app)
            .post('/api/v1/authentications')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
            .expect(200);

        const token = loginResponse.body.token;

        // Try to access another user's profile
        const response = await request(app)
            .get(`/api/v1/users/${anotherUser.body.user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(403);

        expect(response.body.message).toBe('Access denied');

        // Clean up
        await User.deleteOne({ email: 'another@example.com' });
    });

    test('PUT /api/v1/users/{userId} should update user profile', async () => {
        // Authenticate to get token
        const loginResponse = await request(app)
            .post('/api/v1/authentications')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
            .expect(200);

        const token = loginResponse.body.token;

        const updateData = {
            name: 'John Updated',
            surname: 'Doe Updated',
            phone: '+39 999 888 7777',
            address: 'Via Updated, 123, Trento TN'
        };

        const response = await request(app)
            .put(`/api/v1/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData)
            .expect(200);

        expect(response.body.message).toBe('Profile updated successfully');
        expect(response.body.user.name).toBe('John Updated');
        expect(response.body.user.surname).toBe('Doe Updated');
        expect(response.body.user.phone).toBe('+39 999 888 7777');
        expect(response.body.user.address).toBe('Via Updated, 123, Trento TN');
    });

    test('PUT /api/v1/users/{userId} should update password with current password', async () => {
        // Authenticate to get token
        const loginResponse = await request(app)
            .post('/api/v1/authentications')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
            .expect(200);

        const token = loginResponse.body.token;

        const updateData = {
            currentPassword: 'password123',
            newPassword: 'newpassword123'
        };

        const response = await request(app)
            .put(`/api/v1/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData)
            .expect(200);

        expect(response.body.message).toBe('Profile updated successfully');

        // Verify new password works
        const newLoginResponse = await request(app)
            .post('/api/v1/authentications')
            .send({
                email: 'test@example.com',
                password: 'newpassword123'
            })
            .expect(200);

        expect(newLoginResponse.body.token).toBeDefined();
    });

    test('PUT /api/v1/users/{userId} should reject password change without current password', async () => {
        // Authenticate to get token
        const loginResponse = await request(app)
            .post('/api/v1/authentications')
            .send({
                email: 'test@example.com',
                password: 'newpassword123'
            })
            .expect(200);

        const token = loginResponse.body.token;

        const updateData = {
            newPassword: 'anotherpassword123'
        };

        const response = await request(app)
            .put(`/api/v1/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData)
            .expect(400);

        expect(response.body.message).toBe('Current password is required to change password');
    });

    test('PUT /api/v1/users/{userId} should reject wrong current password', async () => {
        // Authenticate to get token
        const loginResponse = await request(app)
            .post('/api/v1/authentications')
            .send({
                email: 'test@example.com',
                password: 'newpassword123'
            })
            .expect(200);

        const token = loginResponse.body.token;

        const updateData = {
            currentPassword: 'wrongpassword',
            newPassword: 'anotherpassword123'
        };

        const response = await request(app)
            .put(`/api/v1/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData)
            .expect(400);

        expect(response.body.message).toBe('Current password is incorrect');
    });

    test('DELETE /api/v1/users/{userId} should delete user account', async () => {
        // Authenticate to get token
        const loginResponse = await request(app)
            .post('/api/v1/authentications')
            .send({
                email: 'test@example.com',
                password: 'newpassword123'
            })
            .expect(200);

        const token = loginResponse.body.token;

        const response = await request(app)
            .delete(`/api/v1/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body.message).toBe('Account deleted successfully');

        // Verify user is deleted by trying to authenticate
        await request(app)
            .post('/api/v1/authentications')
            .send({
                email: 'test@example.com',
                password: 'newpassword123'
            })
            .expect(401);
    });
});
