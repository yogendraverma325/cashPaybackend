import redis from "redis";
import Logger from "../helper/logger.js";

const redisURL = `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const client = redis.createClient({ url: redisURL });

// (async () => {
//     await client.connect();
// })();

// client.on('connect', () => console.log('Cache is connecting'));
// client.on('ready', () => {
//     console.log('Redis DB Connected Successfully');
//     Logger.info('Cache is ready');
// });
// client.on('end', () => console.log('Cache disconnected'));
// client.on('reconnecting', () => console.log('Cache is reconnecting'));
// client.on('error', (e) => {
//     Logger.error(e);
// });

// If the Node process ends, close the Cache connection
process.on("SIGINT", async () => {
  await client.disconnect();
});

export default client;
