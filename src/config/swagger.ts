import { OpenAPIV3 } from "openapi-types";

const swaggerDoc: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Notes API",
    version: "1.0.0",
    description:
      "RESTful API for managing notes with authentication and admin panel.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://note-api-production-4a86.up.railway.app",
      description: "Production server (Railway)",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Note: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          content: { type: "string" },
          userId: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["ADMIN", "USER"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          page: { type: "integer" },
          limit: { type: "integer" },
          total: { type: "integer" },
          totalPages: { type: "integer" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errorSources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
      CreateNoteInput: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string", example: "My Note" },
          content: { type: "string", example: "Note content here" },
        },
      },
      UpdateNoteInput: {
        type: "object",
        properties: {
          title: { type: "string", example: "Updated Title" },
          content: { type: "string", example: "Updated content" },
        },
      },
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "user@example.com" },
          password: {
            type: "string",
            format: "password",
            example: "password123",
            minLength: 8,
          },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", format: "password", example: "password123" },
        },
      },
      UpdateRoleInput: {
        type: "object",
        required: ["role"],
        properties: {
          role: {
            type: "string",
            enum: ["ADMIN", "USER"],
            example: "ADMIN",
          },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        accessToken: { type: "string" },
                        refreshToken: { type: "string" },
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        responses: {
          "200": {
            description: "Access token generated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        accessToken: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Invalid refresh token" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        responses: {
          "200": {
            description: "Logged out successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/notes": {
      get: {
        tags: ["Notes"],
        summary: "Get all notes (paginated)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "integer" } },
          { in: "query", name: "limit", schema: { type: "integer" } },
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "sortBy", schema: { type: "string" } },
          {
            in: "query",
            name: "sortOrder",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: {
          "200": {
            description: "Notes fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Note" },
                    },
                    meta: { $ref: "#/components/schemas/PaginationMeta" },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        tags: ["Notes"],
        summary: "Create a new note",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateNoteInput" },
            },
          },
        },
        responses: {
          "201": { description: "Note created successfully" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/notes/{id}": {
      get: {
        tags: ["Notes"],
        summary: "Get a single note",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Note fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Note" },
                  },
                },
              },
            },
          },
          "404": { description: "Note not found" },
        },
      },
      patch: {
        tags: ["Notes"],
        summary: "Update a note",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateNoteInput" },
            },
          },
        },
        responses: {
          "200": { description: "Note updated successfully" },
          "404": { description: "Note not found" },
        },
      },
      delete: {
        tags: ["Notes"],
        summary: "Delete a note",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Note deleted successfully" },
          "404": { description: "Note not found" },
        },
      },
    },
    "/api/admin/dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Get dashboard statistics",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Dashboard stats",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalUsers: { type: "integer" },
                    totalNotes: { type: "integer" },
                    adminCount: { type: "integer" },
                    userCount: { type: "integer" },
                  },
                },
              },
            },
          },
          "403": { description: "Forbidden — admin only" },
        },
      },
    },
    "/api/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Get all users (paginated)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "integer" } },
          { in: "query", name: "limit", schema: { type: "integer" } },
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "role", schema: { type: "string" } },
          { in: "query", name: "sortBy", schema: { type: "string" } },
          {
            in: "query",
            name: "sortOrder",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: {
          "200": {
            description: "Users fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                    meta: { $ref: "#/components/schemas/PaginationMeta" },
                  },
                },
              },
            },
          },
          "403": { description: "Forbidden — admin only" },
        },
      },
    },
    "/api/admin/users/{id}/role": {
      patch: {
        tags: ["Admin"],
        summary: "Update user role",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateRoleInput" },
            },
          },
        },
        responses: {
          "200": { description: "User role updated" },
          "400": { description: "Invalid role" },
          "403": { description: "Forbidden — admin only" },
          "404": { description: "User not found" },
        },
      },
    },
    "/api/admin/users/{id}": {
      delete: {
        tags: ["Admin"],
        summary: "Delete a user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "User deleted" },
          "403": { description: "Forbidden — admin only" },
          "404": { description: "User not found" },
        },
      },
    },
  },
};

export default swaggerDoc;