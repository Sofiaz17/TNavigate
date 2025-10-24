// /**
//  * https://www.npmjs.com/package/supertest
//  */
// Add this at the top of your test file or a setup file
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const request  = require('supertest');
const app      = require('./app');
const mongoose = require('mongoose')
const jwt      = require('jsonwebtoken');

process.env.SUPER_SECRET = 'test-secret';

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

describe('GET /api/v1/shops', () => {

  // Moking Shop.find method
  let shopSpy;
  // Moking Shop.findById method
  let shopSpyFindById;

  beforeAll( () => {
    const Shop = require('./models/shop');
    shopSpy = jest.spyOn(Shop, 'find').mockImplementation((criterias) => {
      console.log('shop criterias: '+ criterias.name);
     if(capitalizeFirstLetter(criterias.name) == 'My Shop' || capitalizeFirstLetter(criterias.category) == 'My Category' || Object.keys(criterias).length === 0 ){
        return {
            exec: jest.fn().mockResolvedValue([{
                id: '1010',
                name: 'My Shop',
                category: 'My Category',
                address: 'My Address',
                coordinates: 'My Coordinates',
                opening_hours:[
                    {
                      day: 'LUN',
                      state: 'open',
                      periods:[{
                          startHours: 11,
                          startMinutes: 0,
                            endHours: 23,
                            endMinutes: 30
                        }],
                    }],
                    state: 'My State'
            }])
          }} else {
            return {
                exec: jest.fn().mockResolvedValue([]) // Return an empty array if no shop is found
              };
          }}
    );

    shopSpyFindById = jest.spyOn(Shop, 'findById').mockImplementation((id) => {
      if (id==1010)
        return {
          id: 1010,
          name: 'My Shop',
          category: 'My Category',
          address: 'My Address',
          coordinates: 'My Coordinates',
          opening_hours:[
              {
                day: 'LUN',
                state: 'open',
                periods:[{
                    startHours: 11,
                    startMinutes: 0,
                      endHours: 23,
                      endMinutes: 30
                  }],
              }],
              state: 'My State'
        };
      else
        return {};
    });
  });

  afterAll(async () => {
    shopSpy.mockRestore();
    shopSpyFindById.mockRestore();
  });
  
  test('GET /api/v1/shops should respond with an array of shops', async () => {
    return request(app)
      .get('/api/v1/shops')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( (res) => {
        if(res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: '/api/v1/shops/1010',
            name: 'My Shop',
            category: 'My Category',
            address: 'My Address',
            coordinates: 'My Coordinates',
            opening_hours:[
                {
                  day: 'LUN',
                  state: 'open',
                  periods:[{
                      startHours: 11,
                      startMinutes: 0,
                        endHours: 23,
                        endMinutes: 30
                    }],
                }],
                state: 'My State'
           });
         }
       });
  });

  test('GET /api/v1/shops?name=Name should return all shops with a specific name', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/shops?name=My%20Shop').expect(200);
    const shop = response.body;
    expect(shop).toBeDefined();
    expect(shop[0].name).toBe('My Shop');
  });

  test('GET /api/v1/shops?name=WrongName should return 404 because shop is not found', async () => {
    expect.assertions(1);
    const response = await request(app).get('/api/v1/shops?name=Not%20My%20Shop').expect(404);
    expect(response.text).toBe("{\"error\":\"Not found\"}");
  });

  
  test('GET /api/v1/shops?category=Category should return all shops belonging to a certain category', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/shops?category=My%20Category').expect(200);
    const shop = response.body;
    expect(shop).toBeDefined();
    expect(shop[0].category).toBe('My Category');
  });

  test('GET /api/v1/shops?category=WrongCategory should return 404 because category is not found', async () => {
    expect.assertions(1);
    const response = await request(app).get('/api/v1/shops?category=Not%20My%20Category').expect(404);
    expect(response.text).toBe("{\"error\":\"Not found\"}");
  });

  test('GET /api/v1/shops?owner=owner@test.com should return all shops for a specific owner', async () => {
    const Shop = require('./models/shop');
    const ownerShopSpy = jest.spyOn(Shop, 'find').mockImplementation((criterias) => {
        if (criterias.owner === 'owner@test.com') {
            return {
                exec: jest.fn().mockResolvedValue([{
                    id: '1010',
                    name: 'My Shop',
                    category: 'My Category',
                    owner: 'owner@test.com'
                }])
            };
        }
        return { exec: jest.fn().mockResolvedValue([]) };
    });

    const response = await request(app).get('/api/v1/shops?owner=owner@test.com').expect(200);
    const shop = response.body;
    expect(shop).toBeDefined();
    expect(shop[0].owner).toBe('owner@test.com');
    ownerShopSpy.mockRestore();
  });
  
  test('GET /api/v1/shops?name=mixedCaseName should return all shops with a specific name', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/shops?name=my%20SHOp').expect(200);
    const shop = response.body;
    expect(shop).toBeDefined();
    expect(shop[0].name).toBe('My Shop');
  });

  test('GET /api/v1/shops?category=mixedCaseCategory should return all shops belonging to a certain category', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/shops?category=my%20caTEgOry').expect(200);
    const shop = response.body;
    expect(shop).toBeDefined();
    expect(shop[0].category).toBe('My Category');
  });
  
  test('GET /api/v1/shops/:id should respond with json', async () => {
    return request(app)
      .get('/api/v1/shops/1010')
      .expect('Content-Type', /json/)
      .expect(200, {
          self: '/api/v1/shops/1010',
          name: 'My Shop',
          category: 'My Category',
          address: 'My Address',
          coordinates: 'My Coordinates',
          opening_hours:[
            {
                day: 'LUN',
                state: 'open',
                periods:[{
                startHours: 11,
                startMinutes: 0,
                endHours: 23,
                endMinutes: 30
             }],
        }],
                state: 'My State'
        });
  });

  test('GET /api/v1/shops/:id should respond with 404 if not found', async () => {
    return request(app)
      .get('/api/v1/shops/nonexistentid')
      .expect(404);
  });

});


