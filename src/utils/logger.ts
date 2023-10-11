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
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: 'tg-dad-jokes-bot-%DATE%.log',
      dirname: '.',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '14d'
    })
  ],
  level: process.env.LOG_LEVEL || 'debug'
});
