# Notes API

A RESTful API for managing notes built with **Express.js**, **Prisma ORM**, **PostgreSQL**, and **TypeScript**.

## Features

- **CRUD Operations** — Create, read, update, and delete notes
- **Input Validation** — Zod-based request validation middleware
- **Error Handling** — Centralized global error handler with support for Prisma and Zod errors
- **Unique Titles** — Title field enforces uniqueness at database level
- **Type Safety** — Full TypeScript support with strict mode

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Runtime          | Node.js                             |
| Framework        | Express.js                          |
| Language         | TypeScript                          |
| Database         | PostgreSQL                          |
| ORM              | Prisma ORM v7                       |
| Validation       | Zod                                 |
| Package Manager  | pnpm                                |

## Project Structure

```
src/
├── app.ts                          # Express app setup
├── server.ts                       # Entry point
├── config/
│   ├── env.ts                      # Environment variables
│   └── prisma.ts                   # Prisma client instance
├── errors/
│   ├── AppError.ts                 # Custom error class
│   └── handleZodError.ts           # Zod error formatter
├── interface/
│   └── error.ts                    # Error type definitions
├── middlewares/
│   ├── globalErrorHandler.ts       # Global error handler
│   ├── handlePrismaError.ts        # Prisma error handler
│   ├── validateRequest.ts          # Zod validation middleware
├── module/
│   └── notes/
│       ├── note.controller.ts      # Request handlers
│       ├── note.interface.ts       # TypeScript interfaces
│       ├── note.route.ts           # Route definitions
│       ├── note.service.ts         # Business logic
│       └── note.validation.ts      # Zod schemas
└── utils/
    ├── catchAsync.ts               # Async error wrapper
    └── sendResponse.ts              # Standardized response helper
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/rakibul263/Note-API.git
cd Note-API

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

```env
PORT=3000
DATABASE_URL="your-postgresql-connection-string"
NODE_ENV=development
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### Running the Server

```bash
# Development (hot reload)
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

## API Reference

### Create a Note

```http
POST /api/notes
Content-Type: application/json

{
  "title": "My Note",
  "content": "This is the content of my note."
}
```

**Response** `201 Created`

```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": 1,
    "title": "My Note",
    "content": "This is the content of my note.",
    "createdAt": "2026-07-22T19:51:57.309Z",
    "updatedAt": "2026-07-22T19:51:57.309Z"
  }
}
```

### Get All Notes

```http
GET /api/notes
```

### Get a Single Note

```http
GET /api/notes/:id
```

### Update a Note

```http
PATCH /api/notes/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### Delete a Note

```http
DELETE /api/notes/:id
```

### Error Response Format

```json
{
  "success": false,
  "message": "Validation Error",
  "errorSources": [
    {
      "path": "title",
      "message": "title is required"
    }
  ]
}
```

## Database Schema

```prisma
model Note {
  id        Int      @id @default(autoincrement())
  title     String   @unique
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `pnpm dev`        | Start dev server with hot reload  |
| `pnpm build`      | Compile TypeScript to JavaScript  |
| `pnpm start`      | Run compiled production build     |
| `pnpm prisma`     | Run Prisma CLI commands           |

## License

ISC
