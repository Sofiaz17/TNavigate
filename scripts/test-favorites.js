const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api/v1';
let authToken = '';

// Test data
const testUser = {
    email: 'test@example.com',
    password: 'password123'
};

const testShop = {
    name: 'Test Shop for Favorites',
    address: '123 Test Street',
    category: 'elettronica',
    city: 'Test City',
    provincia: 'Test Province'
};

async function authenticate() {
    try {
        console.log(' Authenticating...');
        const response = await axios.post(`${BASE_URL}/authentications`, testUser);
        authToken = response.data.token;
        console.log(' Authentication successful');
        return true;
    } catch (error) {
        console.error('Authentication failed:', error.response?.data || error.message);
        return false;
    }
}

async function createTestShop() {
    try {
        console.log(' Creating test shop...');
        const response = await axios.post(`${BASE_URL}/shops`, testShop, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('Test shop created:', response.data.id);
        return response.data.id;
    } catch (error) {
        console.error('Failed to create test shop:', error.response?.data || error.message);
        return null;
    }
}

async function testGetFavorites() {
    try {
        console.log('Getting user favorites...');
        const response = await axios.get(`${BASE_URL}/users/me/favorites`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('Favorites retrieved:', response.data);
        return response.data;
    } catch (error) {
        console.error(' Failed to get favorites:', error.response?.data || error.message);
        return null;
    }
}

async function testAddFavorite(shopId) {
    try {
        console.log(' Adding shop to favorites...');
        const response = await axios.post(`${BASE_URL}/users/me/favorites`, 
            { shop_id: shopId },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
        console.log('Shop added to favorites:', response.data);
        return true;
    } catch (error) {
        console.error('Failed to add favorite:', error.response?.data || error.message);
        return false;
    }
}

async function testCheckFavorite(shopId) {
    try {
        console.log('Checking if shop is favorited...');
        const response = await axios.get(`${BASE_URL}/users/me/favorites/${shopId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('Favorite status:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to check favorite:', error.response?.data || error.message);
        return null;
    }
}

async function testRemoveFavorite(shopId) {
    try {
        console.log('Removing shop from favorites...');
        const response = await axios.delete(`${BASE_URL}/users/me/favorites/${shopId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('Shop removed from favorites:', response.data);
        return true;
    } catch (error) {
        console.error('Failed to remove favorite:', error.response?.data || error.message);
        return false;
    }
}

async function runTests() {
    console.log('Starting Favorites API Tests...\n');

    // Step 1: Authenticate
    const authSuccess = await authenticate();
    if (!authSuccess) {
        console.log('Cannot proceed without authentication');
        return;
    }

    // Step 2: Create test shop
    const shopId = await createTestShop();
    if (!shopId) {
        console.log('Cannot proceed without test shop');
        return;
    }

    // Step 3: Get initial favorites
    await testGetFavorites();

    // Step 4: Add shop to favorites
    const addSuccess = await testAddFavorite(shopId);
    if (!addSuccess) {
        console.log('Cannot proceed without adding favorite');
        return;
    }

    // Step 5: Check if shop is favorited
    await testCheckFavorite(shopId);

    // Step 6: Get favorites again
    await testGetFavorites();

    // Step 7: Remove shop from favorites
    await testRemoveFavorite(shopId);

    // Step 8: Check favorites after removal
    await testGetFavorites();

    console.log('\n All tests completed!');
}

// Run tests if this script is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    authenticate,
    createTestShop,
    testGetFavorites,
    testAddFavorite,
    testCheckFavorite,
    testRemoveFavorite,
    runTests
};
