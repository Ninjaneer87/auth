import { Router, type IRouter } from 'express';
import type { AuthDependencies } from '@/types';

export function createAuthRouter(deps: AuthDependencies): IRouter {
  void deps;

  const router = Router();

  router.get('/', (_req, res) => {
    res.json({ message: '@andrejground/auth' });
  });

  return router;
}
