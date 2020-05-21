const redis = require("redis");

const options =
  process.env.NODE_ENV === "production"
    ? {
        url: process.env.REDIS_URL,
      }
    : {
        port: parseInt(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
      };

const redisClient = redis.createClient(options);

module.exports = { redisClient };
