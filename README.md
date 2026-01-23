<div align="center">
  <img src="assets/tempo-mode-logo.png" alt="TempoMode Logo" width="200"/>
  
  # <span style="color: #00FF00; text-shadow: 0 0 15px #00FF00, 0 0 30px #00FF00;">TempoMode</span>
  
</div>

<p align="center">
  <span style="color: #B0E0E6;">A modern monorepo for time-based application management with a Node.js/Express backend and React frontend.</span>
</p>

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Tech Stack</span>

**<span style="color: #B0E0E6;">Backend</span>**

- <span style="color: #90EE90;">Node.js</span> 18+ with <span style="color: #90EE90;">TypeScript</span> (ESM)
- <span style="color: #90EE90;">Express.js</span> for REST API
- <span style="color: #90EE90;">PostgreSQL</span> for data persistence
- <span style="color: #90EE90;">Pino</span> for structured logging
- <span style="color: #90EE90;">Nodemon</span> for development

**<span style="color: #B0E0E6;">Frontend</span>**

- <span style="color: #90EE90;">React</span> 19 with <span style="color: #90EE90;">TypeScript</span>
- <span style="color: #90EE90;">Vite</span> as build tool
- <span style="color: #90EE90;">Tailwind CSS</span> for styling
- <span style="color: #90EE90;">shadcn/ui</span> for component library

**<span style="color: #B0E0E6;">Monorepo</span>**

- <span style="color: #90EE90;">pnpm</span> workspaces for package management

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Project Structure</span>

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

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Prerequisites</span>

- <span style="color: #90EE90;">Node.js</span> 18 or higher
- <span style="color: #90EE90;">pnpm</span> 9.x or higher
- <span style="color: #90EE90;">PostgreSQL</span> 12+ (optional for local development)

Install <span style="color: #90EE90;">pnpm</span> globally:

```bash
npm install -g pnpm
```

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Installation</span>

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd tempo-mode
pnpm install
```

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Configuration</span>

### <span style="color: #B0E0E6; text-shadow: 0 0 8px #B0E0E6;">Server Environment Setup</span>

Create a `.env` file in the `server/` directory:

```bash
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/tempo_mode
JWT_SECRET=your-secret-key-here
```

See `server/.env.example` for reference.

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Development</span>

### <span style="color: #B0E0E6; text-shadow: 0 0 8px #B0E0E6;">Start Development Servers</span>

Run both frontend and backend in development mode:

```bash
pnpm dev
```

This will:

- Start the <span style="color: #90EE90;">React</span> development server on `http://localhost:5173`
- Start the <span style="color: #90EE90;">Express</span> server on `http://localhost:4000`

### <span style="color: #B0E0E6; text-shadow: 0 0 8px #B0E0E6;">Individual Development</span>

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

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Building</span>

Build all packages:

```bash
pnpm build
```

Build specific package:

````bash
pnpm -C server build
## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Building</span>

Build all packages:

```bash
pnpm build
````

Build specific package:

```bash
pnpm -C server build
pnpm -C client build
```

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">API Documentation</span>

### <span style="color: #B0E0E6; text-shadow: 0 0 8px #B0E0E6;">Health Check</span>

Check server health and database connectivity.

**<span style="color: #90EE90;">Request</span>**

```
GET /api/health
```

**<span style="color: #90EE90;">Response</span>**

```json
{
  "status": "ok",
  "db": "up"
}
```

**<span style="color: #90EE90;">Status Codes</span>**

- `200` - Server and database healthy
- `503` - Database unavailable

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Testing with Postman</span>

A <span style="color: #90EE90;">Postman</span> collection is included for testing API endpoints.

**<span style="color: #B0E0E6; text-shadow: 0 0 8px #B0E0E6;">Import Collection</span>**

1. Open <span style="color: #90EE90;">Postman</span>
2. Click Import button
3. Select `TempoMode.postman_collection.json`
4. Create/select environment variable: `base_url=http://localhost:4000`

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Project Architecture</span>

### <span style="color: #B0E0E6; text-shadow: 0 0 8px #B0E0E6;">Backend Architecture</span>

**<span style="color: #90EE90;">Controllers</span>** - Handle HTTP requests and responses
**<span style="color: #90EE90;">Services</span>** - Contain business logic and data operations
**<span style="color: #90EE90;">Middlewares</span>** - Process requests and responses (logging, error handling)
**<span style="color: #90EE90;">Routes</span>** - Define API endpoints and map to controllers
**<span style="color: #90EE90;">Database</span>** - PostgreSQL connection pool and queries
**<span style="color: #90EE90;">Utils</span>** - Logger and shared utilities

### <span style="color: #B0E0E6; text-shadow: 0 0 8px #B0E0E6;">Frontend Architecture</span>

**<span style="color: #90EE90;">Components</span>** - Reusable UI components (shadcn/ui based)
**<span style="color: #90EE90;">Pages</span>** - Page-level components
**<span style="color: #90EE90;">Utils</span>** - Helper functions and constants
**<span style="color: #90EE90;">Hooks</span>** - Custom React hooks

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Logging</span>

Backend uses <span style="color: #90EE90;">Pino</span> for structured logging with automatic request logging. Each request logs:

- HTTP method
- Request URL
- Response status code
- Response time in milliseconds

Example log:

```
[INFO] GET /api/health 200 1.23ms
```

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Database</span>

<span style="color: #90EE90;">PostgreSQL</span> connection is managed through a connection pool in `server/src/db/pool.ts`.

Configure database connection via `DATABASE_URL` environment variable.

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Contributing</span>

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Scripts</span>

### <span style="color: #B0E0E6; text-shadow: 0 0 8px #B0E0E6;">Root Level</span>

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all packages
- `pnpm lint` - Run linters across workspaces

### <span style="color: #B0E0E6; text-shadow: 0 0 8px #B0E0E6;">Server</span>

- `pnpm -C server dev` - Start server with nodemon
- `pnpm -C server build` - Build TypeScript to dist/
- `pnpm -C server start` - Run compiled server

### <span style="color: #B0E0E6; text-shadow: 0 0 8px #B0E0E6;">Client</span>

- `pnpm -C client dev` - Start Vite dev server
- `pnpm -C client build` - Build for production
- `pnpm -C client preview` - Preview production build

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">License</span>

<span style="color: #90EE90;">MIT</span>

## <span style="color: #00FF00; text-shadow: 0 0 10px #00FF00;">Support</span>

For issues, questions, or contributions, please open an issue or contact the development team.
