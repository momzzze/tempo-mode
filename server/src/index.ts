import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import logger from './utils/logger.js';
import { requestLogger } from './middlewares/requestLogger.js';
import errorHandler from './middlewares/errorHandler.js';
import routes from './routes/index.js';
import { checkConnection } from './db/pool.js';
import { rateLimiter } from './middlewares/rateLimiter.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

// CORS configuration - allow multiple localhost ports in development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // In development, allow any localhost origin
      if (
        process.env.NODE_ENV !== 'production' &&
        origin.startsWith('http://localhost')
      ) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);
app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({ error: { message: 'Not Found' } });
});

app.use(errorHandler);

const server = app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
  // Check DB connectivity after server starts
  void checkConnection()
    .then((ok) => {
      if (ok) {
        logger.info('Database connected');
      } else {
        logger.error('Database connection failed');
      }
    })
    .catch((error) => {
      logger.error({ error }, 'Database connectivity check errored');
    });
});

// Graceful shutdown handlers
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    logger.info('Server closed, exiting process');
    process.exit(0);
  });

  // Force exit after 10 seconds if graceful shutdown doesn't complete
  setTimeout(() => {
    logger.error('Forced exit due to shutdown timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
