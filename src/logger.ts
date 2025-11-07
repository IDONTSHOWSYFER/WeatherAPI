import pino from "pino";
import fs from "fs";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFilePath = path.join(logsDir, "app.log");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          targets: [
            {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
              },
              level: "info",
            },
            {
              target: "pino/file",
              options: { destination: logFilePath, mkdir: true },
              level: "info",
            },
          ],
        }
      : {
          targets: [
            {
              target: "pino/file",
              options: { destination: logFilePath, mkdir: true },
              level: "info",
            },
          ],
        },
});

export default logger;