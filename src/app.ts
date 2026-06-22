import express, { type Express } from 'express';
import { healthRouter } from './routes/health.js';

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ message: 'Auth API' });
  });

  app.use('/health', healthRouter);

  return app;
}
