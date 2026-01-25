import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import logger from './utils/logger.js';
import { requestLogger } from './middlewares/requestLogger.js';
import errorHandler from './middlewares/errorHandler.js';
import routes from './routes/index.js';
import { checkConnection } from './db/pool.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());
app.use(requestLogger);
app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({ error: { message: 'Not Found' } });
});

app.use(errorHandler);

app.listen(port, () => {
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
