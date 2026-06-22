import { createAuthRouter } from '@andrejground/auth';
import cors from 'cors';
import express, { type Express } from 'express';
import { env } from '@/config/env';
import { db } from '@/db';
import { healthRouter } from '@/routes/health';

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ message: 'Auth API' });
  });

  app.use('/health', healthRouter);
  app.use('/auth', createAuthRouter({ db }));

  return app;
}
