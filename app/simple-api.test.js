/**
 * Simple API tests that don't require database connection
 * These tests verify the API structure and basic functionality
 */

// Use simple test setup without database connection
require('./simple-test-setup');

const request = require('supertest');
const app = require('./app');

describe('TNavigate API - Basic Structure Tests', () => {
    
    test('should have CORS enabled', async () => {
        const response = await request(app)
            .options('/api/v1/users/register')
            .expect(204);
        
        expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should return 404 for non-existent routes', async () => {
        const response = await request(app)
            .get('/api/v1/nonexistent')
            .expect(404);
        
        expect(response.body.error).toBe('Not found');
    });

    test('should handle malformed JSON in requests', async () => {
        const response = await request(app)
            .post('/api/v1/users/register')
            .set('Content-Type', 'application/json')
            .send('invalid json')
            .expect(500); // Express returns 500 for malformed JSON
    });

    test('should reject registration with missing required fields', async () => {
        const response = await request(app)
            .post('/api/v1/users/register')
            .send({})
            .expect(400);
        
        expect(response.body.message).toBe('Validation error');
    });

    test('should reject registration with invalid userType', async () => {
        const userData = {
            userType: 'invalid_type',
            name: 'Test',
            surname: 'User',
            email: 'test@example.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/v1/users/register')
            .send(userData)
            .expect(400);
        
        expect(response.body.message).toBe('Invalid user type');
    });

    test('should reject registration with weak password', async () => {
        const userData = {
            userType: 'base_user',
            name: 'Test',
            surname: 'User',
            email: 'test@example.com',
            password: '123' // Too short
        };

        const response = await request(app)
            .post('/api/v1/users/register')
            .send(userData)
            .expect(400);
        
        expect(response.body.message).toBe('Validation error');
    });

    test('should reject authentication with missing credentials', async () => {
        const response = await request(app)
            .post('/api/v1/authentications')
            .send({})
            .expect(400);
        
        expect(response.body.message).toBe('Email and password are required');
    });

    test('should reject authentication with missing email', async () => {
        const response = await request(app)
            .post('/api/v1/authentications')
            .send({ password: 'password123' })
            .expect(400);
        
        expect(response.body.message).toBe('Email and password are required');
    });

    test('should reject authentication with missing password', async () => {
        const response = await request(app)
            .post('/api/v1/authentications')
            .send({ email: 'test@example.com' })
            .expect(400);
        
        expect(response.body.message).toBe('Email and password are required');
    });

    test('should reject profile access without token', async () => {
        const response = await request(app)
            .get('/api/v1/users/507f1f77bcf86cd799439011')
            .expect(401);
        
        expect(response.body.message).toBe('No token provided.');
    });

    test('should reject profile access with invalid token', async () => {
        const response = await request(app)
            .get('/api/v1/users/507f1f77bcf86cd799439011')
            .set('Authorization', 'Bearer invalid-token')
            .expect(403);
        
        expect(response.body.message).toBe('Failed to authenticate token.');
    });

    test('should reject profile update without token', async () => {
        const response = await request(app)
            .put('/api/v1/users/507f1f77bcf86cd799439011')
            .send({ name: 'Updated' })
            .expect(401);
        
        expect(response.body.message).toBe('No token provided.');
    });

    test('should reject profile deletion without token', async () => {
        const response = await request(app)
            .delete('/api/v1/users/507f1f77bcf86cd799439011')
            .expect(401);
        
        expect(response.body.message).toBe('No token provided.');
    });

    test('should serve API documentation', async () => {
        const response = await request(app)
            .get('/api-docs/')
            .expect(200);
        
        expect(response.text).toContain('swagger');
    });

    test('should serve Swagger JSON', async () => {
        const response = await request(app)
            .get('/swagger.json')
            .expect(200);
        
        expect(response.body.info.title).toBe('TNavigate API');
        expect(response.body.info.version).toBe('1.0.0');
    });

    test('should have proper API routes configured', async () => {
        // Test that routes are properly configured by checking if they return proper error responses
        // instead of 404s for the route structure
        
        // Test POST routes (should not be 404)
        const postRoutes = [
            { method: 'post', path: '/api/v1/users/register' },
            { method: 'post', path: '/api/v1/authentications' }
        ];

        for (const route of postRoutes) {
            const response = await request(app)[route.method](route.path);
            // Should not return 404 (route exists) but might return other errors
            expect(response.status).not.toBe(404);
        }

        // Test GET routes (some might be 404 if they require specific parameters)
        const getRoutes = [
            '/api/v1/users/507f1f77bcf86cd799439011'
        ];

        for (const route of getRoutes) {
            const response = await request(app).get(route);
            // Should not return 404 (route exists) but might return other errors
            expect(response.status).not.toBe(404);
        }
    });
});
