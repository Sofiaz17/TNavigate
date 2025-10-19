const request = require('supertest');
const app = require('./app');
const User = require('./models/user');

describe('Complete User Flow Integration Tests', () => {
    let testUserId;
    let authToken;

    beforeAll(async () => {
        // Clean up any existing test users
        await User.deleteMany({ email: { $in: ['integration-test@example.com'] } });
    });

    afterAll(async () => {
        // Clean up test users
        await User.deleteMany({ email: { $in: ['integration-test@example.com'] } });
    });

    describe('Complete User Lifecycle', () => {
        test('should complete full user lifecycle: register -> authenticate -> get profile -> update profile -> change password -> delete account', async () => {
            // Step 1: Register a new user
            const userData = {
                userType: 'base_user',
                name: 'Integration',
                surname: 'Test',
                email: 'integration-test@example.com',
                password: 'password123',
                phone: '+39 123 456 7890',
                address: 'Via Integration Test, 1, Trento TN'
            };

            const registerResponse = await request(app)
                .post('/api/v1/users/register')
                .send(userData)
                .expect(201);

            expect(registerResponse.body.message).toBe('User registered successfully');
            expect(registerResponse.body.user.id).toBeDefined();
            expect(registerResponse.body.user.email).toBe('integration-test@example.com');
            expect(registerResponse.body.user.userType).toBe('base_user');

            testUserId = registerResponse.body.user.id;

            // Step 2: Authenticate the user
            const authResponse = await request(app)
                .post('/api/v1/authentications')
                .send({
                    email: 'integration-test@example.com',
                    password: 'password123'
                })
                .expect(200);

            expect(authResponse.body.token).toBeDefined();
            expect(authResponse.body.id).toBe(testUserId);
            expect(authResponse.body.email).toBe('integration-test@example.com');

            authToken = authResponse.body.token;

            // Step 3: Get user profile
            const profileResponse = await request(app)
                .get(`/api/v1/users/${testUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(profileResponse.body.id).toBe(testUserId);
            expect(profileResponse.body.name).toBe('Integration');
            expect(profileResponse.body.surname).toBe('Test');
            expect(profileResponse.body.email).toBe('integration-test@example.com');
            expect(profileResponse.body.phone).toBe('+39 123 456 7890');
            expect(profileResponse.body.address).toBe('Via Integration Test, 1, Trento TN');

            // Step 4: Update user profile
            const updateData = {
                name: 'Integration Updated',
                surname: 'Test Updated',
                phone: '+39 999 888 7777',
                address: 'Via Updated Integration, 123, Trento TN'
            };

            const updateResponse = await request(app)
                .put(`/api/v1/users/${testUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData)
                .expect(200);

            expect(updateResponse.body.message).toBe('Profile updated successfully');
            expect(updateResponse.body.user.name).toBe('Integration Updated');
            expect(updateResponse.body.user.surname).toBe('Test Updated');
            expect(updateResponse.body.user.phone).toBe('+39 999 888 7777');
            expect(updateResponse.body.user.address).toBe('Via Updated Integration, 123, Trento TN');

            // Step 5: Change password
            const passwordUpdateData = {
                currentPassword: 'password123',
                newPassword: 'newpassword123'
            };

            const passwordUpdateResponse = await request(app)
                .put(`/api/v1/users/${testUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(passwordUpdateData)
                .expect(200);

            expect(passwordUpdateResponse.body.message).toBe('Profile updated successfully');

            // Step 6: Authenticate with new password
            const newAuthResponse = await request(app)
                .post('/api/v1/authentications')
                .send({
                    email: 'integration-test@example.com',
                    password: 'newpassword123'
                })
                .expect(200);

            expect(newAuthResponse.body.token).toBeDefined();
            authToken = newAuthResponse.body.token; // Update token for final step

            // Step 7: Delete user account
            const deleteResponse = await request(app)
                .delete(`/api/v1/users/${testUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(deleteResponse.body.message).toBe('Account deleted successfully');

            // Step 8: Verify user is deleted (should not be able to authenticate)
            await request(app)
                .post('/api/v1/authentications')
                .send({
                    email: 'integration-test@example.com',
                    password: 'newpassword123'
                })
                .expect(401);
        });
    });

    describe('Multi-User Scenarios', () => {
        let user1Id, user1Token;
        let user2Id, user2Token;

        beforeAll(async () => {
            // Create two test users
            const user1Data = {
                userType: 'base_user',
                name: 'User',
                surname: 'One',
                email: 'user1@integration-test.com',
                password: 'password123'
            };

            const user2Data = {
                userType: 'shop_owner',
                name: 'User',
                surname: 'Two',
                email: 'user2@integration-test.com',
                password: 'password123'
            };

            // Register users
            const user1Response = await request(app)
                .post('/api/v1/users/register')
                .send(user1Data)
                .expect(201);

            const user2Response = await request(app)
                .post('/api/v1/users/register')
                .send(user2Data)
                .expect(201);

            user1Id = user1Response.body.user.id;
            user2Id = user2Response.body.user.id;

            // Authenticate users
            const user1Auth = await request(app)
                .post('/api/v1/authentications')
                .send({
                    email: 'user1@integration-test.com',
                    password: 'password123'
                })
                .expect(200);

            const user2Auth = await request(app)
                .post('/api/v1/authentications')
                .send({
                    email: 'user2@integration-test.com',
                    password: 'password123'
                })
                .expect(200);

            user1Token = user1Auth.body.token;
            user2Token = user2Auth.body.token;
        });

        afterAll(async () => {
            // Clean up test users
            await User.deleteMany({ 
                email: { $in: ['user1@integration-test.com', 'user2@integration-test.com'] } 
            });
        });

        test('should prevent users from accessing each other\'s profiles', async () => {
            // User 1 tries to access User 2's profile
            await request(app)
                .get(`/api/v1/users/${user2Id}`)
                .set('Authorization', `Bearer ${user1Token}`)
                .expect(403);

            // User 2 tries to access User 1's profile
            await request(app)
                .get(`/api/v1/users/${user1Id}`)
                .set('Authorization', `Bearer ${user2Token}`)
                .expect(403);
        });

        test('should prevent users from updating each other\'s profiles', async () => {
            // User 1 tries to update User 2's profile
            await request(app)
                .put(`/api/v1/users/${user2Id}`)
                .set('Authorization', `Bearer ${user1Token}`)
                .send({ name: 'Hacked' })
                .expect(403);

            // User 2 tries to update User 1's profile
            await request(app)
                .put(`/api/v1/users/${user1Id}`)
                .set('Authorization', `Bearer ${user2Token}`)
                .send({ name: 'Hacked' })
                .expect(403);
        });

        test('should prevent users from deleting each other\'s accounts', async () => {
            // User 1 tries to delete User 2's account
            await request(app)
                .delete(`/api/v1/users/${user2Id}`)
                .set('Authorization', `Bearer ${user1Token}`)
                .expect(403);

            // User 2 tries to delete User 1's account
            await request(app)
                .delete(`/api/v1/users/${user1Id}`)
                .set('Authorization', `Bearer ${user2Token}`)
                .expect(403);
        });

        test('should allow users to manage their own profiles independently', async () => {
            // User 1 updates their own profile
            const user1Update = await request(app)
                .put(`/api/v1/users/${user1Id}`)
                .set('Authorization', `Bearer ${user1Token}`)
                .send({ name: 'User One Updated' })
                .expect(200);

            expect(user1Update.body.user.name).toBe('User One Updated');

            // User 2 updates their own profile
            const user2Update = await request(app)
                .put(`/api/v1/users/${user2Id}`)
                .set('Authorization', `Bearer ${user2Token}`)
                .send({ name: 'User Two Updated' })
                .expect(200);

            expect(user2Update.body.user.name).toBe('User Two Updated');

            // Verify both profiles are updated independently
            const user1Profile = await request(app)
                .get(`/api/v1/users/${user1Id}`)
                .set('Authorization', `Bearer ${user1Token}`)
                .expect(200);

            const user2Profile = await request(app)
                .get(`/api/v1/users/${user2Id}`)
                .set('Authorization', `Bearer ${user2Token}`)
                .expect(200);

            expect(user1Profile.body.name).toBe('User One Updated');
            expect(user2Profile.body.name).toBe('User Two Updated');
        });
    });

    describe('Error Recovery and Edge Cases', () => {
        test('should handle token expiration gracefully', async () => {
            // Create a user
            const userData = {
                userType: 'base_user',
                name: 'Token',
                surname: 'Test',
                email: 'token-test@integration.com',
                password: 'password123'
            };

            const registerResponse = await request(app)
                .post('/api/v1/users/register')
                .send(userData)
                .expect(201);

            const userId = registerResponse.body.user.id;

            // Authenticate to get token
            const authResponse = await request(app)
                .post('/api/v1/authentications')
                .send({
                    email: 'token-test@integration.com',
                    password: 'password123'
                })
                .expect(200);

            const validToken = authResponse.body.token;

            // Use valid token
            await request(app)
                .get(`/api/v1/users/${userId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .expect(200);

            // Test with invalid token
            await request(app)
                .get(`/api/v1/users/${userId}`)
                .set('Authorization', 'Bearer invalid-token')
                .expect(403);

            // Test with malformed token
            await request(app)
                .get(`/api/v1/users/${userId}`)
                .set('Authorization', 'Bearer malformed.token.here')
                .expect(403);

            // Clean up
            await User.deleteOne({ email: 'token-test@integration.com' });
        });

        test('should handle concurrent user operations', async () => {
            // Create a user
            const userData = {
                userType: 'base_user',
                name: 'Concurrent',
                surname: 'Test',
                email: 'concurrent-test@integration.com',
                password: 'password123'
            };

            const registerResponse = await request(app)
                .post('/api/v1/users/register')
                .send(userData)
                .expect(201);

            const userId = registerResponse.body.user.id;

            // Authenticate
            const authResponse = await request(app)
                .post('/api/v1/authentications')
                .send({
                    email: 'concurrent-test@integration.com',
                    password: 'password123'
                })
                .expect(200);

            const token = authResponse.body.token;

            // Perform multiple operations concurrently
            const promises = [
                request(app)
                    .get(`/api/v1/users/${userId}`)
                    .set('Authorization', `Bearer ${token}`),
                request(app)
                    .put(`/api/v1/users/${userId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'Concurrent Update 1' }),
                request(app)
                    .put(`/api/v1/users/${userId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'Concurrent Update 2' })
            ];

            const results = await Promise.all(promises);

            // All operations should succeed
            expect(results[0].status).toBe(200);
            expect(results[1].status).toBe(200);
            expect(results[2].status).toBe(200);

            // Clean up
            await User.deleteOne({ email: 'concurrent-test@integration.com' });
        });
    });
});
