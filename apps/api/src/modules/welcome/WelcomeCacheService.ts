import { Logger } from "@astra/logger";
import { WelcomeModel } from "./WelcomeModel";
import redis from "../../utils/Cache";

const logger = Logger.getInstance({ title: "Welcome Cache Service" });
const CACHE_TTL = 60 * 5; // 5 minutes cache

export class WelcomeCacheService {
  static async getCachedWelcomes(guildId: string) {
    const cacheKey = `welcomes:${guildId}`;
    const cachedWelcomes = await redis.get(cacheKey);

    if (cachedWelcomes) {
      logger.info(`Cache hit for guild welcomes: ${guildId}`);
      return JSON.parse(cachedWelcomes);
    }

    const welcomes = await WelcomeModel.find({ guildId }).sort({
      createdAt: -1,
    });

    const result = {
      welcomes,
      count: welcomes.length,
    };

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
    logger.info(
      `Cached welcomes for guild ${guildId} for ${CACHE_TTL} seconds`
    );

    return result;
  }

  static async invalidateGuildCache(guildId: string) {
    await redis.del(`welcomes:${guildId}`);
    logger.info(`Invalidated cache for guild: ${guildId}`);
  }
}
