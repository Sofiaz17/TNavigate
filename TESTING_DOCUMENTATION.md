# TNavigate API Test Case Documentation

This document outlines the test cases implemented for the TNavigate API, ensuring its reliability, security, and correctness.

## Shops (`shopsRouter.test.js`)

### GET `/api/v1/shops`
- **Get All Shops**: Checks if the endpoint returns a list of all shops successfully.
- **Filter by Name**: Tests retrieving shops by a specific name.
- **Filter by Category**: Tests retrieving shops by a specific category.
- **Filter by Owner**: Checks if shops can be correctly filtered by the owner's email.
- **Case-Insensitive Search**: Verifies that name and category searches are case-insensitive.
- **Not Found**: Ensures a `404` is returned if no shop matches the provided query.

### GET `/api/v1/shops/:id`
- **Get by ID**: Verifies that a single shop can be retrieved by its ID.
- **Not Found**: Ensures a `404` status is returned for a non-existent ID.

### POST `/api/v1/shops`
- **Create Shop (Success)**: Checks if a new shop can be created by an authenticated `shop_owner`.
- **Forbidden**: Ensures a `403` status is returned if a non-`shop_owner` user tries to create a shop.
- **Unauthorized**: Verifies a `401` status is returned if no authentication token is provided.
- **Bad Request**: Tests that a `400` status is returned if required fields are missing.

### DELETE `/api/v1/shops/:id`
- **Delete Shop (Success)**: Checks if a shop is successfully deleted by its owner.
- **Not Found**: Ensures a `404` is returned for a non-existent shop.
- **Unauthorized**: Verifies a `401` is returned if no authentication token is provided.
- **Forbidden**: Ensures a `401` is returned if a user tries to delete a shop they do not own.

### PATCH `/api/v1/shops/:id`
- **Update Shop (Success)**: Tests if a shop's details can be updated by its owner.
- **Not Found**: Ensures a `404` is returned for a non-existent shop.
- **Unauthorized**: Verifies a `401` is returned if no authentication token is provided.
- **Forbidden**: Ensures a `401` is returned if a user tries to update a shop they do not own.

---

## Authentication (`authentication.test.js`)

### POST `/api/v1/authentications` (Email/Password)
- **Valid Credentials**: Authenticates a `base_user` and a `shop_owner` with correct credentials.
- **Invalid Credentials**: Rejects authentication for invalid email or password.
- **Missing Fields**: Returns a `400` error if email or password are missing.
- **Input Sanitization**: Handles case-insensitivity and whitespace in emails.

### JWT Token Validation
- **Correct Expiration**: Verifies the generated JWT token expires in 24 hours.
- **Correct Payload**: Ensures the JWT token contains the correct user information.

### Google OAuth2
- **Redirects**: Checks that the Google login and signup routes correctly redirect to Google's authentication page.
- **Invalid User Type**: Verifies a `400` error is returned for an invalid user type during signup.

---

## Categories (`categoriesRouter.test.js`)

### GET `/api/v1/shopCategories`
- **Get All Categories**: Verifies the endpoint returns a complete list of shop categories.

### GET `/api/v1/shopCategories/:category`
- **Get Single Category**: Checks if a single, valid category can be retrieved.
- **Not Found**: Ensures a `404` error for a non-existent category.
- **Case-Sensitive**: Verifies that category matching is case-sensitive.

---

## Favorites (`favoritesRouter.test.js`)

### POST `/api/v1/users/me/favorites`
- **Add to Favorites**: Adds a shop to a user's favorites.
- **Already Favorited**: Returns `409 Conflict` if the shop is already favorited.
- **Validation**: Returns `400` for missing or invalid `shop_id` and `404` for a non-existent shop.

### GET `/api/v1/users/me/favorites`
- **Get Favorites**: Retrieves the list of a user's favorite shops.
- **Pagination**: Correctly paginates the list of favorites.

### GET `/api/v1/users/me/favorites/:shop_id`
- **Check if Favorited**: Returns `{ "is_favorite": true }` if the shop is in favorites.
- **Not in Favorites**: Returns `404` if the shop is not in favorites.
- **Shop Not Found**: Returns `404` if the shop does not exist.

### DELETE `/api/v1/users/me/favorites/:shop_id`
- **Remove from Favorites**: Removes a shop from favorites.
- **Favorite Not Found**: Returns `404` if the shop is not in the user's favorites.
- **Invalid `shop_id`**: Returns `400` for an invalid `shop_id` format.

---

## Products (`productsRouter.test.js`)

### GET `/api/v1/products`
- **Get All/Filter**: Returns a list of all products or filters by name and category.
- **Not Found**: Returns `404` if no products match the query.
- **Bad Request**: Returns `400` if the name parameter is empty.

### GET `/api/v1/products/:id`
- **Get by ID**: Retrieves a single product by its ID.
- **Not Found**: Returns `404` for a non-existent product.

### POST `/api/v1/products`
- **Create Product**: Creates a new product and returns `201 Created`.

### DELETE `/api/v1/products/:id`
- **Delete Product**: Deletes a product by its ID.
- **Not Found**: Returns `404` for a non-existent product.

---

## Users (`usersRouter.test.js`)

### POST `/api/v1/users/register`
- **Register User**: Successfully registers a new user.
- **Duplicate Email**: Returns `409 Conflict` for an existing email.
- **Weak Password**: Returns `400` if the password is too short.

### GET `/api/v1/users/me`
- **Get Current User**: Retrieves the profile of the authenticated user.
- **Unauthorized**: Returns `401` if no token is provided.

### GET `/api/v1/users/:userId`
- **Get User by ID**: Retrieves a user's profile by their ID.
- **Access Control**: Prevents a user from accessing another user's profile (`401`).

### PUT `/api/v1/users/:userId`
- **Update Profile**: Updates a user's profile information.
- **Update Password**: Updates a password with the correct current password.
- **Incorrect Password**: Rejects password updates with an incorrect current password.

### DELETE `/api/v1/users/:userId`
- **Delete User**: Deletes a user's account.

---

## Token Checker (`tokenChecker.test.js`)

- **No Token**: Returns `401` if no token is provided.
- **Invalid Token**: Returns `401` if the token is invalid.
- **Valid Token Sources**: Correctly validates tokens from:
  - `Authorization: Bearer <token>` header
  - `x-access-token` header
  - URL query parameter (`?token=...`)
  - Request body (`{ "token": "..." }`)
