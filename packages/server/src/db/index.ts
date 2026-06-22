import * as schema from '@andrejground/auth/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/config/env';

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });

export async function closeDb(): Promise<void> {
  await client.end();
}
