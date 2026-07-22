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

## Testing with Insomnia

### Import into Insomnia

1. Open Insomnia
2. Go to **Application > Preferences > Data** (or press `Ctrl+,`)
3. Under **Import Data**, select **From File** or paste the raw JSON below
4. All endpoints will be available in a **Notes API** collection

<details>
<summary>Click to expand Insomnia import JSON</summary>

```json
{"_type":"export","__export_format":4,"__export_date":"2026-07-23T00:00:00.000Z","__export_source":"notes-api.readme","resources":[{"_id":"req_notes_create","_type":"request","parentId":"wrk_notes","name":"Create Note","method":"POST","url":"{{base_url}}/api/notes","body":{"mimeType":"application/json","text":"{\n\t\"title\": \"My Note\",\n\t\"content\": \"This is the content of my note.\"\n}"},"parameters":[],"headers":[{"name":"Content-Type","value":"application/json"}],"authentication":{},"metaSortKey":-100},{"_id":"req_notes_list","_type":"request","parentId":"wrk_notes","name":"Get All Notes","method":"GET","url":"{{base_url}}/api/notes","body":{"mimeType":"application/json","text":""},"parameters":[],"headers":[],"authentication":{},"metaSortKey":-200},{"_id":"req_notes_get","_type":"request","parentId":"wrk_notes","name":"Get Single Note","method":"GET","url":"{{base_url}}/api/notes/1","body":{"mimeType":"application/json","text":""},"parameters":[],"headers":[],"authentication":{},"metaSortKey":-300},{"_id":"req_notes_update","_type":"request","parentId":"wrk_notes","name":"Update Note","method":"PATCH","url":"{{base_url}}/api/notes/1","body":{"mimeType":"application/json","text":"{\n\t\"title\": \"Updated Title\",\n\t\"content\": \"Updated content\"\n}"},"parameters":[],"headers":[{"name":"Content-Type","value":"application/json"}],"authentication":{},"metaSortKey":-400},{"_id":"req_notes_delete","_type":"request","parentId":"wrk_notes","name":"Delete Note","method":"DELETE","url":"{{base_url}}/api/notes/1","body":{"mimeType":"application/json","text":""},"parameters":[],"headers":[],"authentication":{},"metaSortKey":-500},{"_id":"wrk_notes","_type":"workspace","name":"Notes API","parentId":null,"_format":"json"},{"_id":"env_notes","_type":"environment","parentId":"wrk_notes","name":"Base URL","data":{"base_url":"http://localhost:3000"},"dataPropertyOrder":{"&":"97b0f4ea-4615-49c6-bbb5-e2aeee474070"}}]}
```

</details>

### Environment Setup

Create an environment variable in Insomnia:

| Key        | Value                    |
| ---------- | ------------------------ |
| base_url   | `http://localhost:3000`  |

Go to **Manage Environments** (top-left dropdown) and add `base_url`.

### Manual Testing Steps

| Endpoint            | Method | URL                         | Body (JSON)                                      |
| ------------------- | ------ | --------------------------- | ------------------------------------------------ |
| **Create Note**     | POST   | `http://localhost:3000/api/notes` | `{ "title": "My Note", "content": "Hello" }`    |
| **Get All Notes**   | GET    | `http://localhost:3000/api/notes` | —                                                |
| **Get Single Note** | GET    | `http://localhost:3000/api/notes/1` | —                                            |
| **Update Note**     | PATCH  | `http://localhost:3000/api/notes/1` | `{ "title": "Updated", "content": "New" }` |
| **Delete Note**     | DELETE | `http://localhost:3000/api/notes/1` | —                                            |

> **Note:** Ensure the server is running (`pnpm dev`) before sending requests.

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
