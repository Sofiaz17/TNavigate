const request = require('supertest');
const app = require('./app/app');

async function debugAuth() {
    console.log(' Debugging Authentication Flow...\n');
    
    // Test 1: Register a user
    console.log('1. Testing user registration...');
    const userData = {
        userType: 'base_user',
        name: 'Debug',
        surname: 'User',
        email: 'debug@example.com',
        password: 'password123'
    };
    
    const registerResponse = await request(app)
        .post('/api/v1/users/register')
        .send(userData);
    
    console.log('Register Status:', registerResponse.status);
    console.log('Register Body:', registerResponse.body);
    
    if (registerResponse.status !== 201) {
        console.log(' Registration failed');
        return;
    }
    
    const userId = registerResponse.body.user.id;
    console.log(' User registered with ID:', userId);
    
    // Test 2: Authenticate user
    console.log('\n2. Testing authentication...');
    const authResponse = await request(app)
        .post('/api/v1/authentications')
        .send({
            email: 'debug@example.com',
            password: 'password123'
        });
    
    console.log('Auth Status:', authResponse.status);
    console.log('Auth Body:', authResponse.body);
    
    if (authResponse.status !== 200) {
        console.log(' Authentication failed');
        return;
    }
    
    const token = authResponse.body.token;
    console.log(' Token received:', token.substring(0, 20) + '...');
    console.log(' User ID from token:', authResponse.body.id);
    
    // Test 3: Get user profile
    console.log('\n3. Testing profile access...');
    const profileResponse = await request(app)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
    
    console.log('Profile Status:', profileResponse.status);
    console.log('Profile Body:', profileResponse.body);
    
    // Test 4: Update user profile
    console.log('\n4. Testing profile update...');
    const updateResponse = await request(app)
        .put(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Updated',
            surname: 'Name'
        });
    
    console.log('Update Status:', updateResponse.status);
    console.log('Update Body:', updateResponse.body);
    
    // Test 5: Delete user account
    console.log('\n5. Testing account deletion...');
    const deleteResponse = await request(app)
        .delete(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
    
    console.log('Delete Status:', deleteResponse.status);
    console.log('Delete Body:', deleteResponse.body);
    
    console.log('\n Debug complete!');
}

debugAuth().catch(console.error);
