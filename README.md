<div align="center">
  <img src="assets/tempo-logo.png" alt="TempoMode Logo" width="200"/>
  
  # TempoMode
  
  <img src="assets/tempo-text.png" alt="TempoMode Text" width="400"/>
</div>

<p align="center">
  A modern monorepo for time-based application management with a Node.js/Express backend and React frontend.
</p>

<div align="center">
  <img src="assets/tempo-icon.png" alt="TempoMode Icon" width="100"/>
</div>

## Tech Stack

**Backend**

- Node.js 18+ with TypeScript (ESM)
- Express.js for REST API
- PostgreSQL for data persistence
- Pino for structured logging
- Nodemon for development

**Frontend**

- React 19 with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- shadcn/ui for component library

**Monorepo**

- pnpm workspaces for package management

## Project Structure

```
tempo-mode/
├── client/                 # React frontend application
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/                 # Express backend application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── middlewares/   # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── db/            # Database configuration
│   │   ├── utils/         # Shared utilities
│   │   ├── app.ts         # Express app setup
│   │   └── index.ts       # Entry point
│   ├── nodemon.json       # Nodemon configuration
│   ├── tsconfig.json
│   └── package.json
├── .github/
│   └── copilot-instructions.md
├── pnpm-workspace.yaml
├── package.json
├── README.md
└── TempoMode.postman_collection.json
```

## Prerequisites

- Node.js 18 or higher
- pnpm 9.x or higher
- PostgreSQL 12+ (optional for local development)

Install pnpm globally:

```bash
npm install -g pnpm
```

## Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd tempo-mode
pnpm install
```

## Configuration

### Server Environment Setup

Create a `.env` file in the `server/` directory:

```bash
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/tempo_mode
JWT_SECRET=your-secret-key-here
```

See `server/.env.example` for reference.

## Development

### Start Development Servers

Run both frontend and backend in development mode:

```bash
pnpm dev
```

This will:

- Start the React development server on `http://localhost:5173`
- Start the Express server on `http://localhost:4000`

### Individual Development

Start only the backend:

```bash
cd server
pnpm dev
```

Start only the frontend:

```bash
cd client
pnpm dev
```

## Building

Build all packages:

```bash
pnpm build
```

Build specific package:

```bash
pnpm -C server build
pnpm -C client build
```

## API Documentation

### Health Check

Check server health and database connectivity.

**Request**

```
GET /api/health
```

**Response**

```json
{
  "status": "ok",
  "db": "up"
}
```

**Status Codes**

- `200` - Server and database healthy
- `503` - Database unavailable

## Testing with Postman

A Postman collection is included for testing API endpoints.

**Import Collection**

1. Open Postman
2. Click Import button
3. Select `TempoMode.postman_collection.json`
4. Create/select environment variable: `base_url=http://localhost:4000`

## Project Architecture

### Backend Architecture

**Controllers** - Handle HTTP requests and responses
**Services** - Contain business logic and data operations
**Middlewares** - Process requests and responses (logging, error handling)
**Routes** - Define API endpoints and map to controllers
**Database** - PostgreSQL connection pool and queries
**Utils** - Logger and shared utilities

### Frontend Architecture

**Components** - Reusable UI components (shadcn/ui based)
**Pages** - Page-level components
**Utils** - Helper functions and constants
**Hooks** - Custom React hooks

## Logging

Backend uses Pino for structured logging with automatic request logging. Each request logs:

- HTTP method
- Request URL
- Response status code
- Response time in milliseconds

Example log:

```
[INFO] GET /api/health 200 1.23ms
```

## Database

PostgreSQL connection is managed through a connection pool in `server/src/db/pool.ts`.

Configure database connection via `DATABASE_URL` environment variable.

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## Scripts

### Root Level

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all packages
- `pnpm lint` - Run linters across workspaces

### Server

- `pnpm -C server dev` - Start server with nodemon
- `pnpm -C server build` - Build TypeScript to dist/
- `pnpm -C server start` - Run compiled server

### Client

- `pnpm -C client dev` - Start Vite dev server
- `pnpm -C client build` - Build for production
- `pnpm -C client preview` - Preview production build

## License

MIT

## Support

For issues, questions, or contributions, please open an issue or contact the development team.
