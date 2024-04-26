import http from 'http';
import app from './app.js';
import logger from '../helper/logger.js';

const port = process.env.PORT
const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`App is listening @port ${port}`);
  logger.info(`App is listening @port ${port}`);
});

export default httpServer