describe('POST /api/v1/shops', () => {
    let shopSaveSpy;
    let token_owner;
    let token_user;

    beforeAll(() => {
        token_owner = jwt.sign({ email: 'owner@test.com', userType: 'shop_owner' }, process.env.SUPER_SECRET, { expiresIn: 86400 });
        token_user = jwt.sign({ email: 'user@test.com', userType: 'base_user' }, process.env.SUPER_SECRET, { expiresIn: 86400 });

        const Shop = require('./models/shop');
        shopSaveSpy = jest.spyOn(Shop.prototype, 'save').mockImplementation(function() {
            this._id = '12345';
            return Promise.resolve(this);
        });
    });

    afterAll(() => {
        shopSaveSpy.mockRestore();
    });

    test('POST /api/v1/shops should create a new shop for a shop_owner', async () => {
        const shopData = {
            name: 'New Test Shop',
            category: 'supermercato',
            address: '123 Test St'
        };

        return request(app)
            .post('/api/v1/shops')
            .set('Authorization', `Bearer ${token_owner}`)
            .send(shopData)
            .expect(201)
            .then(res => {
                expect(res.body).toHaveProperty('name', 'New Test Shop');
                expect(res.body).toHaveProperty('owner', 'owner@test.com');
            });
    });

    test('POST /api/v1/shops should return 403 if user is not a shop_owner', async () => {
        const shopData = {
            name: 'New Test Shop',
            category: 'supermercato',
            address: '123 Test St'
        };

        return request(app)
            .post('/api/v1/shops')
            .set('Authorization', `Bearer ${token_user}`)
            .send(shopData)
            .expect(403);
    });

    test('POST /api/v1/shops should return 401 if no token is provided', async () => {
        const shopData = {
            name: 'New Test Shop',
            category: 'supermercato',
            address: '123 Test St'
        };

        return request(app)
            .post('/api/v1/shops')
            .send(shopData)
            .expect(401);
    });
    
    test('POST /api/v1/shops should return 400 if required fields are missing', async () => {
        const shopData = { // Missing name
            category: 'supermercato',
            address: '123 Test St'
        };

        const Shop = require('./models/shop');
        const validationError = new Error('Validation error');
        validationError.name = 'ValidationError';
        
        // Temporarily override the spy for this test
        const tempSaveSpy = jest.spyOn(Shop.prototype, 'save').mockImplementationOnce(() => Promise.reject(validationError));

        await request(app)
            .post('/api/v1/shops')
            .set('Authorization', `Bearer ${token_owner}`)
            .send(shopData)
            .expect(400);

        tempSaveSpy.mockRestore();
    });
});

