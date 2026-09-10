# API Documentation

## Base URL

```
http://localhost:3000/api/v1
```

**Note**: Health check endpoint is at `http://localhost:3000/health` (no `/api/v1` prefix).

## Authentication

This API uses **HTTP-only cookies** for authentication. On login, a `token` cookie is set automatically by the server. Subsequent protected requests send the cookie automatically — no manual token handling required.

---

## Health Check

### GET /health

Get server status and uptime.

**Full URL**: `http://localhost:3000/health` (no `/api/v1` prefix)

**Response** (200 OK)

```json
{
  "status": "running",
  "uptime": "00:05:23",
  "version": "1.0.0",
  "DBConnection": "connected"
}
```

---

## Authentication Endpoints

### POST /auth/signup

Register a new user.

**Request Body**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validation**

- `username`: 3–30 chars, alphanumeric with underscores/hyphens
- `email`: Valid email format
- `password`: Minimum 8 characters

**Response** (201 Created)

```json
{
  "status": "success",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Errors**

- `400`: Validation error
- `409`: Username or email already exists
- `415`: Content-Type must be application/json
- `500`: Server error

---

### POST /auth/login

Authenticate and set session cookie.

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

_Use either `email` or `username`, not both._

**Response** (200 OK)

Sets an HTTP-only `token` cookie (expires in 1 hour). Response body:

```json
{
  "status": "success",
  "data": null
}
```

**Errors**

- `400`: Invalid credentials or validation error
- `401`: Incorrect password
- `404`: User not found
- `415`: Content-Type must be application/json

---

### POST /auth/logout

Clear the session cookie. No authentication required.

**Response** (200 OK)

```json
{
  "status": "success",
  "data": {
    "message": "Logged out successfully."
  }
}
```

---

### POST /auth/logoutAll

Invalidate all active sessions for the current user (increments token version). Requires authentication.

**Response** (200 OK)

```
Status: 200 OK
(No response body)
```

**Errors**

- `401`: Invalid or missing token

---

## User Endpoints

### GET /users/me

Get current user's profile.

**Response** (200 OK)

```json
{
  "status": "success",
  "data": {
    "userData": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "role": "user",
      "account": {
        "username": "johndoe",
        "email": "john@example.com",
        "lastLogin": "2026-01-30T12:00:00.000Z"
      },
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1990-01-15T00:00:00.000Z",
        "heightCm": 180,
        "weightKg": 75
      },
      "createdAt": "2026-01-20T10:00:00.000Z",
      "updatedAt": "2026-01-30T12:00:00.000Z"
    }
  }
}
```

**Errors**

- `401`: Invalid or missing token
- `404`: User not found

---

### PATCH /users/me/profile

Update user profile. All fields optional; at least one required.

**Request Body**

```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "heightCm": 180,
    "weightKg": 75
  }
}
```

**Response** (200 OK)

```json
{
  "status": "success",
  "data": {
    "savedProfile": {
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "heightCm": 180,
      "weightKg": 75
    }
  }
}
```

**Errors**

- `400`: Validation error
- `401`: Invalid or missing token
- `415`: Content-Type must be application/json

---

### PATCH /users/me/account

Update account credentials (username, email, or password).

Must provide `currentPassword` for verification and **exactly one** of `newEmail`, `newUsername`, or `newPassword`. On success, all existing sessions are invalidated and a re-login is required.

**Request Body** (example — change email)

```json
{
  "currentPassword": "SecurePass123!",
  "newEmail": "newemail@example.com"
}
```

**Request Body** (example — change username)

```json
{
  "currentPassword": "SecurePass123!",
  "newUsername": "newusername"
}
```

**Request Body** (example — change password)

```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewPass456!"
}
```

**Response** (200 OK)

```
Status: 200 OK
(No response body)
```

**Errors**

- `400`: Validation error, missing `currentPassword`, or more than one update field provided
- `401`: Invalid or missing token, or incorrect `currentPassword`
- `409`: New username or email already exists (only when changing `newUsername` or `newEmail`)
- `415`: Content-Type must be application/json

---

### GET /users

Get all users (admin only).

**Response** (200 OK)

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "usersData": [
      {
        "userId": "...",
        "role": "user",
        "account": { "username": "...", "email": "...", "lastLogin": "..." },
        "profile": {},
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

**Errors**

- `401`: Invalid or missing token
- `403`: Not admin

---

### GET /users/:id

Get user by ID (admin or own ID only).

**Response** (200 OK)

```json
{
  "status": "success",
  "data": {
    "userData": {
      "userId": "...",
      "role": "user",
      "account": { "username": "...", "email": "...", "lastLogin": "..." },
      "profile": {},
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

**Errors**

- `400`: Invalid UUID
- `401`: Invalid or missing token
- `403`: Not authorized
- `404`: User not found

---

## Run Endpoints

### POST /users/me/runs

Create a new run.

**Request Body**

```json
{
  "startTime": "2026-01-30T08:00:00.000Z",
  "durationSec": 1800,
  "distanceMeters": 5000,
  "title": "Morning run",
  "notes": "Felt great today",
  "perceivedEffort": 7,
  "weather": "sunny"
}
```

**Required**: `startTime`, `durationSec`, `distanceMeters`  
**Optional**: `title`, `notes`, `perceivedEffort` (integer 1–10), `weather`

> `startTime` must be an ISO 8601 UTC timestamp with a `Z` suffix (e.g. `2026-01-30T08:00:00.000Z`). Offset formats such as `+02:00` are rejected.

**`weather` enum values**: `sunny`, `partlyCloudy`, `cloudy`, `rain`, `snow`, `windy`, `hot`, `cold`

**Response** (201 Created)

```json
{
  "status": "success",
  "data": {
    "runData": {
      "runId": "660e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "startTime": "2026-01-30T08:00:00.000Z",
      "date": "2026-01-30T00:00:00.000Z",
      "durationSec": 1800,
      "distanceMeters": 5000,
      "paceSecPerKm": 360,
      "title": "Morning run",
      "notes": "Felt great today",
      "perceivedEffort": 7,
      "weather": "sunny",
      "createdAt": "2026-01-30T08:30:00.000Z",
      "updatedAt": "2026-01-30T08:30:00.000Z"
    }
  }
}
```

**Errors**

- `400`: Validation error
- `401`: Invalid or missing token
- `415`: Content-Type must be application/json

---

### GET /users/me/runs

Get all runs for the authenticated user.

**Response** (200 OK)

```json
{
  "status": "success",
  "results": 1,
  "data": {
    "myRuns": [
      {
        "runId": "660e8400-e29b-41d4-a716-446655440001",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "startTime": "2026-01-30T08:00:00.000Z",
        "date": "2026-01-30T00:00:00.000Z",
        "durationSec": 1800,
        "distanceMeters": 5000,
        "paceSecPerKm": 360,
        "createdAt": "2026-01-30T08:30:00.000Z",
        "updatedAt": "2026-01-30T08:30:00.000Z"
      }
    ]
  }
}
```

**Errors**

- `401`: Invalid or missing token

---

### GET /runs/:id

Get run by ID.

**URL Parameters**

- `id`: UUID of the run

**Response** (200 OK)

```json
{
  "status": "success",
  "data": {
    "runData": {
      "runId": "660e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "startTime": "2026-01-30T08:00:00.000Z",
      "date": "2026-01-30T00:00:00.000Z",
      "durationSec": 1800,
      "distanceMeters": 5000,
      "paceSecPerKm": 360,
      "createdAt": "2026-01-30T08:30:00.000Z",
      "updatedAt": "2026-01-30T08:30:00.000Z"
    }
  }
}
```

**Errors**

- `400`: Invalid UUID
- `404`: Run not found

---

### PATCH /runs/:id

Update run (owner or admin only). All fields optional; at least one required.

**Request Body**

```json
{
  "startTime": "2026-01-30T08:00:00.000Z",
  "durationSec": 2000,
  "distanceMeters": 5500,
  "title": "Updated title",
  "notes": "Updated notes",
  "perceivedEffort": 8,
  "weather": "cloudy"
}
```

**Response** (200 OK)

```json
{
  "status": "success",
  "data": {
    "runData": {
      "runId": "660e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "startTime": "2026-01-30T08:00:00.000Z",
      "date": "2026-01-30T00:00:00.000Z",
      "durationSec": 2000,
      "distanceMeters": 5500,
      "paceSecPerKm": 363.636,
      "title": "Updated title",
      "notes": "Updated notes",
      "perceivedEffort": 8,
      "weather": "cloudy",
      "createdAt": "2026-01-30T08:30:00.000Z",
      "updatedAt": "2026-01-30T10:00:00.000Z"
    }
  }
}
```

**Errors**

- `400`: Validation error (body fields)
- `401`: Invalid or missing token
- `403`: Not authorized
- `404`: Run not found
- `415`: Content-Type must be application/json

---

### DELETE /runs/:id

Delete run (owner or admin only).

**Response** (204 No Content)

```
Status: 204 No Content
(No response body)
```

**Errors**

- `400`: Invalid UUID
- `401`: Invalid or missing token
- `403`: Not authorized
- `404`: Run not found

---

## Data Models

### User

```javascript
{
  userId: String (UUID),
  role: "user" | "admin",
  account: {
    username: String,
    email: String,
    lastLogin: Date | null
  },
  profile: {
    firstName: String,       // optional
    lastName: String,        // optional
    dateOfBirth: Date,       // optional
    heightCm: Number,        // optional
    weightKg: Number         // optional
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Run

```javascript
{
  runId: String (UUID),
  userId: String (UUID),
  startTime: Date,
  date: Date,                // start of day (derived)
  durationSec: Number,
  distanceMeters: Number,
  paceSecPerKm: Number,      // derived: durationSec / (distanceMeters / 1000)
  title: String,             // optional
  notes: String,             // optional
  perceivedEffort: Number,   // optional, integer 1-10
  weather: String,           // optional, enum (see above)
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Format

All errors return:

```json
{
  "error": {
    "message": "Human-readable error description",
    "name": "ErrorName",
    "field": "fieldName"
  }
}
```

`field` is only present for validation errors that relate to a specific input field.

### HTTP Status Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token or incorrect password)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate username/email)
- `415` - Unsupported Media Type (Content-Type not application/json)
- `500` - Internal Server Error
