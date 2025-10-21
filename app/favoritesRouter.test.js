const request = require('supertest');
const app = require('./app');
const User = require('./models/user');
const Shop = require('./models/shop');
const UserFavorite = require('./models/userFavorite');
const jwt = require('jsonwebtoken');

describe('User Favorites API', () => {
    let testUser;
    let testShop;
    let authToken;

    beforeAll(async () => {
        // Create test user
        testUser = new User({
            name: 'Test',
            surname: 'User',
            email: 'test@example.com',
            password: 'password123',
            userType: 'base_user'
        });
        await testUser.save();

        // Create test shop
        testShop = new Shop({
            name: 'Test Shop',
            address: '123 Test Street',
            category: 'elettronica',
            city: 'Test City',
            provincia: 'Test Province'
        });
        await testShop.save();

        // Generate auth token
        authToken = jwt.sign(
            { id: testUser._id.toString(), email: testUser.email, userType: testUser.userType },
            process.env.SUPER_SECRET,
            { expiresIn: '1h' }
        );
    });

    afterAll(async () => {
        // Clean up test data
        await User.deleteMany({ email: 'test@example.com' });
        await Shop.deleteMany({ name: 'Test Shop' });
        await UserFavorite.deleteMany({});
    });

    describe('POST /api/v1/users/me/favorites', () => {
        it('should add a shop to favorites', async () => {
            const response = await request(app)
                .post('/api/v1/users/me/favorites')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ shop_id: testShop._id.toString() })
                .expect(201);

            expect(response.body.message).toBe('Shop added to favorites');
        });

        it('should return 409 if shop already in favorites', async () => {
            const response = await request(app)
                .post('/api/v1/users/me/favorites')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ shop_id: testShop._id.toString() })
                .expect(409);

            expect(response.body.message).toBe('Shop already in favorites');
        });

        it('should return 400 if shop_id is missing', async () => {
            const response = await request(app)
                .post('/api/v1/users/me/favorites')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(response.body.message).toBe('shop_id is required');
        });

        it('should return 404 if shop does not exist', async () => {
            const fakeShopId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .post('/api/v1/users/me/favorites')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ shop_id: fakeShopId })
                .expect(404);

            expect(response.body.message).toBe('Shop not found');
        });
    });

    describe('GET /api/v1/users/me/favorites', () => {
        it('should get user favorites', async () => {
            const response = await request(app)
                .get('/api/v1/users/me/favorites')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.favorites).toBeDefined();
            expect(Array.isArray(response.body.favorites)).toBe(true);
            expect(response.body.pagination).toBeDefined();
            expect(response.body.favorites.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/v1/users/me/favorites/:shop_id', () => {
        it('should check if shop is favorited', async () => {
            const response = await request(app)
                .get(`/api/v1/users/me/favorites/${testShop._id.toString()}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.is_favorite).toBe(true);
            expect(response.body.favorited_at).toBeDefined();
        });

        it('should return 404 if shop not in favorites', async () => {
            const fakeShopId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .get(`/api/v1/users/me/favorites/${fakeShopId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);

            expect(response.body.message).toBe('Shop not found');
        });
    });

    describe('DELETE /api/v1/users/me/favorites/:shop_id', () => {
        it('should remove shop from favorites', async () => {
            const response = await request(app)
                .delete(`/api/v1/users/me/favorites/${testShop._id.toString()}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.message).toBe('Shop removed from favorites');
        });

        it('should return 404 if favorite not found', async () => {
            const response = await request(app)
                .delete(`/api/v1/users/me/favorites/${testShop._id.toString()}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);

            expect(response.body.message).toBe('Favorite not found');
        });
    });

    describe('Authentication', () => {
        it('should return 401 without token', async () => {
            await request(app)
                .get('/api/v1/users/me/favorites')
                .expect(401);
        });

        it('should return 401 with invalid token', async () => {
            await request(app)
                .get('/api/v1/users/me/favorites')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
    });
});
