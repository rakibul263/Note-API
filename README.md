<div align="center">
  <h1>Notes API</h1>
  <p>A production-grade RESTful API for note management with JWT authentication, role-based access control, and pagination.</p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js" alt="Node.js">
    <img src="https://img.shields.io/badge/TypeScript-7.x-3178C6?logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Prisma-7.9-2D3748?logo=prisma" alt="Prisma">
    <img src="https://img.shields.io/badge/Docker-✓-2496ED?logo=docker" alt="Docker">
  </p>
</div>

---

## Table of Contents

- [Architecture](#architecture)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Authentication & Authorization](#authentication--authorization)
- [Query Parameters](#query-parameters)
- [Error Handling](#error-handling)
- [Docker](#docker)
- [Testing with Insomnia](#testing-with-insomnia)
- [Database Migrations](#database-migrations)
- [Linting & Code Quality](#linting--code-quality)

---

## Architecture

```
┌──────────────┐       ┌──────────────────────────────┐       ┌──────────────┐
│              │       │         Express App           │       │              │
│   Client     │──────▶│  ┌────────────────────────┐   │──────▶│  PostgreSQL  │
│  (Insomnia   │       │  │  Global Middleware     │   │       │   Database   │
│   /Postman)  │◀──────│  │  ┌──────┐ ┌──────────┐│   │◀──────│              │
│              │       │  │  │CORS  │ │   JSON   ││   │       └──────────────┘
└──────────────┘       │  │  └──────┘ │  Parser  ││   │
                       │  │           └──────────┘│   │
                       │  │  ┌──────────────────┐ │   │
                       │  │  │  Cookie Parser   │ │   │
                       │  │  └──────────────────┘ │   │
                       │  └────────────────────────┘   │
                       │                               │
                       │  ┌────────────────────────┐   │
                       │  │      Routes            │   │
                       │  │  ┌──────────────────┐  │   │
                       │  │  │  /api/auth        │  │   │
                       │  │  │  /api/notes       │  │   │
                       │  │  │  /api/admin       │  │   │
                       │  │  │  /api-docs        │  │   │
                       │  │  └──────────────────┘  │   │
                       │  └────────────────────────┘   │
                       │                               │
                       │  ┌────────────────────────┐   │
                       │  │  Middleware Stack      │   │
                       │  │  ┌────────┐ ┌───────┐  │   │
                       │  │  │  Auth  │ │Validation│  │   │
                       │  │  └────────┘ └───────┘  │   │
                       │  │  ┌──────────────────┐  │   │
                       │  │  │  Error Handler   │  │   │
                       │  │  └──────────────────┘  │   │
                       │  └────────────────────────┘   │
                       └──────────────────────────────┘
```

### Request Lifecycle

```
Client Request
      │
      ▼
  ┌──────────┐
  │   CORS   │
  └──────────┘
      │
      ▼
  ┌────────────┐
  │ JSON Parse │
  └────────────┘
      │
      ▼
  ┌──────────────┐
  │ Cookie Parse │
  └──────────────┘
      │
      ▼
  ┌─────────────────┐
  │  Route Matching │
  └─────────────────┘
      │
      ├──▶ Auth Middleware (JWT verification + role check)
      │         │
      │         ▼
      ├──▶ Validation Middleware (Zod schema validation)
      │         │
      │         ▼
      ├──▶ Controller (Request handling)
      │         │
      │         ▼
      ├──▶ Service (Business logic)
      │         │
      │         ▼
      ├──▶ Prisma Client (Database operations)
      │         │
      │         ▼
      ├──▶ sendResponse (Standardized response)
      │
      └──▶ Global Error Handler (Catches all errors)
                 │
                 ▼
            Error Response
```

---

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Note : "has many"
    User ||--o{ Session : "has many"
    Note }o--|| User : "belongs to"
    Session }o--|| User : "belongs to"

    User {
        int id PK
        string name
        string email UK
        string password
        enum role "ADMIN | USER"
        datetime createdAt
        datetime updatedAt
    }

    Note {
        int id PK
        string title UK
        string content
        int userId FK
        datetime createdAt
        datetime updatedAt
    }

    Session {
        int id PK
        string refreshToken
        int userId FK
        datetime expiresAt
        datetime createdAt
        datetime updatedAt
    }
```

### Database Schema

```sql
-- Users table
CREATE TABLE "User" (
    "id"       SERIAL    PRIMARY KEY,
    "name"     TEXT      NOT NULL,
    "email"    TEXT      NOT NULL UNIQUE,
    "password" TEXT      NOT NULL,
    "role"     "Role"    NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Notes table
CREATE TABLE "Note" (
    "id"        SERIAL    PRIMARY KEY,
    "title"     TEXT      NOT NULL UNIQUE,
    "content"   TEXT      NOT NULL,
    "userId"    INTEGER   NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Sessions table (refresh token store)
CREATE TABLE "Session" (
    "id"           SERIAL    PRIMARY KEY,
    "refreshToken" TEXT      NOT NULL,
    "userId"       INTEGER   NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "expiresAt"    TIMESTAMP(3) NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL
);

-- Enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');
```

---

## Tech Stack

| Layer              | Technology                                      |
| ------------------ | ----------------------------------------------- |
| **Runtime**        | Node.js 22                                      |
| **Framework**      | Express.js 5                                    |
| **Language**       | TypeScript 7                                    |
| **Database**       | PostgreSQL 17                                   |
| **ORM**            | Prisma ORM 7.9 (with Adapter-Pg)                |
| **Validation**     | Zod 4                                           |
| **Authentication** | JWT (jsonwebtoken)                              |
| **Password Hash**  | bcrypt                                          |
| **API Docs**       | Swagger UI (OpenAPI 3.0)                        |
| **Container**      | Docker & Docker Compose                         |
| **Package Manager**| pnpm                                            |

---

## Project Structure

```
notes-api/
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma           # Generator & datasource
│   │   ├── enum.prisma             # Role enum (ADMIN, USER)
│   │   ├── user.prisma             # User model
│   │   ├── note.prisma             # Note model
│   │   └── session.prisma          # Session model
│   ├── migrations/                 # Database migrations
│   ├── seed.ts                     # Admin seed script
│   └── migration_lock.toml
│
├── src/
│   ├── app.ts                      # Express app setup & middleware registration
│   ├── server.ts                   # Entry point
│   │
│   ├── config/
│   │   ├── env.ts                  # Environment variable loader
│   │   ├── prisma.ts               # Prisma client singleton
│   │   └── swagger.ts              # OpenAPI 3.0 specification
│   │
│   ├── errors/
│   │   ├── AppError.ts             # Custom error class with statusCode
│   │   └── handleZodError.ts       # Zod error formatter
│   │
│   ├── interface/
│   │   ├── error.ts                # Error type definitions
│   │   └── query.ts                # Query builder types
│   │
│   ├── middlewares/
│   │   ├── auth.ts                 # JWT verification & role-based guard
│   │   ├── globalErrorHandler.ts   # Centralized error handler
│   │   ├── handlePrismaError.ts    # Prisma error mapper
│   │   └── validateRequest.ts      # Zod schema validation middleware
│   │
│   ├── module/
│   │   ├── auth/                   # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   │
│   │   ├── notes/                  # Notes CRUD module
│   │   │   ├── note.controller.ts
│   │   │   ├── note.interface.ts
│   │   │   ├── note.route.ts
│   │   │   ├── note.service.ts
│   │   │   └── note.validation.ts
│   │   │
│   │   └── admin/                  # Admin panel module
│   │       ├── admin.controller.ts
│   │       ├── admin.interface.ts
│   │       ├── admin.route.ts
│   │       └── admin.service.ts
│   │
│   └── utils/
│       ├── catchAsync.ts           # Async error wrapper
│       ├── jwt.ts                  # JWT sign & verify helpers
│       ├── queryBuilder.ts         # Generic query builder for pagination/search/filter/sort
│       └── sendResponse.ts         # Standardized JSON response helper
│
├── Dockerfile
├── docker-compose.yml
├── prisma.config.ts                # Prisma CLI configuration
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

---

## Features

- **JWT Authentication** — Access + Refresh token rotation with session management
- **Role-Based Access Control** — USER and ADMIN roles with route-level guards
- **CRUD Operations** — Full note management (Create, Read, Update, Delete)
- **Input Validation** — Zod-based schema validation at middleware level
- **Error Handling** — Centralized global error handler supporting Prisma, Zod, and App errors
- **Pagination & Search** — Generic QueryBuilder with pagination, text search, field filter, and sort
- **Refresh Token Rotation** — Old token invalidated on each refresh (session-based)
- **Swagger Documentation** — Interactive API docs at `/api-docs`
- **Docker Support** — Full containerization with PostgreSQL
- **Admin Dashboard** — Role management, user listing, and statistics
- **Type Safety** — Strict TypeScript with full type coverage

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) `npm install -g pnpm`
- [PostgreSQL](https://www.postgresql.org/) 15+ (or use Docker)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/rakibul263/Note-API.git
cd Note-API

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secrets

# 4. Generate Prisma client
npx prisma generate

# 5. Run migrations
npx prisma migrate dev

# 6. (Optional) Seed admin user
npx prisma db seed

# 7. Start development server
pnpm dev
```

The API will be available at `http://localhost:3000`.  
Swagger UI at `http://localhost:3000/api-docs`.  
Admin credentials: `admin@shuvo.com` / `admin123`.

---

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/notes_api?sslmode=require"

# JWT
JWT_ACCESS_SECRET=your-access-token-secret
JWT_ACCESS_EXPIRES_IN=7D
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30D

# Security
BCRYPT_SALT_ROUNDS=10
```

---

## API Reference

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2026-07-23T12:00:00.000Z",
    "updatedAt": "2026-07-23T12:00:00.000Z"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Login Successful.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "USER"
    }
  }
}
```

> The `refreshToken` is also set as an `httpOnly` cookie.

#### Refresh Token

```http
POST /api/auth/refresh-token
Cookie: refreshToken=<token>
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Access token generated successfully.",
  "data": { "accessToken": "eyJhbGciOiJIUzI1NiIs..." }
}
```

> A new `refreshToken` cookie is also set (rotation).

#### Logout

```http
POST /api/auth/logout
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### Notes (Authenticated)

All note endpoints require a valid JWT in the `Authorization` header:

```http
Authorization: Bearer <accessToken>
```

#### Create Note

```http
POST /api/notes
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "My Note",
  "content": "This is the content of my note."
}
```

**Response** `201 Created`

#### Get All Notes (Paginated)

```http
GET /api/notes?page=1&limit=10&search=keyword&sortBy=createdAt&sortOrder=desc
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Data Fetch Successfully.",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Get Single Note

```http
GET /api/notes/1
```

#### Update Note

```http
PATCH /api/notes/1
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Note

```http
DELETE /api/notes/1
```

---

### Admin (ADMIN Only)

All admin endpoints require `Authorization: Bearer <admin-token>` and the user must have `role: "ADMIN"`.

#### Dashboard Stats

```http
GET /api/admin/dashboard
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully",
  "data": {
    "totalUsers": 10,
    "totalNotes": 45,
    "adminCount": 1,
    "userCount": 9
  }
}
```

#### List Users (Paginated)

```http
GET /api/admin/users?page=1&limit=10&search=john&role=ADMIN&sortBy=createdAt&sortOrder=desc
```

#### Update User Role

```http
PATCH /api/admin/users/1/role
Content-Type: application/json

{
  "role": "ADMIN"
}
```

#### Delete User

```http
DELETE /api/admin/users/1
```

---

## Authentication & Authorization

### Flow

```
                  ┌─────────────────────┐
                  │    POST /auth/login  │
                  └──────────┬──────────┘
                             │
                             ▼
               ┌─────────────────────────┐
               │  Validate credentials   │
               └──────────┬──────────────┘
                          │
                          ▼
               ┌─────────────────────────┐
               │  Create JWT tokens      │
               │  + store session in DB  │
               └──────────┬──────────────┘
                          │
                          ▼
           ┌─────────────────────────────┐
           │  Response: accessToken      │
           │  Cookie: refreshToken       │
           └─────────────────────────────┘
                          │
                          ▼
              ┌──────────────────────────┐
              │  Client sends accessToken│
              │  in Authorization header │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Auth middleware:        │
              │  1. Verify JWT           │
              │  2. Check role (if any)  │
              │  3. Set req.user         │
              └──────────────────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Route handler executes  │
              └──────────────────────────┘
```

### Token Refresh Flow

```
POST /api/auth/refresh-token
         │
         ▼
  ┌──────────────────────┐
  │  Read refreshToken   │
  │  from httpOnly cookie│
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │  Find session in DB  │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │  Delete old session  │
  │  (invalidate token)  │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │  Verify JWT          │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │  Find user           │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │  Create new tokens   │
  │  + new DB session    │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │  Response: accessToken│
  │  Cookie: new refreshToken│
  └──────────────────────┘
```

### Role Guard

| `auth()`         | Any authenticated user           |
| ---------------- | -------------------------------- |
| `auth("ADMIN")`  | Only ADMIN role                  |
| `auth("USER")`   | Only USER role                   |

---

## Query Parameters

Available on `GET /api/notes` and `GET /api/admin/users`:

| Parameter   | Type    | Default        | Description                  |
| ----------- | ------- | -------------- | ---------------------------- |
| `page`      | integer | `1`            | Page number                  |
| `limit`     | integer | `10`           | Items per page               |
| `search`    | string  | —              | Search across text fields    |
| `sortBy`    | string  | `createdAt`    | Field to sort by             |
| `sortOrder` | enum    | `desc`         | `asc` or `desc`              |
| `role`      | string  | —              | Filter by role (admin only)  |

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Validation Error",
  "errorSources": [
    {
      "path": "title",
      "message": "title is required"
    }
  ],
  "stack": "Error stack trace (development only)"
}
```

### Error Types

| Scenario                  | Status Code | Error Source           |
| ------------------------- | ----------- | ---------------------- |
| Validation failure        | 400         | Zod                    |
| Unauthorized (no token)   | 401         | Auth middleware         |
| Forbidden (wrong role)    | 403         | Auth middleware         |
| Not found                 | 404         | AppError / Prisma P2025 |
| Duplicate title/email     | 409         | Prisma P2002            |
| Database error            | 500         | Prisma                  |
| Unexpected error          | 500         | Generic Error           |

---

## Docker

### Prerequisites

- Docker and Docker Compose

### Setup

```bash
# 1. Set JWT secrets in your shell or .env
export JWT_ACCESS_SECRET=your-secret
export JWT_REFRESH_SECRET=your-secret

# 2. Build and start
docker compose up -d

# 3. Apply migrations
docker compose exec app npx prisma migrate deploy

# 4. Seed admin user
docker compose exec app npx prisma db seed

# 5. Check logs
docker compose logs -f app
```

### Services

| Service | Port      | Description           |
| ------- | --------- | --------------------- |
| `app`   | `3000`    | Node.js API           |
| `db`    | `5433`    | PostgreSQL 17         |

### Commands

```bash
docker compose up -d          # Start services
docker compose down           # Stop services
docker compose up -d --build  # Rebuild and start
docker compose logs -f        # Tail logs
docker compose exec app sh    # Shell into app container
```

---

## Testing with Insomnia

### Import Collection

1. Open Insomnia
2. `Ctrl + ,` → **Data** tab → **Import Data**
3. Paste the JSON below:

<details>
<summary>Click to expand Insomnia import JSON</summary>

```json
{"_type":"export","__export_format":4,"__export_date":"2026-07-23T00:00:00.000Z","__export_source":"notes-api","resources":[{"_id":"req_register","_type":"request","parentId":"wrk_notes","name":"Register","method":"POST","url":"{{base_url}}/api/auth/register","body":{"mimeType":"application/json","text":"{\n\t\"name\": \"John Doe\",\n\t\"email\": \"user@example.com\",\n\t\"password\": \"password123\"\n}"},"parameters":[],"headers":[{"name":"Content-Type","value":"application/json"}],"authentication":{},"metaSortKey":-100},{"_id":"req_login","_type":"request","parentId":"wrk_notes","name":"Login","method":"POST","url":"{{base_url}}/api/auth/login","body":{"mimeType":"application/json","text":"{\n\t\"email\": \"user@example.com\",\n\t\"password\": \"password123\"\n}"},"parameters":[],"headers":[{"name":"Content-Type","value":"application/json"}],"authentication":{},"metaSortKey":-200},{"_id":"req_create_note","_type":"request","parentId":"wrk_notes","name":"Create Note","method":"POST","url":"{{base_url}}/api/notes","body":{"mimeType":"application/json","text":"{\n\t\"title\": \"My Note\",\n\t\"content\": \"This is the content of my note.\"\n}"},"parameters":[],"headers":[{"name":"Content-Type","value":"application/json"}],"authentication":{"type":"bearer","token":"{{accessToken}}"},"metaSortKey":-300},{"_id":"req_notes","_type":"request","parentId":"wrk_notes","name":"Get Notes","method":"GET","url":"{{base_url}}/api/notes","body":{},"parameters":[{"name":"page","value":"1"},{"name":"limit","value":"10"}],"headers":[],"authentication":{"type":"bearer","token":"{{accessToken}}"},"metaSortKey":-400},{"_id":"wrk_notes","_type":"workspace","name":"Notes API","parentId":null,"_format":"json"},{"_id":"env_notes","_type":"environment","parentId":"wrk_notes","name":"Local","data":{"base_url":"http://localhost:3000","accessToken":""},"dataPropertyOrder":{"&":"a"}}]}
```

</details>

### Manual Testing

| Endpoint              | Method | URL                                      | Auth Required |
| --------------------- | ------ | ---------------------------------------- | ------------- |
| Register              | POST   | `http://localhost:3000/api/auth/register` | No            |
| Login                 | POST   | `http://localhost:3000/api/auth/login`    | No            |
| Create Note           | POST   | `http://localhost:3000/api/notes`         | Yes           |
| Get Notes (paginated) | GET    | `http://localhost:3000/api/notes?page=1`  | Yes           |
| Get Note              | GET    | `http://localhost:3000/api/notes/1`       | Yes           |
| Update Note           | PATCH  | `http://localhost:3000/api/notes/1`       | Yes           |
| Delete Note           | DELETE | `http://localhost:3000/api/notes/1`       | Yes           |
| Dashboard Stats       | GET    | `http://localhost:3000/api/admin/dashboard`| Yes (ADMIN)   |
| List Users            | GET    | `http://localhost:3000/api/admin/users`   | Yes (ADMIN)   |

---

## Database Migrations

```bash
# Create a new migration after schema changes
npx prisma migrate dev --name description_of_change

# Apply migrations in production
npx prisma migrate deploy

# Reset database (drops all data)
npx prisma migrate reset --force

# Generate Prisma client after schema changes
npx prisma generate
```

### Seed Data

```bash
# Seed admin user
npx prisma db seed
# Creates: admin@shuvo.com / admin123
```

---

## Linting & Code Quality

```bash
# TypeScript type check
npx tsc --noEmit

# Build
pnpm build
```

---

## License

ISC

---

<div align="center">
  <p>Built with ❤️ using Express.js, Prisma, PostgreSQL, and TypeScript</p>
  <p>
    <a href="https://github.com/rakibul263/Note-API">GitHub</a>
  </p>
</div>