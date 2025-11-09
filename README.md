# Nevernote

A modern, full-stack note-taking application built with React, TypeScript, GraphQL, and Node.js. Nevernote provides a clean and intuitive interface for creating, editing, and managing your notes with real-time updates.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Development](#development)

## ✨ Features

- **User Authentication**: Secure JWT-based authentication with refresh token mechanism
- **Create & Edit Notes**: Rich text editor powered by React Quill
- **Real-time Updates**: Automatic saving with debounced updates
- **Responsive Design**: Modern UI with Emotion CSS-in-JS styling
- **GraphQL API**: Type-safe API with Apollo Server and Client
- **Database Persistence**: MySQL database with TypeORM
- **Dockerized**: Full Docker support for easy deployment

## 🚀 Tech Stack

### Backend

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **Apollo Server** - GraphQL server
- **TypeORM** - Database ORM
- **MySQL** - Database
- **JWT** - Authentication
- **TypeGraphQL** - GraphQL schema and resolvers with TypeScript

### Frontend

- **React** with **TypeScript**
- **Apollo Client** - GraphQL client
- **React Router** - Navigation
- **Emotion** - CSS-in-JS styling
- **React Quill** - Rich text editor
- **React Hook Form** - Form management
- **GraphQL Code Generator** - Type-safe GraphQL operations

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **Yarn** or **npm**
- **Docker** and **Docker Compose** (for containerized setup)
- **MySQL** (if running without Docker)

## 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Nevernote
   ```

2. **Install server dependencies**

   ```bash
   cd server
   yarn install
   # or
   npm install
   ```

3. **Install web dependencies**

   ```bash
   cd ../web
   yarn install
   # or
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `server` directory:

   ```env
   PORT=4000
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   JWT_COOKIE=nevernote_jwt
   ```

## 🏃 Running the Application

### Option 1: Using Docker (Recommended)

1. **Start the database**

   ```bash
   cd server
   yarn start:db
   # or
   npm run start:db
   ```

2. **Start the backend server** (in a new terminal)

   ```bash
   cd server
   yarn start
   # or
   npm start
   ```

3. **Start the frontend** (in a new terminal)
   ```bash
   cd web
   yarn start
   # or
   npm start
   ```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend GraphQL**: http://localhost:4000/graphql
- **Database Admin (Adminer)**: http://localhost:8080

### Option 2: Using Make Commands

```bash
# Build Docker images
make build-dev

# Run all services
make run-dev
```

### Option 3: Manual Setup

1. Ensure MySQL is running on `localhost:3306`
2. Create a database named `test`
3. Update `server/ormconfig.json` with your MySQL credentials
4. Run the backend and frontend as shown in Option 1

## 📁 Project Structure

```
Nevernote/
├── server/                 # Backend application
│   ├── src/
│   │   ├── constants/      # Application constants
│   │   ├── entity/         # TypeORM entities
│   │   │   ├── Note.ts     # Note entity
│   │   │   └── User.ts     # User entity
│   │   ├── graphql/        # GraphQL resolvers
│   │   │   ├── NoteResolver.ts
│   │   │   └── UserResolver.ts
│   │   ├── helpers/        # Utility functions
│   │   │   ├── generateToken.ts
│   │   │   └── isAuth.ts
│   │   ├── migration/      # Database migrations
│   │   └── index.ts        # Application entry point
│   ├── docker-compose.yml  # Docker services configuration
│   ├── Dockerfile         # Server Docker image
│   ├── ormconfig.json     # TypeORM configuration
│   ├── package.json
│   └── tsconfig.json
│
├── web/                    # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── GlobalStyles.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── ListNotesEditor.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── ...
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── graphql/        # GraphQL queries/mutations
│   │   ├── generated/      # Auto-generated types
│   │   ├── helper/         # Utility functions
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/            # Static assets
│   ├── Dockerfile        # Web Docker image
│   ├── codegen.yml       # GraphQL code generation config
│   ├── package.json
│   └── tsconfig.json
│
├── Makefile              # Build and run commands
└── README.md
```

## 🔌 API Documentation

### GraphQL Endpoints

The GraphQL API is available at `http://localhost:4000/graphql`

#### User Operations

- `signup(email: String!, password: String!): User` - Register a new user
- `login(email: String!, password: String!): LoginResponse` - Authenticate user
- `logout(): Boolean` - Logout user
- `me(): User` - Get current user

#### Note Operations

- `listNotes(): [Note!]!` - Get all notes for the current user
- `addNote(title: String!, content: String!): Note!` - Create a new note
- `updateNote(id: String!, title: String, content: String): Note` - Update a note
- `deleteNote(id: String!): Boolean` - Delete a note

### Authentication

The API uses JWT tokens for authentication:

- **Access Token**: Short-lived token sent in Authorization header
- **Refresh Token**: Long-lived token stored in HTTP-only cookie
- Token refresh endpoint: `POST http://localhost:4000/refresh-token`

## 🔐 Environment Variables

### Server (.env)

```env
# Server Configuration
PORT=4000

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
JWT_COOKIE=nevernote_jwt

# Database Configuration (if not using Docker defaults)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=test
DB_PASSWORD=test
DB_DATABASE=test
```

### Database Configuration

The default MySQL credentials (configured in `docker-compose.yml` and `ormconfig.json`):

- **Host**: localhost
- **Port**: 3306
- **Username**: test
- **Password**: test
- **Database**: test
- **Root Password**: admin

## 🐳 Docker Setup

### Services

The `docker-compose.yml` defines the following services:

1. **db_mysql** - MySQL 5.7.10 database

   - Port: 3306
   - Default credentials configured

2. **adminer** - Database management interface
   - Port: 8080
   - Access at http://localhost:8080

### Docker Commands

```bash
# Start database services
cd server
docker-compose up

# Stop services
docker-compose down

# Remove volumes (clean slate)
docker-compose down -v

# Build custom images
cd ..
make build-dev
```

## 💻 Development

### Backend Development

```bash
cd server

# Start database
yarn start:db

# Start development server (with hot reload)
yarn start
```

The server uses `nodemon` for automatic reloading on file changes.

### Frontend Development

```bash
cd web

# Start development server
yarn start

# Generate GraphQL types
yarn gen

# Run tests
yarn test

# Build for production
yarn build
```

### Code Generation

The frontend uses GraphQL Code Generator to create TypeScript types from GraphQL operations:

```bash
cd web
yarn gen
```

This will generate type-safe hooks and types in `src/generated/graphql.tsx`.

## 🗄️ Database Schema

### User Table

- `id` - UUID (Primary Key)
- `email` - String (Unique)
- `password` - String (Hashed)
- `token_version` - Integer (for refresh token invalidation)
- `created_At` - Timestamp
- `updated_At` - Timestamp

### Note Table

- `id` - UUID (Primary Key)
- `title` - String
- `content` - Long Text
- `created_By` - Foreign Key (User)
- `created_At` - Timestamp
- `updated_At` - Timestamp

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# Find and kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill -9
```

### Database Connection Issues

- Ensure MySQL is running: `docker-compose ps`
- Check credentials in `ormconfig.json` match `docker-compose.yml`
- Verify port 3306 is not blocked

### TypeORM Synchronize Warning

The `synchronize: true` option in `ormconfig.json` is for development only. Set to `false` in production and use migrations.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Happy Note-Taking! 📝**
