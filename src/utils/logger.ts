import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

export const logger = createLogger({
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    format.splat(),
    format.prettyPrint(),
    format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
  ),
  level: process.env.LOG_LEVEL || 'debug',
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      datePattern: 'YYYY-MM-DD',
      dirname: '.',
      filename: 'tg-dad-jokes-bot-%DATE%.log',
      maxFiles: '14d',
      zippedArchive: false
    })
  ]
});
