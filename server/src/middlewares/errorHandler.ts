import type { ErrorRequestHandler } from 'express';
import logger from '../utils/logger.js';

type KnownError = Error & {
  status?: number;
  statusCode?: number;
  code?: string;
};

const errorHandler: ErrorRequestHandler = (
  err: KnownError,
  _req,
  res,
  _next
) => {
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message || 'Internal Server Error';

  if (status >= 500) {
    logger.error({ err }, 'Unhandled error');
  } else {
    logger.warn({ err }, 'Handled error');
  }

  res.status(status).json({ error: { message, code: err.code } });
};

export default errorHandler;
