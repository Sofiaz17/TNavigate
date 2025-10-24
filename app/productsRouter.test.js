/**
 * https://www.npmjs.com/package/supertest
 */
// Add this at the top of your test file or a setup file
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const request = require('supertest');
const app = require('./app');
const Product = require('./models/product');
const mongoose = require('mongoose');

describe('Products API', () => {

    let productSpyFind;
    let productSpyFindById;

    const mockProduct = {
        id: '1010',
        name: 'My Product',
        category: 'My Category',
    };

    beforeAll(() => {
        productSpyFind = jest.spyOn(Product, 'find').mockImplementation((criterias) => {
            if (criterias.name === 'My Product' || criterias.category === 'My Category' || Object.keys(criterias).length === 0) {
                return { exec: jest.fn().mockResolvedValue([mockProduct]) };
            } else {
                return { exec: jest.fn().mockResolvedValue([]) };
            }
        });

        productSpyFindById = jest.spyOn(Product, 'findById').mockImplementation((id) => {
            if (id === '1010') {
                return Promise.resolve(mockProduct);
            } else {
                return Promise.resolve(null);
            }
        });
    });

    afterAll(() => {
        productSpyFind.mockRestore();
        productSpyFindById.mockRestore();
    });

    describe('GET /api/v1/products', () => {
        test('should respond with an array of products', async () => {
            const response = await request(app).get('/api/v1/products').expect(200);
            expect(response.body[0]).toMatchObject({ name: 'My Product' });
        });

        test('should return all products with a specific name', async () => {
            const response = await request(app).get('/api/v1/products?name=My%20Product').expect(200);
            expect(response.body[0].name).toBe('My Product');
        });

        test('should return all products in a specific category', async () => {
            const response = await request(app).get('/api/v1/products?category=My%20Category').expect(200);
            expect(response.body[0].category).toBe('My Category');
        });

        test('should return 404 if no product is found by name', async () => {
            await request(app).get('/api/v1/products?name=Wrong%20Name').expect(404);
        });

        test('should return 400 if name parameter is empty', async () => {
            await request(app).get('/api/v1/products?name=').expect(400);
        });
    });

    describe('GET /api/v1/products/:id', () => {
        test('should respond with a single product', async () => {
            const response = await request(app).get('/api/v1/products/1010').expect(200);
            expect(response.body).toHaveProperty('name', encodeURI(mockProduct.name));
        });

        test('should respond with 404 for a non-existent product', async () => {
            await request(app).get('/api/v1/products/nonexistentid').expect(404);
        });
    });

    describe('POST /api/v1/products', () => {
        let productSaveSpy;

        beforeAll(() => {
            productSaveSpy = jest.spyOn(Product.prototype, 'save').mockImplementation(function() {
                this.id = 'new-product-id';
                return Promise.resolve(this);
            });
        });

        afterAll(() => {
            productSaveSpy.mockRestore();
        });

        test('should create a new product', async () => {
            const newProduct = {
                name: 'New Product',
                category: 'New Category',
                keywords: ['new', 'product']
            };

            const response = await request(app)
                .post('/api/v1/products')
                .send(newProduct)
                .expect(201);

            expect(response.header.location).toBe('/api/v1/products/new-product-id');
        });
    });

    describe('DELETE /api/v1/products/:id', () => {
        let productDeleteSpy;

        beforeAll(() => {
            productDeleteSpy = jest.spyOn(Product.prototype, 'deleteOne').mockResolvedValue({});
        });

        afterAll(() => {
            productDeleteSpy.mockRestore();
        });

        test('should delete a product', async () => {
            const findByIdSpy = jest.spyOn(Product, 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    deleteOne: jest.fn().mockResolvedValue({})
                })
            });
            await request(app).delete('/api/v1/products/1010').expect(204);
            findByIdSpy.mockRestore();
        });

        test('should return 404 when trying to delete a non-existent product', async () => {
            const findByIdSpy = jest.spyOn(Product, 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            });
            await request(app).delete('/api/v1/products/nonexistentid').expect(404);
            findByIdSpy.mockRestore();
        });
    });
});