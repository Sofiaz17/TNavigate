#!/usr/bin/env node

/**
 * API Testing Script for TNavigate
 * This script provides various testing utilities for the API
 */

const request = require('supertest');
const app = require('../app/app');
const TestUtils = require('../app/test-utils');

class APITester {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api/v1';
        this.testResults = [];
    }

    /**
     * Run a single API test
     */
    async runTest(testName, testFunction) {
        console.log(`\n Running test: ${testName}`);
        try {
            await testFunction();
            console.log(` ${testName} - PASSED`);
            this.testResults.push({ name: testName, status: 'PASSED' });
        } catch (error) {
            console.log(` ${testName} - FAILED: ${error.message}`);
            this.testResults.push({ name: testName, status: 'FAILED', error: error.message });
        }
    }

    /**
     * Test user registration
     */
    async testUserRegistration() {
        const userData = {
            userType: 'base_user',
            name: 'API',
            surname: 'Test',
            email: `api-test-${Date.now()}@example.com`,
            password: 'password123',
            phone: '+39 123 456 7890',
            address: 'Via API Test, 1, Trento TN'
        };

        const response = await request(app)
            .post('/api/v1/users/register')
            .send(userData);

        if (response.status !== 201) {
            throw new Error(`Expected status 201, got ${response.status}: ${response.body.message}`);
        }

        if (!response.body.user || !response.body.user.id) {
            throw new Error('User ID not returned in response');
        }

        return response.body.user.id;
    }

    /**
     * Test user authentication
     */
    async testUserAuthentication(email, password) {
        const response = await request(app)
            .post('/api/v1/authentications')
            .send({ email, password });

        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}: ${response.body.message}`);
        }

        if (!response.body.token) {
            throw new Error('Token not returned in response');
        }

        return response.body.token;
    }

    /**
     * Test getting user profile
     */
    async testGetUserProfile(userId, token) {
        const response = await request(app)
            .get(`/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}: ${response.body.message}`);
        }

        if (!response.body.id || response.body.id !== userId) {
            throw new Error('User ID mismatch in response');
        }

        return response.body;
    }

    /**
     * Test updating user profile
     */
    async testUpdateUserProfile(userId, token) {
        const updateData = {
            name: 'API Updated',
            surname: 'Test Updated',
            phone: '+39 999 888 7777',
            address: 'Via Updated API, 123, Trento TN'
        };

        const response = await request(app)
            .put(`/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);

        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}: ${response.body.message}`);
        }

        if (response.body.user.name !== 'API Updated') {
            throw new Error('Profile update not reflected in response');
        }

        return response.body;
    }

    /**
     * Test password change
     */
    async testPasswordChange(userId, token, currentPassword, newPassword) {
        const updateData = {
            currentPassword,
            newPassword
        };

        const response = await request(app)
            .put(`/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);

        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}: ${response.body.message}`);
        }

        // Test authentication with new password
        const authResponse = await request(app)
            .post('/api/v1/authentications')
            .send({ email: 'api-test@example.com', password: newPassword });

        if (authResponse.status !== 200) {
            throw new Error('Authentication with new password failed');
        }

        return authResponse.body.token;
    }

    /**
     * Test user deletion
     */
    async testUserDeletion(userId, token) {
        const response = await request(app)
            .delete(`/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}: ${response.body.message}`);
        }

        // Verify user is deleted
        const authResponse = await request(app)
            .post('/api/v1/authentications')
            .send({ email: 'api-test@example.com', password: 'newpassword123' });

        if (authResponse.status !== 401) {
            throw new Error('User should be deleted and authentication should fail');
        }
    }

    /**
     * Test error handling
     */
    async testErrorHandling() {
        // Test invalid registration
        const invalidUserData = {
            userType: 'invalid_type',
            name: 'Test',
            email: 'invalid-email',
            password: '123' // Too short
        };

        const response = await request(app)
            .post('/api/v1/users/register')
            .send(invalidUserData);

        if (response.status !== 400) {
            throw new Error(`Expected status 400 for invalid data, got ${response.status}`);
        }

        // Test invalid authentication
        const authResponse = await request(app)
            .post('/api/v1/authentications')
            .send({ email: 'nonexistent@example.com', password: 'wrongpassword' });

        if (authResponse.status !== 401) {
            throw new Error(`Expected status 401 for invalid credentials, got ${authResponse.status}`);
        }
    }

    /**
     * Run all API tests
     */
    async runAllTests() {
        console.log('🚀 Starting TNavigate API Tests\n');

        // Test error handling first
        await this.runTest('Error Handling', () => this.testErrorHandling());

        // Test user registration
        let userId;
        await this.runTest('User Registration', async () => {
            userId = await this.testUserRegistration();
        });

        // Test user authentication
        let token;
        await this.runTest('User Authentication', async () => {
            token = await this.testUserAuthentication('api-test@example.com', 'password123');
        });

        // Test getting user profile
        await this.runTest('Get User Profile', async () => {
            await this.testGetUserProfile(userId, token);
        });

        // Test updating user profile
        await this.runTest('Update User Profile', async () => {
            await this.testUpdateUserProfile(userId, token);
        });

        // Test password change
        let newToken;
        await this.runTest('Change Password', async () => {
            newToken = await this.testPasswordChange(userId, token, 'password123', 'newpassword123');
        });

        // Test user deletion
        await this.runTest('Delete User Account', async () => {
            await this.testUserDeletion(userId, newToken);
        });

        // Print results
        this.printResults();
    }

    /**
     * Print test results
     */
    printResults() {
        console.log('\n Test Results Summary:');
        console.log('========================');
        
        const passed = this.testResults.filter(r => r.status === 'PASSED').length;
        const failed = this.testResults.filter(r => r.status === 'FAILED').length;
        
        console.log(` Passed: ${passed}`);
        console.log(` Failed: ${failed}`);
        console.log(` Success Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);
        
        if (failed > 0) {
            console.log('\n Failed Tests:');
            this.testResults
                .filter(r => r.status === 'FAILED')
                .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
        }
        
        console.log('\nAPI testing completed!');
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    const tester = new APITester();
    tester.runAllTests().catch(console.error);
}

module.exports = APITester;
