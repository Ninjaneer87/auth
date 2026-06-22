import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { closeDb } from "./db/index.js";
import { closeRedis, connectRedis } from "./redis/index.js";

async function main() {
  await connectRedis();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down...`);
    server.close();
    await closeRedis();
    await closeDb();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
