/**
 * https://www.npmjs.com/package/supertest
 */
const request  = require('supertest');
const app      = require('./app');
const mongoose = require('mongoose')


describe('GET /api/v1/shops', () => {

  // Moking Shop.find method
  let shopSpy;
  // Moking Shop.findById method
  let shopSpyFindById;

  beforeAll( () => {
    const Shop = require('./models/shop');
    shopSpy = jest.spyOn(Shop, 'find').mockImplementation((criterias) => {
     
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
          }}
    );

    shopSpyFindById = jest.spyOn(Shop, 'findById').mockImplementation((id) => {
      if (id==1010)
        return {
          id: 1010,
          name: 'My Shop'
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

  test('GET /api/v1/shops?name=name should return shop information', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/shops?name=My%20Shop');
    const shop = response.body;
    expect(shop).toBeDefined();
    expect(shop[0].name).toBe('My Shop');
  });

  
  test('GET /api/v1/shops?category=category should return shop information', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/shops?category=My%20Category');
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
          name: 'My Shop'
        });
  });

});


describe('PATCH /api/v1/shops/:id', () => {
    let findByIdAndUpdateSpy;
    const validObjectId = new mongoose.Types.ObjectId();
    const nonExistingId = new mongoose.Types.ObjectId();
  
    beforeAll(() => {
      const Shop = require('./models/shop');
      // Mocking Shop.findByIdAndUpdate
       findByIdAndUpdateSpy = jest.spyOn(Shop, 'findByIdAndUpdate').mockImplementation((id, update) => {
        if (id.equals(validObjectId)) {
          return {
            exec: jest.fn().mockResolvedValue({
              _id: validObjectId, 
              coordinates: [request.body.coordinates]
            })
          };
        } else {
          return {
            exec: jest.fn().mockResolvedValue(null)
          };
        }
      });
    });
  
    afterAll(() => {
      findByIdAndUpdateSpy.mockRestore();
    });
  
    test('should update shop coordinates', async () => {
      const response = await request(app)
      .patch(`/api/v1/shops/${validObjectId}`)
        .send({
          coordinates: [45.0, 90.0]
        })
        .expect(200);
  
      expect(response.header.location).toBe(`/api/v1/shops/${validObjectId}`);
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(validObjectId, { coordinates: [45.0, 90.0] });
    });
  
    test('should return 404 if shop is not found', async () => {
      const response = await request(app)
        .patch(`/api/v1/shops/${nonExistingId}`)
        .send({
          coordinates: [45.0, 90.0]
        })
        .expect(404);
  
      expect(response.text).toBe('');
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(nonExistingId, { coordinates: [45.0, 90.0] });
    });
});



// /**
//  * https://www.npmjs.com/package/supertest
//  */
// const request = require('supertest');
// const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
// const app     = require('./app');

// describe('GET /api/v1/students/me', () => {

//   // Moking User.findOne method
//   let userSpy;

//   beforeAll( () => {
//     const User = require('./models/student');
//     userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
//       return {
//         id: 1212,
//         email: 'John@mail.com'
//       };
//     });
//   });

//   afterAll(async () => {
//     userSpy.mockRestore();
//   });
  
//   test('GET /api/v1/students/me with no token should return 401', async () => {
//     const response = await request(app).get('/api/v1/students/me');
//     expect(response.statusCode).toBe(401);
//   });

//   test('GET /api/v1/students/me?token=<invalid> should return 403', async () => {
//     const response = await request(app).get('/api/v1/students/me?token=123456');
//     expect(response.statusCode).toBe(403);
//   });

//   // create a valid token
//   var payload = {
//     email: 'John@mail.com'
//   }
//   var options = {
//     expiresIn: 86400 // expires in 24 hours
//   }
//   var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
      
//   test('GET /api/v1/students/me?token=<valid> should return 200', async () => {
//     expect.assertions(1);
//     const response = await request(app).get('/api/v1/students/me?token='+token);
//     expect(response.statusCode).toBe(200);
//   });

//   test('GET /api/v1/students/me?token=<valid> should return user information', async () => {
//     expect.assertions(2);
//     const response = await request(app).get('/api/v1/students/me?token='+token);
//     const user = response.body;
//     expect(user).toBeDefined();
//     expect(user.email).toBe('John@mail.com');
//   });
// });
