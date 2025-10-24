const request = require('supertest');
const app = require('./app');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

describe('Users API', () => {

    let testUser;
    let authToken;

    beforeAll(async () => {
        await User.deleteMany({ email: /@example.com/ });

        testUser = new User({
            userType: 'base_user',
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123'
        });
        await testUser.save();

        authToken = jwt.sign({ id: testUser.id, email: testUser.email }, process.env.SUPER_SECRET);
    });

    afterAll(async () => {
        await User.deleteMany({ email: /@example.com/ });
    });

    describe('POST /api/v1/users/register', () => {
        it('should register a new base user', async () => {
            const res = await request(app)
                .post('/api/v1/users/register')
                .send({
                    userType: 'base_user',
                    name: 'Jane',
                    surname: 'Doe',
                    email: 'jane.doe@example.com',
                    password: 'password123'
                })
                .expect(201);
            expect(res.body.user.email).toBe('jane.doe@example.com');
        });

        it('should not register a user with a duplicate email', async () => {
            await request(app)
                .post('/api/v1/users/register')
                .send({
                    userType: 'base_user',
                    name: 'John',
                    surname: 'Doe',
                    email: 'john.doe@example.com',
                    password: 'password123'
                })
                .expect(409);
        });

        it('should not register a user with a weak password', async () => {
            await request(app)
                .post('/api/v1/users/register')
                .send({
                    userType: 'base_user',
                    name: 'Test',
                    surname: 'User',
                    email: 'test.user@example.com',
                    password: '123'
                })
                .expect(400);
        });
    });

    describe('GET /api/v1/users/me', () => {
        it('should get the current user profile', async () => {
            const res = await request(app)
                .get('/api/v1/users/me')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(res.body.email).toBe('john.doe@example.com');
        });

        it('should return 401 if not authenticated', async () => {
            await request(app).get('/api/v1/users/me').expect(401);
        });
    });

    describe('GET /api/v1/users/:userId', () => {
        it('should get a user profile by ID', async () => {
            const res = await request(app)
                .get(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(res.body.email).toBe('john.doe@example.com');
        });

        it('should not get another user profile', async () => {
            const anotherUser = new User({
                userType: 'base_user',
                name: 'Another',
                surname: 'User',
                email: 'another.user@example.com',
                password: 'password123'
            });
            await anotherUser.save();

            await request(app)
                .get(`/api/v1/users/${anotherUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(401);
        });
    });

    describe('PUT /api/v1/users/:userId', () => {
        it('should update a user profile', async () => {
            const res = await request(app)
                .put(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'John Updated' })
                .expect(200);
            expect(res.body.user.name).toBe('John Updated');
        });

        it('should update the password', async () => {
            await request(app)
                .put(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    currentPassword: 'password123',
                    newPassword: 'newpassword123'
                })
                .expect(200);

            // Verify new password
            await request(app)
                .post('/api/v1/authentications')
                .send({
                    email: 'john.doe@example.com',
                    password: 'newpassword123'
                })
                .expect(200);
        });

        it('should not update the password with incorrect current password', async () => {
            await request(app)
                .put(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    currentPassword: 'wrongpassword',
                    newPassword: 'newpassword'
                })
                .expect(400);
        });
    });

    describe('DELETE /api/v1/users/:userId', () => {
        it('should delete a user', async () => {
            await request(app)
                .delete(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            // Verify user is deleted
            await request(app)
                .get(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });
});
