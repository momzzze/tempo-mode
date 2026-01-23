import type { RequestHandler } from 'express';
import logger from '../utils/logger.js';

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
      },
      'request'
    );
  });

  next();
};
