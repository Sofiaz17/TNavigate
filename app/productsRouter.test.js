/**
 * https://www.npmjs.com/package/supertest
 */
const request  = require('supertest');
const app      = require('./app');
const mongoose = require('mongoose')

function capitalizeFirstLetter(string) {
    if(string == undefined){
        return undefined;
    }
    let lowerstring = string.toLowerCase();
    let words = lowerstring.split(' ');

    words.forEach(function(word, index, array){
        array[index] = word.charAt(0).toUpperCase() + word.slice(1); 
    })
    return words.join(' ');
}

describe('GET /api/v1/products', () => {

  // Moking Shop.find method
  let productSpy;
  // Moking Shop.findById method
  let productSpyFindById;

  beforeAll( () => {
    const Product = require('./models/product');
    productSpy = jest.spyOn(Product, 'find').mockImplementation((criterias) => {
        console.log('product criterias: '+ criterias);
     if(capitalizeFirstLetter(criterias.name) == 'My Product' || Object.keys(criterias).length === 0 ){
        return {
            exec: jest.fn().mockResolvedValue([{
                id: '1010',
                name: 'My Product',
                category: 'My Category'
            }])
          }} else {
            return {
                exec: jest.fn().mockResolvedValue([]) 
              };
          }}
    );

    productSpyFindById = jest.spyOn(Product, 'findById').mockImplementation((id) => {
      if (id==1010)
        return {
          id: 1010,
          name: 'My Product',
          category: 'My Category'
        };
      else
        return {};
    });
  });

  afterAll(async () => {
    productSpy.mockRestore();
    productSpyFindById.mockRestore();
  });
  
  test('GET /api/v1/products should respond with an array of products', async () => {
    return request(app)
      .get('/api/v1/products')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( (res) => {
        if(res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: '/api/v1/products/1010',
            name: 'My Product',
            category: 'My Category'
           });
         }
       });
  });

  test('GET /api/v1/products?name=Name should return all products with a specific name', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/products?name=My%20Product').expect(200);
    const product = response.body;
    expect(product).toBeDefined();
    expect(product[0].name).toBe('My Product');
  });

  test('GET /api/v1/products?name=WrongName should return 404 because product is not found', async () => {
    expect.assertions(1);
    const response = await request(app).get('/api/v1/products?name=Not%20My%20Product').expect(404);
    expect(response.text).toBe("{\"error\":\"Not found\"}");
  });

  test('GET /api/v1/products?name=mixedCaseName should return all products with a specific name', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/products?name=my%20PRODuct').expect(200);
    const product = response.body;
    expect(product).toBeDefined();
    expect(product[0].name).toBe('My Product');
  });

  
  test('GET /api/v1/products/:id should respond with json', async () => {
    return request(app)
      .get('/api/v1/products/1010')
      .expect('Content-Type', /json/)
      .expect(200, {
          self: '/api/v1/products/1010',
          name: 'My%20Product',
          category: 'My Category'
        });
  });

});