describe('DELETE /api/v1/shops/:id', () => {
  let shopSpyFindById;
  let token_owner;
  let token_other_owner;

  beforeAll(() => {
    const Shop = require('./models/shop');

    token_owner = jwt.sign({ email: 'owner@test.com', userType: 'shop_owner' }, process.env.SUPER_SECRET, { expiresIn: 86400 });
    token_other_owner = jwt.sign({ email: 'other@test.com', userType: 'shop_owner' }, process.env.SUPER_SECRET, { expiresIn: 86400 });


    // Mocking Shop.findById method
    shopSpyFindById = jest.spyOn(Shop, 'findById').mockImplementation((id) => {
      if (id === '1010') {
        return Promise.resolve({
            _id: '1010',
            name: 'My Shop',
            owner: 'owner@test.com',
            deleteOne: jest.fn().mockResolvedValue({})
          });
      } else {
        return Promise.resolve(null);
      }
    });
  });

  afterAll(() => {
    shopSpyFindById.mockRestore();
  });

  test('DELETE /api/v1/shops/:id should delete shop', async () => {
    const response = await request(app)
      .delete('/api/v1/shops/1010')
      .set('Authorization', `Bearer ${token_owner}`)
      .expect(200);
    expect(response.body.message).toBe('Shop deleted successfully');
  });

  test('DELETE /api/v1/shops/:id should return 404 if shop does not exist', async () => {
    const response = await request(app)
      .delete('/api/v1/shops/9999')
      .set('Authorization', `Bearer ${token_owner}`)
      .expect(404);
  });

  test('DELETE /api/v1/shops/:id should return 401 if not authenticated', async () => {
    await request(app)
      .delete('/api/v1/shops/1010')
      .expect(401);
  });

  test('DELETE /api/v1/shops/:id should return 401 if not the owner', async () => {
    await request(app)
      .delete('/api/v1/shops/1010')
      .set('Authorization', `Bearer ${token_other_owner}`)
      .expect(401);
  });
});


describe('PATCH /api/v1/shops/:id', () => {

    let shopSpyFindById;
    let shopSpyFindByIdAndUpdate;
    let token_owner;
    let token_other_owner;
    const shopId = '1010';

    beforeAll(() => {
        const Shop = require('./models/shop');
        token_owner = jwt.sign({ email: 'owner@test.com', userType: 'shop_owner' }, process.env.SUPER_SECRET, { expiresIn: 86400 });
        token_other_owner = jwt.sign({ email: 'other@test.com', userType: 'shop_owner' }, process.env.SUPER_SECRET, { expiresIn: 86400 });
        
        shopSpyFindById = jest.spyOn(Shop, 'findById').mockImplementation((id) => {
            if(id === shopId){
                return Promise.resolve({
                    _id: shopId,
                    name: 'Test Shop',
                    category: 'supermercato',
                    address: 'Test Address',
                    coordinates: [0, 0],
                    owner: 'owner@test.com'
                });
            } else {
                return Promise.resolve(null);
            }
        });
        
        shopSpyFindByIdAndUpdate = jest.spyOn(Shop, 'findByIdAndUpdate').mockImplementation((id, data) => {
            if (id === shopId) {
                return {
                    exec: jest.fn().mockResolvedValue({
                        _id: id,
                        name: data.$set.name || 'Test Shop',
                        category: 'supermercato',
                        address: 'Test Address',
                        coordinates: data.$set.coordinates || [0,0],
                        owner: 'owner@test.com'
                    })
                };
            } else {
                return { exec: jest.fn().mockResolvedValue(null) };
            }
        });
    });

    afterAll(() => {
        shopSpyFindById.mockRestore();
        shopSpyFindByIdAndUpdate.mockRestore();
    });
    
    test('PATCH /api/v1/shops/:id passing right coordinates', () => {
      return request(app)
        .patch(`/api/v1/shops/${shopId}`)
        .set('Authorization', `Bearer ${token_owner}`)
        .send({coordinates: [45.0, 90.0]}) 
        .expect(200)
        .then((res) => {
            expect(res.body.coordinates).toEqual([45.0, 90.0]);
        });
    });

    test('PATCH /api/v1/shops/:id should return 404 if shop is not found', async () => {
      const validObjectId = new mongoose.Types.ObjectId();
      await request(app)
        .patch(`/api/v1/shops/${validObjectId}`)
        .set('Authorization', `Bearer ${token_owner}`)
        .send({
          coordinates: [45.0, 90.0]
        })
        .expect(404);
    });

    test('PATCH /api/v1/shops/:id should return 401 if not authenticated', async () => {
        await request(app)
            .patch(`/api/v1/shops/${shopId}`)
            .send({ name: 'Updated name' })
            .expect(401);
    });

    test('PATCH /api/v1/shops/:id should return 401 if user is not the owner', async () => {
        await request(app)
            .patch(`/api/v1/shops/${shopId}`)
            .set('Authorization', `Bearer ${token_other_owner}`)
            .send({ name: 'Updated name' })
            .expect(401);
    });
});