import { Router } from 'express';
import { sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { redis } from '../redis/index.js';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const checks = {
    database: 'unknown' as 'ok' | 'error' | 'unknown',
    redis: 'unknown' as 'ok' | 'error' | 'unknown',
  };

  try {
    await db.execute(sql`select 1`);
    checks.database = 'ok';
  } catch {
    checks.database = 'error';
  }

  try {
    await redis.ping();
    checks.redis = 'ok';
  } catch {
    checks.redis = 'error';
  }

  const healthy = checks.database === 'ok' && checks.redis === 'ok';

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    checks,
  });
});
