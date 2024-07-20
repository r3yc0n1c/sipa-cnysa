const { Queue } = require("bullmq");
const { Redis } = require("@upstash/redis");
const config = require("./config");

const redis = new Redis(config.redis);
const queue = new Queue("image-proc", { connection: redis });

module.exports = {
	redis,
	queue,
};
