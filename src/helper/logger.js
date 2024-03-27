import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

//Custom timestamp for dd-mm-yyyy hh:mm:ss
const customTimestamp = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: customTimestamp }),
    winston.format.simple()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/%DATE%/error-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      zippedArchive: true,
      level: 'error',
    }),
    new DailyRotateFile({
      filename: 'logs/%DATE%/combined-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      zippedArchive: true,
    }),
  ],
});

export default logger;
