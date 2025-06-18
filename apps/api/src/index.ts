import "dotenv/config";
import app from "./app";
import { connectToDatabase, disconnectFromDatabase } from "@astra/database";
import { Logger } from "@astra/logger";

const PORT = process.env.PORT || 3000;
const logger = Logger.getInstance({
  title: "Astra API",
  showTimestamp: true,
  instanceName: "api",
});

async function main() {
  await connectToDatabase({
    uri: process.env.MONGODB_URI!,
  });

  app.listen(PORT, () => {
    logger.info(`Server is running at <hl>http://localhost:${PORT}</hl>`, {
      box: true,
    });
  });

  process.on("SIGINT", async () => {
    await disconnectFromDatabase();
    process.exit(0);
  });
}

main().catch((error) => {
  logger.error(error);
});
