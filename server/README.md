# Nevernote Server

Backend API server for Nevernote - A GraphQL-based API built with TypeScript, Express, Apollo Server, and TypeORM.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Development](#development)

## 🔍 Overview

This server provides a GraphQL API for the Nevernote application, handling:

- User authentication with JWT tokens
- CRUD operations for notes
- Real-time token refresh mechanism
- Database management with TypeORM
- Secure password hashing with bcrypt

## 🚀 Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Apollo Server Express** - GraphQL server
- **TypeGraphQL** - GraphQL schema and resolvers with TypeScript decorators
- **TypeORM** - Object-Relational Mapping for database operations
- **MySQL** - Relational database
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie parsing middleware
- **cors** - Cross-Origin Resource Sharing
- **morgan** - HTTP request logger
- **dotenv** - Environment variable management

## 📦 Prerequisites

- **Node.js** v14 or higher
- **Yarn** or **npm**
- **MySQL** database (or Docker for containerized setup)
- **Docker & Docker Compose** (optional, for database)

## 🛠 Installation

1. **Install dependencies**

   ```bash
   yarn install
   # or
   npm install
   ```

2. **Set up environment variables**

   Create a `.env` file in the server directory:

   ```env
   PORT=4000
   ACCESS_TOKEN_SECRET=your_secure_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_secure_refresh_token_secret_here
   JWT_COOKIE=nevernote_jwt
   ```

3. **Configure database**

   Update `ormconfig.json` if you need custom database settings:

   ```json
   {
     "type": "mysql",
     "host": "localhost",
     "port": 3306,
     "username": "test",
     "password": "test",
     "database": "test",
     "synchronize": true,
     "logging": false
   }
   ```

## ⚙️ Configuration

### Environment Variables

| Variable               | Description               | Default       | Required |
| ---------------------- | ------------------------- | ------------- | -------- |
| `PORT`                 | Server port               | 4000          | No       |
| `ACCESS_TOKEN_SECRET`  | Secret for access tokens  | -             | Yes      |
| `REFRESH_TOKEN_SECRET` | Secret for refresh tokens | -             | Yes      |
| `JWT_COOKIE`           | Name of JWT cookie        | nevernote_jwt | No       |

### Database Configuration (ormconfig.json)

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "test",
  "password": "test",
  "database": "test",
  "synchronize": true,
  "logging": false,
  "entities": ["src/entity/**/*.ts"],
  "migrations": ["src/migration/**/*.ts"],
  "subscribers": ["src/subscriber/**/*.ts"]
}
```

⚠️ **Warning**: `synchronize: true` is for development only. Set to `false` in production and use migrations.

### CORS Configuration

The server accepts requests from:

- `http://localhost:3000` (React development server)
- `https://studio.apollographql.com` (Apollo Studio)

To add more origins, update the CORS configuration in `src/index.ts`.

## 🏃 Running the Server

### Development Mode

**Option 1: Using Docker for Database**

```bash
# Terminal 1: Start database
yarn start:db
# or
npm run start:db

# Terminal 2: Start development server
yarn start
# or
npm start
```

**Option 2: Using Local MySQL**

1. Ensure MySQL is running on `localhost:3306`
2. Create database: `CREATE DATABASE test;`
3. Start the server:
   ```bash
   yarn start
   # or
   npm start
   ```

The server will start with hot-reloading enabled via nodemon.

### Accessing the Server

- **GraphQL Playground**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/
- **Refresh Token Endpoint**: http://localhost:4000/refresh-token

## 📚 API Documentation

### GraphQL Schema

The API is accessible at `http://localhost:4000/graphql`

#### User Types

```graphql
type User {
  id: String!
  email: String!
  created_At: String!
  updated_At: String!
}

type LoginResponse {
  access_token: String!
  user: User!
}
```

#### Note Types

```graphql
type Note {
  id: String!
  title: String!
  content: String!
  created_By: User!
  created_At: String!
  updated_At: String!
}
```

### Mutations

#### User Mutations

**Signup**

```graphql
mutation Signup($email: String!, $password: String!) {
  signup(email: $email, password: $password) {
    id
    email
    created_At
  }
}
```

