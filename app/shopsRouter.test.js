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

});


describe('DELETE /api/v1/shops/:id', () => {
  let shopSpyFindById;
  let shopSpyDelete;

  beforeAll(() => {
    const Shop = require('./models/shop');

    // Mocking Shop.findById method
    shopSpyFindById = jest.spyOn(Shop, 'findById').mockImplementation((id) => {
      if (id === '1010') {
        return {
          exec: jest.fn().mockResolvedValue({
            _id: '1010',
            name: 'My Shop',
            deleteOne: jest.fn().mockResolvedValue({})
          }),
        };
      } else {
        return {
          exec: jest.fn().mockResolvedValue(null),
        };
      }
    });

   
    // Mocking Shop.deleteOne method
    shopSpyDelete = jest.spyOn(Shop, 'deleteOne').mockImplementation((id) => {
      if (id === '1010') {
        
        return { deletedCount: 1 };
      } else {
        return { deletedCount: 0 };
      }
    });
  });

  afterAll(() => {
    shopSpyFindById.mockRestore();
    shopSpyDelete.mockRestore();
  });

  test('DELETE /api/v1/shops/:id should delete shop', async () => {
    const response = await request(app)
      .delete('/api/v1/shops/1010')
      .expect(204);
  });

  test('DELETE /api/v1/shops/:id should return 404 if shop does not exist', async () => {
    const response = await request(app)
      .delete('/api/v1/shops/9999')
      .expect(404);

    expect(response.text).toBe( "\"shop not found\"");
    expect(shopSpyDelete).not.toHaveBeenCalled();
  });
});


describe('PATCH /api/v1/shops/:id', () => {

    let connection;
    const validObjectId = new mongoose.Types.ObjectId();

    beforeAll( async () => {
      const Shop = require('./models/shop');
      jest.setTimeout(8000);
      jest.unmock('mongoose');
      connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
      console.log('Database connected!');
      const shop = new Shop({
        name: 'Test Shop',
        category: 'supermercato',
        address: 'Test Address',
        coordinates: [0, 0], // Initial coordinates
    });
    await shop.save();
    shopId = shop._id; // Save the ObjectId for testing
});

      //return connection; // Need to return the Promise db connection?
    
  
    afterAll( () => {
      Shop.findByIdAndDelete(shopId);
      mongoose.connection.close(true);
      console.log("Database connection closed");
    });
    

    test('PATCH /api/v1/shops/:id passing right coordinates', () => {
      return request(app)
        .patch(`/api/v1/shops/${shopId}`)
        .send({coordinates: [45.0, 90.0]}) 
        .expect(200);
    });

    
    test('PATCH /api/v1/shops/:id should return 404 if shop is not found', async () => {
      const response = await request(app)
        .patch(`/api/v1/shops/${validObjectId}`)
        .send({
          coordinates: [45.0, 90.0]
        })
        .expect(404);
    });
});