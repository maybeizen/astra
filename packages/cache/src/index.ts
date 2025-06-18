import { Logger } from "@astra/logger";
import { Redis, type RedisOptions } from "ioredis";

const logger = Logger.getInstance({
  title: "Astra Cache",
  showTimestamp: false,
});

export interface CacheConfig {
  uri: string;
  options?: RedisOptions;
}

let client: Redis | null = null;

export async function connectToRedis(config: CacheConfig): Promise<Redis> {
  if (client) {
    return client;
  }

  try {
    client = new Redis(config.uri, config.options ?? {});

    logger.success(`Connected to Redis at <hl>${client.options.host}</hl>`);
    return client;
  } catch (error) {
    logger.error(`Error connecting to Redis: ${error}`);
    throw error;
  }
}

export async function disconnectFromRedis(): Promise<void> {
  if (!client) {
    return;
  }

  try {
    await client.quit();
    client = null;
    logger.success("Disconnected from Redis");
  } catch (error) {
    logger.error(`Error disconnecting from Redis: ${error}`);
    throw error;
  }
}

export { Redis };
