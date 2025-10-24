const request = require('supertest');
const app = require('./app');
const Shop = require('./models/shop');

describe('Categories Router', () => {

    const mockCategories = ['supermercato', 'farmacia', 'abbigliamento'];

    beforeAll(() => {
        // Mock the schema enum values before all tests
        jest.spyOn(Shop.schema.path('category'), 'enumValues', 'get').mockReturnValue(mockCategories);
    });

    afterAll(() => {
        // Restore the original implementation after all tests
        jest.restoreAllMocks();
    });

    describe('GET /api/v1/shopCategories', () => {
        test('should return a list of all shop categories', async () => {
            const response = await request(app)
                .get('/api/v1/shopCategories')
                .expect(200);

            expect(response.body).toEqual(mockCategories.map(c => ({
                self: `/api/v1/shopCategories/${c}`,
                name: c
            })));
        });
    });

    describe('GET /api/v1/shopCategories/:category', () => {
        test('should return a single category if it exists', async () => {
            const categoryToTest = 'supermercato';
            const response = await request(app)
                .get(`/api/v1/shopCategories/${categoryToTest}`)
                .expect(200);

            expect(response.body).toEqual({
                self: `/api/v1/shopCategories/${categoryToTest}`,
                name: categoryToTest
            });
        });

        test('should return 404 if the category does not exist', async () => {
            const response = await request(app)
                .get('/api/v1/shopCategories/nonexistentcategory')
                .expect(404);
                
            expect(response.body.error).toBe('Not found');
        });

        test('should be case-sensitive and return 404 for different case', async () => {
            await request(app)
                .get('/api/v1/shopCategories/Supermercato') // Uppercase 'S'
                .expect(404);
        });
    });
});
