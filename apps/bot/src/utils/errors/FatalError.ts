export class FatalError extends Error {
  name: string;
  message: string;
  stack?: string;

  constructor(message: string, exitCode: number = 1) {
    super(message);
    this.name = "FatalError";
    this.message = message;

    Error.captureStackTrace(this, FatalError);

    console.error(`${this.name}: ${this.message}`);
    process.exit(exitCode);
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }
}
