export type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "NONE";

export class Logger {
  private logLevel: LogLevel;
  private levels: Record<LogLevel, number> = {
    DEBUG: 10,
    INFO: 20,
    WARNING: 30,
    ERROR: 40,
    NONE: 100,
  };

  constructor(level: LogLevel = "INFO") {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return (
      this.levels[level] >= this.levels[this.logLevel] &&
      this.logLevel !== "NONE"
    );
  }

  private async sendToBackend(level: LogLevel, msg: string, ...args: any[]) {
    try {
      const response = await fetch("http://localhost:8000/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, message: msg, extra: args }),
      });
      console.log("Log sent, response:", response.status);
    } catch (e) {
      console.error("Failed to send log to backend", e);
    }
  }

  debug(msg: string, ...args: any[]) {
    if (this.shouldLog("DEBUG")) {
      // console.debug(`[DEBUG] ${msg}`, ...args);
      const msgFe = "[FRONTEND] " + msg;
      this.sendToBackend("DEBUG", msgFe, ...args);
    }
  }

  info(msg: string, ...args: any[]) {
    if (this.shouldLog("INFO")) {
      // console.info(`[INFO] ${msg}`, ...args);
      const msgFe = "[FRONTEND] " + msg;
      this.sendToBackend("INFO", msgFe, ...args);
    }
  }

  warning(msg: string, ...args: any[]) {
    if (this.shouldLog("WARNING")) {
      // console.warn(`[WARNING] ${msg}`, ...args);
      const msgFe = "[FRONTEND] " + msg;
      this.sendToBackend("WARNING", msgFe, ...args);
    }
  }

  error(msg: string, ...args: any[]) {
    if (this.shouldLog("ERROR")) {
      // console.error(`[ERROR] ${msg}`, ...args);
      const msgFe = "[FRONTEND] " + msg;
      this.sendToBackend("ERROR", msgFe, ...args);
    }
  }

  setLevel(level: LogLevel) {
    this.logLevel = level;
  }
}

// Load log level from env (Vite, Next.js, etc.)
const logLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel) || "INFO";
export const logger = new Logger(logLevel);
