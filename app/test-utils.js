const request = require('supertest');
const app = require('./app');
const User = require('./models/user');

/**
 * Test utilities for TNavigate API testing
 */
class TestUtils {
    /**
     * Create a test user and return user data and ID
     * @param {Object} userData - User data to create
     * @returns {Promise<Object>} - { user, userId }
     */
    static async createTestUser(userData = {}) {
        const defaultUserData = {
            userType: 'base_user',
            name: 'Test',
            surname: 'User',
            email: `test-${Date.now()}@example.com`,
            password: 'password123',
            phone: '+39 123 456 7890',
            address: 'Via Test, 1, Trento TN',
            ...userData
        };

        const user = new User(defaultUserData);
        await user.save();
        
        return {
            user,
            userId: user._id.toString()
        };
    }

    /**
     * Register a user via API and return response data
     * @param {Object} userData - User data to register
     * @returns {Promise<Object>} - Registration response
     */
    static async registerUser(userData = {}) {
        const defaultUserData = {
            userType: 'base_user',
            name: 'Test',
            surname: 'User',
            email: `test-${Date.now()}@example.com`,
            password: 'password123',
            phone: '+39 123 456 7890',
            address: 'Via Test, 1, Trento TN',
            ...userData
        };

        const response = await request(app)
            .post('/api/v1/users/register')
            .send(defaultUserData);

        return {
            response,
            userData: defaultUserData,
            userId: response.body.user?.id
        };
    }

    /**
     * Authenticate a user and return token
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<string>} - JWT token
     */
    static async authenticateUser(email, password) {
        const response = await request(app)
            .post('/api/v1/authentications')
            .send({ email, password });

        if (response.status !== 200) {
            throw new Error(`Authentication failed: ${response.body.message}`);
        }

        return response.body.token;
    }

    /**
     * Create a user and authenticate them in one step
     * @param {Object} userData - User data to create
     * @returns {Promise<Object>} - { user, userId, token, email, password }
     */
    static async createAndAuthenticateUser(userData = {}) {
        const { response, userData: createdUserData, userId } = await this.registerUser(userData);
        
        if (response.status !== 201) {
            throw new Error(`User creation failed: ${response.body.message}`);
        }

        const token = await this.authenticateUser(createdUserData.email, createdUserData.password);

        return {
            user: response.body.user,
            userId,
            token,
            email: createdUserData.email,
            password: createdUserData.password,
            userData: createdUserData
        };
    }

    /**
     * Clean up test users by email patterns
     * @param {Array<string>} emailPatterns - Email patterns to clean up
     */
    static async cleanupTestUsers(emailPatterns = []) {
        const defaultPatterns = [
            'test@example.com',
            'test2@example.com',
            'auth-test@example.com',
            'auth-test2@example.com',
            'integration-test@example.com',
            'user1@integration-test.com',
            'user2@integration-test.com',
            'token-test@integration.com',
            'concurrent-test@integration.com'
        ];

        const allPatterns = [...defaultPatterns, ...emailPatterns];
        
        for (const pattern of allPatterns) {
            await User.deleteMany({ email: pattern });
        }
    }

    /**
     * Clean up users by email regex pattern
     * @param {string} emailRegex - Regex pattern for emails to clean up
     */
    static async cleanupUsersByPattern(emailRegex) {
        await User.deleteMany({ email: { $regex: emailRegex } });
    }

    /**
     * Make authenticated request
     * @param {string} method - HTTP method
     * @param {string} url - Request URL
     * @param {string} token - JWT token
     * @param {Object} data - Request data
     * @returns {Promise<Object>} - Response object
     */
    static async authenticatedRequest(method, url, token, data = null) {
        const req = request(app)[method.toLowerCase()](url)
            .set('Authorization', `Bearer ${token}`);

        if (data) {
            req.send(data);
        }

        return req;
    }

    /**
     * Generate random test data
     */
    static generateTestData() {
        const timestamp = Date.now();
        return {
            email: `test-${timestamp}@example.com`,
            name: `Test${timestamp}`,
            surname: `User${timestamp}`,
            phone: `+39 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
            address: `Via Test ${timestamp}, Trento TN`
        };
    }

    /**
     * Wait for a specified amount of time
     * @param {number} ms - Milliseconds to wait
     */
    static async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Validate user response structure
     * @param {Object} userResponse - User response object
     * @param {Object} expectedData - Expected user data
     */
    static validateUserResponse(userResponse, expectedData = {}) {
        expect(userResponse.id).toBeDefined();
        expect(userResponse.userType).toBeDefined();
        expect(userResponse.name).toBeDefined();
        expect(userResponse.surname).toBeDefined();
        expect(userResponse.email).toBeDefined();
        expect(userResponse.phone).toBeDefined();
        expect(userResponse.address).toBeDefined();

        // Check expected values
        Object.keys(expectedData).forEach(key => {
            if (expectedData[key] !== undefined) {
                expect(userResponse[key]).toBe(expectedData[key]);
            }
        });
    }

    /**
     * Validate authentication response structure
     * @param {Object} authResponse - Authentication response object
     * @param {Object} expectedData - Expected authentication data
     */
    static validateAuthResponse(authResponse, expectedData = {}) {
        expect(authResponse.token).toBeDefined();
        expect(authResponse.id).toBeDefined();
        expect(authResponse.email).toBeDefined();
        expect(authResponse.userType).toBeDefined();
        expect(authResponse.name).toBeDefined();
        expect(authResponse.surname).toBeDefined();
        expect(authResponse.phone).toBeDefined();
        expect(authResponse.address).toBeDefined();
        expect(authResponse.self).toBeDefined();

        // Check expected values
        Object.keys(expectedData).forEach(key => {
            if (expectedData[key] !== undefined) {
                expect(authResponse[key]).toBe(expectedData[key]);
            }
        });
    }

    /**
     * Create multiple test users
     * @param {number} count - Number of users to create
     * @param {Object} baseUserData - Base user data to use
     * @returns {Promise<Array>} - Array of user objects
     */
    static async createMultipleUsers(count, baseUserData = {}) {
        const users = [];
        
        for (let i = 0; i < count; i++) {
            const userData = {
                ...baseUserData,
                email: `test-${Date.now()}-${i}@example.com`,
                name: `Test${i}`,
                surname: `User${i}`
            };
            
            const { user, userId } = await this.createTestUser(userData);
            users.push({ user, userId, userData });
        }
        
        return users;
    }

    /**
     * Test database connection
     * @returns {Promise<boolean>} - Connection status
     */
    static async testDatabaseConnection() {
        try {
            await User.findOne().limit(1);
            return true;
        } catch (error) {
            console.error('Database connection test failed:', error);
            return false;
        }
    }
}

module.exports = TestUtils;
