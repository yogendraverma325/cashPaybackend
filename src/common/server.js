import http from 'http';
import app from './app.js';
import logger from '../helper/logger.js';
import cluster from "cluster";
import os from "os";
import cron from "node-cron";
import attendanceController from "../api/v1/attendance/attendance.controller.js"
import cronController from "../api/v1/cron/cron.controller.js";
const port = process.env.PORT
const httpServer = http.createServer(app);

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one.`);
    cluster.fork();
  });
} else {
  httpServer.listen(port, () => {
    console.log(`App is listening @port ${port}`);
    logger.info(`App is listening @port ${port}`);
  });
  console.log("cluster.worker.id",cluster.worker.id)
  if (cluster.worker && cluster.worker.id === 1) {
    cron.schedule("*/10 * * * * *", async () => {
      cronController.updateActiveStatus();
    });
     cron.schedule("30 7 * * *", async () => {
      await attendanceController.attedanceCron();
    });
  }
}

export default httpServer