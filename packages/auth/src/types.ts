import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type * as schema from '@/schema';

export type AuthDatabase = PostgresJsDatabase<typeof schema>;

export type AuthDependencies = {
  db: AuthDatabase;
};

export type AuthRouterOptions = {
  basePath?: string;
};
