import boxen, { Options as BoxenOptions } from "boxen";
import chalk from "chalk";

export type LogLevel = "info" | "success" | "warning" | "error" | "debug";

export interface LoggerOptions {
  title?: string;
  padding?: number;
  margin?: number;
  borderColor?: string;
  borderStyle?:
    | "single"
    | "double"
    | "round"
    | "bold"
    | "singleDouble"
    | "doubleSingle"
    | "classic";
  showTimestamp?: boolean;
  showPrefix?: boolean;
  box?: boolean;
  instanceName?: string;
}

export interface LogOptions {
  box?: boolean;
}

export class Logger {
  private static instances: Map<string, Logger> = new Map();
  private options: LoggerOptions;
  private startTime: number;

  private constructor(options: LoggerOptions = {}) {
    this.options = {
      title: "Astra Logger",
      padding: 1,
      margin: 1,
      borderColor: "blue",
      borderStyle: "round",
      showTimestamp: true,
      showPrefix: true,
      box: false,
      instanceName: "default",
      ...options,
    };
    this.startTime = Date.now();
  }

  public static getInstance(options?: LoggerOptions): Logger {
    const instanceName = options?.instanceName || "default";

    if (!Logger.instances.has(instanceName)) {
      Logger.instances.set(
        instanceName,
        new Logger({
          ...options,
          instanceName,
        })
      );
    } else if (options) {
      // Update existing instance with new options if provided
      const instance = Logger.instances.get(instanceName)!;
      instance.options = {
        ...instance.options,
        ...options,
      };
    }

    return Logger.instances.get(instanceName)!;
  }

  private getBoxenOptions(level: LogLevel): BoxenOptions {
    const colors: Record<LogLevel, string> = {
      info: "blue",
      success: "green",
      warning: "yellow",
      error: "red",
      debug: "magenta",
    };

    return {
      padding: this.options.padding,
      margin: this.options.margin,
      borderColor: colors[level],
      borderStyle: this.options.borderStyle,
      title: `${this.options.title} - ${level.toUpperCase()}`,
      titleAlignment: "center" as const,
    };
  }

  private getEmoji(level: LogLevel): string {
    const emojis: Record<LogLevel, string> = {
      info: "ℹ️ ",
      success: "✅",
      warning: "⚠️",
      error: "❌",
      debug: "🔍",
    };
    return emojis[level];
  }

  private getPrefix(level: LogLevel): string {
    const prefixes: Record<LogLevel, string> = {
      info: "INFO",
      success: "SUCCESS",
      warning: "WARNING",
      error: "ERROR",
      debug: "DEBUG",
    };
    return prefixes[level];
  }

  private formatTimestamp(): string {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();
    const uptime = this.formatUptime();
    return `${date} ${time} (Uptime: ${uptime})`;
  }

  private formatUptime(): string {
    const uptime = Date.now() - this.startTime;
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  private highlightText(text: string, level: LogLevel): string {
    const colors: Record<LogLevel, (text: string) => string> = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red,
      debug: chalk.magenta,
    };

    return text.replace(/<hl>(.*?)<\/hl>/g, (_, content) =>
      colors[level](content)
    );
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const emoji = this.getEmoji(level);
    const prefix = this.getPrefix(level);
    let levelColor: string;

    switch (level) {
      case "info":
        levelColor = chalk.blue(prefix);
        break;
      case "success":
        levelColor = chalk.green(prefix);
        break;
      case "warning":
        levelColor = chalk.yellow(prefix);
        break;
      case "error":
        levelColor = chalk.red(prefix);
        break;
      case "debug":
        levelColor = chalk.magenta(prefix);
        break;
      default:
        levelColor = String(prefix);
    }

    const timestamp = this.options.showTimestamp
      ? chalk.gray(this.formatTimestamp())
      : "";
    const formattedMessage = this.highlightText(message, level);

    let output = `[${levelColor}] ${formattedMessage}`;
    if (timestamp) {
      output = `${timestamp}\n${output}`;
    }

    if (data) {
      const dataStr =
        typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);
      output += `\n${chalk.gray("Data:")}\n${chalk.gray(dataStr)}`;
    }

    return output;
  }

  public log(level: LogLevel, message: string, options?: LogOptions): void {
    const formattedMessage = this.formatMessage(level, message);
    const shouldBox = options?.box ?? this.options.box;
    const finalMessage = shouldBox
      ? boxen(formattedMessage, this.getBoxenOptions(level))
      : formattedMessage;
    console.log(finalMessage);
  }

  public info(message: string, options?: LogOptions): void {
    this.log("info", message, options);
  }

  public success(message: string, options?: LogOptions): void {
    this.log("success", message, options);
  }

  public warning(message: string, options?: LogOptions): void {
    this.log("warning", message, options);
  }

  public error(message: string, options?: LogOptions): void {
    this.log("error", message, options);
  }

  public debug(message: string, options?: LogOptions): void {
    this.log("debug", message, options);
  }
}
