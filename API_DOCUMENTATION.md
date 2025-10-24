# TNavigate API Documentation

This document provides a comprehensive guide to the TNavigate API, covering all available endpoints, authentication, and error handling.

## 1. General Information

### 1.1 Authentication
Most endpoints require a valid JSON Web Token (JWT) for authentication. The token must be included in the `Authorization` header as a Bearer token.

**Example Header:**
```
Authorization: Bearer <your-jwt-token>
```

Tokens can be obtained by registering a new user and then authenticating via the `/api/v1/authentications` endpoint.

### 1.2 Error Handling
The API returns standard HTTP status codes to indicate the success or failure of a request.

- `200 OK`: The request was successful.
- `201 Created`: The resource was successfully created.
- `204 No Content`: The request was successful, but there is no content to return (e.g., for a DELETE request).
- `400 Bad Request`: The request was invalid (e.g., missing parameters, validation error).
- `401 Unauthorized`: Authentication failed or is required.
- `403 Forbidden`: The authenticated user does not have permission to access the resource.
- `404 Not Found`: The requested resource could not be found.
- `409 Conflict`: The request could not be completed due to a conflict (e.g., duplicate resource).
- `500 Internal Server Error`: An unexpected error occurred on the server.

---

## 2. API Endpoints

### 2.1 Authentication
Handles user authentication, including email/password login and Google OAuth.

**Endpoints:**
- **`POST /api/v1/authentications`**: Authenticate a user with email and password.
- **`GET /api/v1/authentications/google/login`**: Initiates Google login.
- **`GET /api/v1/authentications/google/signup/:userType`**: Initiates Google signup for a specific user type (`base_user` or `shop_owner`).

---

### 2.2 Users
Manages user registration, profiles, and accounts.

**Endpoints:**
- **`POST /api/v1/users/register`**: Register a new user.
- **`GET /api/v1/users/me`**: Get the profile of the currently authenticated user.
- **`GET /api/v1/users/:userId`**: Get a user's profile by their ID.
- **`PUT /api/v1/users/:userId`**: Update a user's profile.
- **`DELETE /api/v1/users/:userId`**: Delete a user's account.

---

### 2.3 Shops
Manages shops, including their creation, retrieval, and modification.

**Endpoints:**
- **`POST /api/v1/shops`**: Create a new shop.
- **`GET /api/v1/shops`**: Get a list of shops, with optional filters.
- **`GET /api/v1/shops/:id`**: Get a single shop by its ID.
- **`PATCH /api/v1/shops/:id`**: Update a shop's details.
- **`DELETE /api/v1/shops/:id`**: Delete a shop.

---

### 2.4 Products
Manages products offered by shops.

**Endpoints:**
- **`POST /api/v1/products`**: Create a new product.
- **`GET /api/v1/products`**: Get a list of products, with optional filters.
- **`GET /api/v1/products/:id`**: Get a single product by its ID.
- **`DELETE /api/v1/products/:id`**: Delete a product.

---

### 2.5 Categories
Provides a list of available shop categories.

**Endpoints:**
- **`GET /api/v1/shopCategories`**: Get a list of all shop categories.
- **`GET /api/v1/shopCategories/:category`**: Get a single shop category.

---

### 2.6 Favorites
Allows users to manage their list of favorite shops.

**Endpoints:**
- **`POST /api/v1/users/me/favorites`**: Add a shop to favorites.
- **`GET /api/v1/users/me/favorites`**: Get the user's list of favorite shops.
- **`GET /api/v1/users/me/favorites/:shop_id`**: Check if a shop is in the user's favorites.
- **`DELETE /api/v1/users/me/favorites/:shop_id`**: Remove a shop from favorites.

---

## 3. Schemas

### 3.1 User
```json
{
  "userType": "string ('base_user' or 'shop_owner')",
  "name": "string",
  "surname": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)",
  "address": "string (optional)"
}
```

### 3.2 Shop
```json
{
  "name": "string",
  "address": "string",
  "category": "string (enum)",
  "coordinates": "[number, number] (optional)",
  "opening_hours": "object (optional)",
  "state": "string (optional)",
  "owner": "string (email)"
}
```

### 3.3 Product
```json
{
  "name": "string",
  "category": "string (enum)",
  "keywords": "[string]"
}
```

---

## 4. Deprecated APIs

### `utentiBase.js`
The `utentiBase` router appears to be deprecated and has been replaced by `usersRouter.js`. It is recommended to use the `usersRouter.js` for all user-related operations.
