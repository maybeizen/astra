import mongoose, { Connection } from "mongoose";
import { errorHandler } from "./error-handler";

interface DatabaseProps {
  uri: string | undefined;
  options?: mongoose.ConnectOptions;
}

export default class Database {
  private static instance: Connection | null = null;

  constructor(readonly props: DatabaseProps) {
    if (!props.uri) {
      console.error("Invalid MongoDB connection string provided");
    }
  }

  public async connect() {
    try {
      const connection = await mongoose.connect(
        this.props.uri!,
        this.props.options || {}
      );
      Database.instance = connection.connection;
      console.log(`Connected to MongoDB | ${connection.connection.host}`);
    } catch (error: any) {
      console.error(error);
      errorHandler.execute(error);
    }
  }

  public static databaseInstance(): Connection | null {
    return Database.instance;
  }

  public async destroy() {
    if (Database.instance) {
      await mongoose.disconnect();
      Database.instance = null;
      console.log("Disconnected from MongoDB");
    }
  }
}
