# TNavigate

TNavigate is a small Express + MongoDB backend for managing shops, products, categories and user favorites. It includes JWT/session authentication, Google OAuth support, OpenAPI docs and a suite of Jest integration tests so contributors can iterate quickly.

## Key Features
- RESTful API for shops, products, categories and user accounts
- Session support (Mongo-backed) and JWT authentication
- Google OAuth integration for login
- OpenAPI (Swagger) documentation served by the app
- Test coverage with Jest and Supertest

---

## Quick Links
- **API docs**: `https://tnavigate1.docs.apiary.io/#`
- **Tests & coverage**: run `npm test` and `npm run test:coverage`
- **Source**: see the `app/` folder for routers and `app/models/` for Mongoose models
- **Additional docs**: `API_DOCUMENTATION.md`, `TESTING.md`, `TESTING_DOCUMENTATION.md`

---

## Getting Started
These steps get the project running locally for development and testing.

Prerequisites
- Node.js (14+ recommended)
- A running MongoDB instance (local or remote)

Install

```powershell
npm install
```

Environment
Create a `.env` file in the project root (or export env vars in your shell). Common variables the app uses:

- `DB_URL` — MongoDB connection string (required)
- `PORT` — server port (defaults to `3000`)
- `SESSION_SECRET` — session secret (for express-session)
- `JWT_SECRET` — JWT signing secret (if used by your auth flows)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — for Google OAuth (optional)
- `FRONTEND` — static frontend folder override (optional)

Example `.env` (do not commit secrets):

```env
DB_URL=mongodb://localhost:27017/tnavigate
PORT=3000
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Run

Start the server:

```powershell
npm start
```

Start locally with dotenv (loads `.env`):

```powershell
npm run start:local
```

For development reload helpers you can use the simple dev script:

```powershell
npm run dev
```

Testing

Run the full test suite:

```powershell
npm test
```

Quick coverage report:

```powershell
npm run test:coverage
```

There are also helper scripts in `scripts/` for integration testing and development (`scripts/test-api.js`, `scripts/dev-server.js`).

---

## API Overview & Examples
The server mounts endpoints under `/api/v1`. Main route examples:

- `GET /api/v1/shops` — list shops
- `GET /api/v1/products` — list products
- `GET /api/v1/shopCategories` — list categories
- `POST /api/v1/authentications` — login/register endpoints (see `app/authentication.js`)
- `GET /api/v1/utentiBase/me` — token-protected user info

Example curl (public endpoints):

```bash
curl http://localhost:3000/api/v1/shops
```

Authenticated requests expect either a session cookie (server-session) or an `Authorization: Bearer <token>` header depending on the route. See `app/authentication.js` and `app/tokenChecker.js` for details.

---

## Project Structure (important files)

- `index.js` — bootstrapper: connects to MongoDB, configures sessions & Passport, mounts routers
- `app/app.js` — Express app, middleware, static serving and Swagger setup
- `app/*.js` — routers and auth helpers (`shopsRouter.js`, `productsRouter.js`, `usersRouter.js`, `favoritesRouter.js`, `authentication.js`, etc.)
- `app/models/` — Mongoose models for `shop`, `product`, `user` and `userFavorite`
- `scripts/` — convenience scripts for testing and development
- `API_DOCUMENTATION.md` — higher-level API notes (link)
- `TESTING.md` and `TESTING_DOCUMENTATION.md` — testing notes


## Frontend
TNavigateVue

## Development Methodology

This project was developed following Agile methodology, using iterative sprint-based planning to ensure continuous delivery and rapid feedback.
Key Agile practices used during development:

- Sprint planning & iteration cycles - Work was organized in short, incremental sprints to keep progress measurable and predictable.

- User story–driven tasks - Features for shops, products, authentication, and testing were defined as user stories with clear acceptance criteria.

- Frequent reviews & retrospectives - Each sprint concluded with review meetings to evaluate completed features and retrospectives to refine the workflow.

- Continuous integration & automated testing - The Jest + Supertest suite provided automated verification for every sprint increment.