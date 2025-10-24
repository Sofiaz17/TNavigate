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

        it('should return 400 for an invalid shop_id format', async () => {
            await request(app)
                .post('/api/v1/users/me/favorites')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ shop_id: 'invalid-id' })
                .expect(400);
        });
    });

    describe('GET /api/v1/users/me/favorites', () => {
        beforeAll(async () => {
            // Ensure there's a favorite to fetch
            await new UserFavorite({ user_id: testUser._id, shop_id: testShop._id }).save();
        });

        it('should get user favorites', async () => {
            const response = await request(app)
                .get('/api/v1/users/me/favorites')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.favorites).toBeDefined();
            expect(Array.isArray(response.body.favorites)).toBe(true);
            expect(response.body.pagination).toBeDefined();
            expect(response.body.favorites.length).toBeGreaterThan(0);
            expect(response.body.favorites[0].name).toBe('Test Shop');
        });

        it('should handle pagination correctly', async () => {
            // Add more shops and favorites for pagination test
            const shop2 = await new Shop({ name: 'Test Shop 2', category: 'elettronica' }).save();
            await new UserFavorite({ user_id: testUser._id, shop_id: shop2._id }).save();

            const response = await request(app)
                .get('/api/v1/users/me/favorites?page=2&limit=1')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.favorites.length).toBe(1);
            expect(response.body.pagination.page).toBe(2);
            expect(response.body.pagination.limit).toBe(1);
            expect(response.body.pagination.total).toBe(2);

            await Shop.findByIdAndDelete(shop2._id);
        });
    });

    describe('GET /api/v1/users/me/favorites/:shop_id', () => {
        beforeAll(async () => {
            // Ensure the favorite exists for checking
            await UserFavorite.findOneAndUpdate(
                { user_id: testUser._id, shop_id: testShop._id },
                { user_id: testUser._id, shop_id: testShop._id },
                { upsert: true }
            );
        });

        it('should check if shop is favorited', async () => {
            const response = await request(app)
                .get(`/api/v1/users/me/favorites/${testShop._id.toString()}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.is_favorite).toBe(true);
            expect(response.body.favorited_at).toBeDefined();
        });

        it('should return 404 if shop not in favorites', async () => {
            const otherShop = await new Shop({ name: 'Other Shop', category: 'elettronica' }).save();
            const response = await request(app)
                .get(`/api/v1/users/me/favorites/${otherShop._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
            
            expect(response.body.message).toBe('Shop not in favorites');
            await Shop.findByIdAndDelete(otherShop._id);
        });

        it('should return 404 if shop does not exist', async () => {
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

        it('should return 400 for an invalid shop_id format', async () => {
            await request(app)
                .delete('/api/v1/users/me/favorites/invalid-id')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(400);
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
