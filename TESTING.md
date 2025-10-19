# TNavigate API Testing & Development Guide

This guide covers testing and development setup for the TNavigate backend API.

##  Testing Overview

The TNavigate API includes comprehensive testing with multiple test suites:

- **Unit Tests**: Individual component testing
- **Integration Tests**: End-to-end API flow testing  
- **Authentication Tests**: JWT and security testing
- **API Tests**: Manual API endpoint testing

##  Test Structure

```
app/
├── usersRouter.test.js      # User management tests
├── authentication.test.js   # Authentication system tests
├── integration.test.js      # Complete user flow tests
├── test-utils.js           # Test utilities and helpers
└── test-setup.js           # Global test configuration
```

##  Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### API Testing Script
```bash
npm run test:api
```

##  Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Environment Setup
1. Copy `.env.example` to `.env` (or create one):
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
```env
DB_URL=mongodb://localhost:27017/tnavigate
SUPER_SECRET=your_super_secret_jwt_key_here
PORT=3000
NODE_ENV=development
FRONTEND=http://localhost:5173
```

### Start Development Server
```bash
npm run dev
```

This starts the server with:
- Hot reloading on file changes
- Automatic .env file creation
- Development information display
- Graceful shutdown handling

### Simple Development Server
```bash
npm run dev:simple
```

##  API Documentation

### Swagger UI
Visit: http://localhost:3000/api-docs

### Swagger JSON
Visit: http://localhost:3000/swagger.json

##  API Endpoints

### Authentication
- `POST /api/v1/authentications` - User login

### User Management
- `POST /api/v1/users/register` - Register new user
- `GET /api/v1/users/{id}` - Get user profile
- `PUT /api/v1/users/{id}` - Update user profile
- `DELETE /api/v1/users/{id}` - Delete user account

##  Test Examples

### Using Test Utils
```javascript
const TestUtils = require('./test-utils');

// Create and authenticate a user
const { userId, token } = await TestUtils.createAndAuthenticateUser({
    userType: 'base_user',
    name: 'Test',
    surname: 'User',
    email: 'test@example.com',
    password: 'password123'
});

// Make authenticated request
const response = await TestUtils.authenticatedRequest(
    'GET', 
    `/api/v1/users/${userId}`, 
    token
);
```

### Manual API Testing
```bash
# Register a user
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "base_user",
    "name": "John",
    "surname": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Authenticate
curl -X POST http://localhost:3000/api/v1/authentications \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get profile (replace {token} with actual token)
curl -X GET http://localhost:3000/api/v1/users/{userId} \
  -H "Authorization: Bearer {token}"
```

##  Test Coverage

The test suite covers:

### User Registration
- Valid user registration
- Duplicate email handling
- Invalid user type validation
- Password strength validation
- Required field validation

### Authentication
- Valid credentials authentication
- Invalid credentials handling
- JWT token generation and validation
- Token expiration handling
- Case-insensitive email authentication

### Profile Management
- Get user profile with authentication
- Update user profile
- Password change with current password verification
- Access control (users can only access their own data)
- Account deletion

### Security
- JWT token validation
- Bearer token authentication
- User isolation (users cannot access other users' data)
- Password hashing verification

### Error Handling
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- Malformed request handling

## Debugging

### Test Debugging
```bash
# Run specific test file
npm test -- usersRouter.test.js

# Run tests with verbose output
npm test -- --verbose

# Run tests matching pattern
npm test -- --testNamePattern="authentication"
```

### Server Debugging
```bash
# Start with debug logging
DEBUG=* npm run dev

# Check server logs
tail -f logs/app.log  # if logging is configured
```

## 📊 Test Results

After running tests, you'll see:
-  Passed tests
-  Failed tests with error details
-  Coverage percentage
-  Test execution time

##  Configuration

### Jest Configuration
Located in `jest.config.js`:
- Coverage collection enabled
- Test environment setup
- Global test utilities
- Timeout configuration

### Test Environment
- Uses MongoDB test database
- Automatic cleanup between tests
- Isolated test data
- Mock external dependencies

##  Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MongoDB is running
   - Check DB_URL in .env file
   - Verify database permissions

2. **Test Failures**
   - Check test database connection
   - Verify test data cleanup
   - Check for port conflicts

3. **Authentication Errors**
   - Verify JWT secret in .env
   - Check token expiration
   - Validate request headers

### Getting Help
- Check test output for specific error messages
- Review API documentation at `/api-docs`
- Use the API testing script for manual verification
- Check server logs for detailed error information

##  Performance Testing

For performance testing, consider:
- Load testing with tools like Artillery or k6
- Database query optimization
- JWT token performance
- Concurrent user handling

##  Security Testing

The test suite includes:
- Authentication bypass attempts
- Authorization boundary testing
- Input validation testing
- SQL injection prevention
- XSS prevention testing