**Login**

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    access_token
    user {
      id
      email
    }
  }
}
```

**Logout**

```graphql
mutation Logout {
  logout
}
```

#### Note Mutations

**Add Note**

```graphql
mutation AddNote($title: String!, $content: String!) {
  addNote(title: $title, content: $content) {
    id
    title
    content
    created_At
    updated_At
  }
}
```

**Update Note**

```graphql
mutation UpdateNote($id: String!, $title: String, $content: String) {
  updateNote(id: $id, title: $title, content: $content) {
    id
    title
    content
    updated_At
  }
}
```

**Delete Note**

```graphql
mutation DeleteNote($id: String!) {
  deleteNote(id: $id)
}
```

### Queries

**Get Current User**

```graphql
query Me {
  me {
    id
    email
    created_At
  }
}
```

**List Notes**

```graphql
query ListNotes {
  listNotes {
    id
    title
    content
    created_By {
      email
    }
    created_At
    updated_At
  }
}
```

### REST Endpoints

**POST /refresh-token**

Refreshes the access token using the refresh token stored in cookies.

**Request:**

- Cookie: `nevernote_jwt` (refresh token)

**Response:**

```json
{
  "success": true,
  "access_token": "new_access_token_here"
}
```

## 🗄️ Database

### Entities

#### User Entity

- `id`: UUID (Primary Key)
- `email`: String (Unique, Not Null)
- `password`: String (Hashed, Not Null)
- `token_version`: Integer (default: 0) - Used for token invalidation
- `created_At`: Timestamp (Auto-generated)
- `updated_At`: Timestamp (Auto-updated)

#### Note Entity

- `id`: UUID (Primary Key)
- `title`: String (Not Null)
- `content`: Long Text (Not Null)
- `created_By`: Foreign Key → User (Many-to-One)
- `created_At`: Timestamp (Auto-generated)
- `updated_At`: Timestamp (Auto-updated)

### Database Services

The `docker-compose.yml` provides two services:

**MySQL Database**

- Image: mysql:5.7.10
- Port: 3306
- Credentials:
  - Root Password: admin
  - User: test
  - Password: test
  - Database: test

**Adminer (Database UI)**

- Image: adminer:latest
- Port: 8080
- Access at: http://localhost:8080

### TypeORM Commands

```bash
# Generate a new migration
npx typeorm migration:generate -n MigrationName

# Run migrations
npx typeorm migration:run

# Revert last migration
npx typeorm migration:revert
```

## 🔐 Authentication

### JWT Token System

The API uses a dual-token authentication system:

#### Access Token

- **Lifetime**: 15 minutes
- **Storage**: Memory (client-side)
- **Purpose**: API authorization
- **Header**: `Authorization: Bearer <access_token>`

#### Refresh Token

- **Lifetime**: 7 days
- **Storage**: HTTP-only cookie
- **Purpose**: Generate new access tokens
- **Security**: Protected against XSS attacks

### Authentication Flow

1. User logs in with email/password
2. Server validates credentials
3. Server generates:
   - Access token (sent in response body)
   - Refresh token (sent as HTTP-only cookie)
4. Client stores access token in memory
5. Client includes access token in GraphQL requests
6. When access token expires:
   - Client calls `/refresh-token` endpoint
   - Server validates refresh token from cookie
   - Server issues new access token
7. On logout:
   - Refresh token cookie is cleared
   - Access token is discarded client-side

### Token Revocation

To revoke all tokens for a user, increment their `token_version`:

```typescript
await User.update({ id: userId }, { token_version: user.token_version + 1 });
```

## 📁 Project Structure

```
server/
├── src/
│   ├── constants/
│   │   └── strings.ts          # Application constants (PORT, secrets, etc.)
│   │
│   ├── entity/
│   │   ├── User.ts             # User entity model
│   │   └── Note.ts             # Note entity model
│   │
│   ├── graphql/
│   │   ├── UserResolver.ts     # User queries and mutations
│   │   └── NoteResolver.ts     # Note queries and mutations
│   │
│   ├── helpers/
│   │   ├── generateToken.ts    # JWT token generation functions
│   │   └── isAuth.ts           # Authentication middleware
│   │
│   ├── migration/              # Database migrations
│   │
│   └── index.ts                # Application entry point
│
├── docker-compose.yml          # Docker services configuration
├── Dockerfile                  # Server container image
├── ormconfig.json             # TypeORM configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

### Key Files

**`src/index.ts`**

