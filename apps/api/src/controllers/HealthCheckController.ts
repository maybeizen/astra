import { Request, Response } from "express";
import { Logger } from "@astra/logger";
import { mongoose } from "@astra/database";

export class HealthCheckController {
  private static logger = Logger.getInstance({ title: "Health Check" });

  public static async checkHealth(req: Request, res: Response): Promise<void> {
    try {
      const dbStatus = await this.checkDatabaseConnection();
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();

      const healthData = {
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: this.formatUptime(uptime),
        database: dbStatus,
        memory: {
          heapUsed: this.formatBytes(memoryUsage.heapUsed),
          heapTotal: this.formatBytes(memoryUsage.heapTotal),
          rss: this.formatBytes(memoryUsage.rss),
        },
        environment: process.env.NODE_ENV || "development",
      };

      this.logger.info("Health check completed", { box: false });
      res.status(200).json(healthData);
    } catch (error) {
      this.logger.error("Health check failed", { box: false });
      res.status(500).json({
        status: "ERROR",
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private static async checkDatabaseConnection(): Promise<{
    status: string;
    latency: number;
  }> {
    const startTime = Date.now();
    try {
      if (!mongoose.connection.db) {
        throw new Error("Database connection not established");
      }
      await mongoose.connection.db.admin().ping();
      const latency = Date.now() - startTime;
      return {
        status: "connected",
        latency,
      };
    } catch (error) {
      throw new Error(
        `Database connection failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private static formatUptime(uptime: number): string {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  private static formatBytes(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}
