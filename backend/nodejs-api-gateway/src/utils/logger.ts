import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

// custom format that's actually readable
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `${timestamp} [${level}]: ${message} ${metaStr}`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'HH:mm:ss' }),
        logFormat
      ),
    }),
    // could add file transport here if needed
  ],
});

// for morgan integration
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
