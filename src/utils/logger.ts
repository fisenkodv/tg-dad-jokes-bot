import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    format.splat(),
    format.prettyPrint(),
    format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
  ),
  transports: [new transports.Console()],
  level: process.env.LOG_LEVEL || 'debug'
});
