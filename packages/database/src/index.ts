import mongoose from "mongoose";
import { Logger } from "@astra/logger";
import * as models from "./models";

const logger = Logger.getInstance({
  title: "Astra Database",
  showTimestamp: false,
  instanceName: "database",
});

export interface DatabaseConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

let isConnected = false;

export async function connectToDatabase(
  config: DatabaseConfig
): Promise<typeof mongoose> {
  if (isConnected) {
    return mongoose;
  }

  try {
    const connection = await mongoose.connect(config.uri, {
      ...config.options,
      // Default options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    logger.success(
      `Connected to MongoDB cluster <hl>${connection.connection.host}</hl>`
    );
    return connection;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error}`);
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.success("Disconnected from MongoDB");
  } catch (error) {
    logger.error(`Error disconnecting from MongoDB: ${error}`);
    throw error;
  }
}

export { mongoose, models };
