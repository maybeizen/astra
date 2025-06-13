import axios from "axios";
import dotenv from "dotenv";
import https from "https";
import { errorHandler } from "./error-handler";
import cache from "./cache";
import { FatalError } from "./errors/FatalError";

dotenv.config();

interface PterodactylStats {
  userCount: number;
  serverCount: number;
}

interface PterodactylInstance {
  url: string;
  apiKey: string | undefined;
}

export async function fetchPterodactylStats(): Promise<PterodactylStats> {
  try {
    const cacheKey = "pterodactyl_stats";
    const cachedData = cache.get(cacheKey);
    if (cachedData) return cachedData as PterodactylStats;

    const instances: PterodactylInstance[] = [
      {
        url: process.env.PTERODACTYL_API_URL || "https://netherpanel.com",
        apiKey: process.env.PTERODACTYL_API_KEY,
      },
      {
        url: "https://free.netherpanel.com",
        apiKey: process.env.FREE_PTERODACTYL_API_KEY,
      },
    ];

    for (const instance of instances) {
      if (!instance.apiKey) {
        console.error(`API key not found for ${instance.url}`);
        errorHandler.execute(
          new Error(`API key not found for ${instance.url}`)
        );
        throw new FatalError(`API key not found for ${instance.url}`);
      }
    }

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    const instanceResults = await Promise.all(
      instances.map(async (instance) => {
        try {
          const headers = {
            Authorization: `Bearer ${instance.apiKey}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          };

          const [userResponse, serverResponse] = await Promise.all([
            axios.get(`${instance.url}/api/application/users`, {
              headers,
              httpsAgent,
            }),
            axios.get(`${instance.url}/api/application/servers`, {
              headers,
              httpsAgent,
            }),
          ]);

          console.log(
            `[PTERODACTYL] ${instance.url} - ${userResponse.data.meta.pagination.total} users, ${serverResponse.data.meta.pagination.total} servers`
          );

          return {
            userCount: userResponse.data.meta.pagination.total,
            serverCount: serverResponse.data.meta.pagination.total,
          };
        } catch (error: any) {
          console.error(
            `[PTERODACTYL] Error fetching stats from ${instance.url}:`,
            error.message
          );
          errorHandler.execute(error);
          return { userCount: 0, serverCount: 0 };
        }
      })
    );

    const combinedStats: PterodactylStats = instanceResults.reduce(
      (acc, curr) => ({
        userCount: acc.userCount + curr.userCount,
        serverCount: acc.serverCount + curr.serverCount,
      }),
      { userCount: 0, serverCount: 0 }
    );

    cache.set(cacheKey, combinedStats, 300_000); // 5m

    return combinedStats;
  } catch (error: any) {
    console.error(
      "[PTERODACTYL] Error fetching Pterodactyl stats:",
      error.message
    );
    errorHandler.execute(error);
    return { userCount: 0, serverCount: 0 };
  }
}

export async function initPterodactylStatsFetching(): Promise<void> {
  const updateStats = async () => {
    await fetchPterodactylStats()
      .then((stats) => {
        cache.set("user_count", stats.userCount);
        cache.set("server_count", stats.serverCount);
        console.log(
          `[PTERODACTYL] Updated stats: ${stats.userCount} users, ${stats.serverCount} total servers`
        );
      })
      .catch((err) => {
        console.error("[PTERODACTYL] Failed to update stats:", err);
      });
  };

  await updateStats();
  setInterval(updateStats, 300_000); //5m
}
