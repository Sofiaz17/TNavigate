const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const tokenChecker = require('./tokenChecker');

process.env.SUPER_SECRET = 'test-secret-for-token-checker';

describe('tokenChecker Middleware', () => {

    it('should return 401 if no token is provided', () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        const next = jest.fn();

        tokenChecker(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData().message).toBe('Unauthorized');
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for an invalid token', () => {
        const req = httpMocks.createRequest({
            headers: {
                'Authorization': 'Bearer invalidtoken'
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        tokenChecker(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData().message).toBe('Unauthorized');
    });

    it('should call next() for a valid token in Authorization header (Bearer)', () => {
        const token = jwt.sign({ id: '123' }, process.env.SUPER_SECRET);
        const req = httpMocks.createRequest({
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        tokenChecker(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.loggedUser.id).toBe('123');
    });

    it('should call next() for a valid token in x-access-token header', () => {
        const token = jwt.sign({ id: '123' }, process.env.SUPER_SECRET);
        const req = httpMocks.createRequest({
            headers: {
                'x-access-token': token
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        tokenChecker(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should call next() for a valid token in query parameter', () => {
        const token = jwt.sign({ id: '123' }, process.env.SUPER_SECRET);
        const req = httpMocks.createRequest({
            query: {
                token: token
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        tokenChecker(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should call next() for a valid token in request body', () => {
        const token = jwt.sign({ id: '123' }, process.env.SUPER_SECRET);
        const req = httpMocks.createRequest({
            body: {
                token: token
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        tokenChecker(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
