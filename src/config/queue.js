const { Queue } = require("bullmq");
// const { Redis } = require("@upstash/redis");
const { Redis } = require("ioredis");

const config = require("./config");

const connection = new Redis(config.redis);
const imagegQueue = new Queue("image-queue", { connection });

const jobName = "image-job";
const jobOptions = {
	attempts: 2,
	backoff: {
		type: "exponential",
		delay: 1000,
	},
	removeOnComplete: true,
	removeOnFail: 1000,
};

module.exports = {
	connection,
	imagegQueue,
	jobOptions,
	jobName,
};
