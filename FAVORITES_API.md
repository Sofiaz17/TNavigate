# User Favorites API Documentation

This document describes the User Favorites API endpoints that allow users to manage their favorite shops.

## Overview

The User Favorites system provides backend support for storing and managing user's favorite shops, replacing the frontend localStorage approach with persistent database storage and cross-device synchronization.

## Database Schema

### UserFavorite Model
- `id` (ObjectId): Primary key
- `user_id` (ObjectId): Foreign key to User model
- `shop_id` (ObjectId): Foreign key to Shop model  
- `created_at` (Date): Timestamp when favorite was created
- `updated_at` (Date): Timestamp when favorite was last updated

### Indexes
- Unique compound index on `(user_id, shop_id)` to prevent duplicates
- Individual indexes on `user_id` and `shop_id` for query performance
- Compound index on `(user_id, createdAt)` for pagination

## API Endpoints

All endpoints require Bearer token authentication via the `Authorization` header.

### 1. Get User Favorites

**GET** `/api/v1/users/me/favorites`

Retrieves all favorite shops for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20)

**Response:**
```json
{
  "favorites": [
    {
      "id": "shop_123",
      "name": "Shop Name",
      "address": "123 Main St",
      "category": "elettronica",
      "city": "Milan",
      "provincia": "MI",
      "coordinates": [45.4642, 9.1900],
      "information": "Shop description",
      "favorited_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### 2. Add Shop to Favorites

**POST** `/api/v1/users/me/favorites`

Adds a shop to the user's favorites.

**Request Body:**
```json
{
  "shop_id": "shop_123"
}
```

**Response:**
```json
{
  "message": "Shop added to favorites"
}
```

**Status Codes:**
- `201`: Shop added successfully
- `400`: Invalid request (missing shop_id)
- `404`: Shop not found
- `409`: Shop already in favorites

### 3. Remove Shop from Favorites

**DELETE** `/api/v1/users/me/favorites/{shop_id}`

Removes a shop from the user's favorites.

**Response:**
```json
{
  "message": "Shop removed from favorites"
}
```

**Status Codes:**
- `200`: Shop removed successfully
- `404`: Favorite not found

### 4. Check if Shop is Favorited

**GET** `/api/v1/users/me/favorites/{shop_id}`

Checks if a specific shop is in the user's favorites.

**Response:**
```json
{
  "is_favorite": true,
  "favorited_at": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200`: Shop is favorited
- `404`: Shop not found or not in favorites

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid token
- `404`: Not Found - Resource doesn't exist
- `409`: Conflict - Duplicate resource (e.g., shop already favorited)
- `500`: Internal Server Error - Server-side error

## Example Usage

### JavaScript/Node.js
```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';
const token = 'your-jwt-token';

// Get user's favorites
const favorites = await axios.get(`${API_BASE}/users/me/favorites`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Add shop to favorites
await axios.post(`${API_BASE}/users/me/favorites`, 
  { shop_id: 'shop_123' },
  { headers: { Authorization: `Bearer ${token}` } }
);

// Check if shop is favorited
const isFavorited = await axios.get(`${API_BASE}/users/me/favorites/shop_123`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Remove shop from favorites
await axios.delete(`${API_BASE}/users/me/favorites/shop_123`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

### cURL Examples
```bash
# Get favorites
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/users/me/favorites

# Add to favorites
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"shop_id": "shop_123"}' \
  http://localhost:3000/api/v1/users/me/favorites

# Check if favorited
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/users/me/favorites/shop_123

# Remove from favorites
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/users/me/favorites/shop_123
```

## Performance Considerations

- Database indexes are optimized for common query patterns
- Pagination is supported for users with many favorites
- Favorites are returned with full shop details for immediate use
- Deleted shops are automatically filtered out from results

## Migration from localStorage

To migrate existing localStorage favorites to the backend:

1. Retrieve favorites from localStorage
2. For each favorite, call the POST endpoint to add it to the backend
3. Clear localStorage favorites
4. Update frontend to use the new API endpoints

## Testing

Run the test suite to verify functionality:

```bash
npm test -- app/favoritesRouter.test.js
```

Or use the manual test script:

```bash
node scripts/test-favorites.js
```
