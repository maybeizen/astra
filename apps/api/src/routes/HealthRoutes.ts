import { Router } from "express";
import { HealthCheckController } from "../controllers/HealthCheckController";
import { Logger } from "@astra/logger";

export class HealthRoutes {
  private static logger = Logger.getInstance({ title: "Health Routes" });
  private static router: Router = Router();

  public static getRouter(): Router {
    this.initializeRoutes();
    return this.router;
  }

  private static initializeRoutes(): void {
    this.router.get("/", (req, res) => {
      this.logger.debug("Health check requested", { box: false });
      HealthCheckController.checkHealth(req, res);
    });
  }
}

export default HealthRoutes.getRouter();