- Express server setup
- Apollo Server configuration
- Middleware registration
- Database connection
- Token refresh endpoint

**`src/constants/strings.ts`**

- Environment variables
- Application constants
- Secret keys

**`src/helpers/isAuth.ts`**

- Authentication middleware
- Token verification
- Context injection

**`src/helpers/generateToken.ts`**

- Access token generation
- Refresh token generation
- Token signing with secrets

## 💻 Development

### Available Scripts

```bash
# Start database services (Docker)
yarn start:db

# Start development server with hot-reload
yarn start

# Run TypeScript compiler (check for errors)
npx tsc --noEmit
```

### Adding New Features

#### 1. Create Entity

```typescript
// src/entity/NewEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class NewEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;
}
```

#### 2. Create Resolver

```typescript
// src/graphql/NewEntityResolver.ts
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { NewEntity } from "../entity/NewEntity";

@Resolver()
export class NewEntityResolver {
  @Query(() => [NewEntity])
  async getEntities(): Promise<NewEntity[]> {
    return await NewEntity.find();
  }

  @Mutation(() => NewEntity)
  async createEntity(@Arg("name") name: string): Promise<NewEntity> {
    const entity = NewEntity.create({ name });
    await entity.save();
    return entity;
  }
}
```

#### 3. Register Resolver

```typescript
// src/index.ts
import { NewEntityResolver } from "./graphql/NewEntityResolver";

const apolloServer = new ApolloServer({
  schema: await buildSchema({
    resolvers: [UserResolver, NoteResolver, NewEntityResolver],
  }),
  // ...
});
```

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use async/await for asynchronous operations
- Use TypeGraphQL decorators for schema definition
- Keep resolvers thin, move business logic to services

### Debugging

**Enable SQL Logging**
Set `logging: true` in `ormconfig.json` to see all SQL queries.

**Debug Mode**
Add breakpoints in VS Code and use the Node.js debugger:

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["src/index.ts"],
      "cwd": "${workspaceFolder}/server"
    }
  ]
}
```

## 🐛 Troubleshooting

### Database Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution**: Ensure MySQL is running

```bash
docker-compose ps
# or
brew services list | grep mysql
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution**: Kill the process using port 4000

```bash
lsof -ti:4000 | xargs kill -9
```

### TypeORM Entities Not Found

```
Error: No metadata for "User" was found
```

**Solution**: Ensure `synchronize: true` in `ormconfig.json` or run migrations

### JWT Verification Failed

```
Error: JsonWebTokenError: invalid token
```

**Solution**: Check that `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` match between server restarts

### CORS Errors

```
Access to fetch at 'http://localhost:4000/graphql' from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Solution**: Add the origin to the CORS whitelist in `src/index.ts`

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong secrets** - Generate with `openssl rand -base64 64`
3. **Set `synchronize: false` in production** - Use migrations instead
4. **Validate all inputs** - Add validation decorators
5. **Rate limit endpoints** - Implement rate limiting for auth endpoints
6. **Use HTTPS in production** - Terminate SSL at load balancer or reverse proxy
7. **Keep dependencies updated** - Run `yarn upgrade --latest` regularly

## 📝 Testing

### GraphQL Playground Examples

**Test Signup**

```graphql
mutation {
  signup(email: "test@example.com", password: "password123") {
    id
    email
  }
}
```

**Test Login**

```graphql
mutation {
  login(email: "test@example.com", password: "password123") {
    access_token
    user {
      id
      email
    }
  }
}
```

**Test Protected Query**

1. First login to get access token
2. Add token to HTTP headers:
   ```json
   {
     "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE"
   }
   ```
3. Execute query:
   ```graphql
   query {
     me {
       id
       email
     }
     listNotes {
       id
       title
       content
     }
   }
   ```

## 🚀 Production Deployment

### Environment Setup

1. Set `synchronize: false` in `ormconfig.json`
2. Use environment variables for all secrets
3. Enable database SSL connections
4. Set up proper logging
5. Configure reverse proxy (nginx/Apache)
6. Use process manager (PM2)

### PM2 Deployment Example

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start dist/index.js --name nevernote-api

# Save process list
pm2 save

# Set up auto-restart on reboot
pm2 startup
```

## 📧 Support

For issues or questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the main project README
3. Open an issue on GitHub

---

**Built with ❤️ using TypeScript and GraphQL**
