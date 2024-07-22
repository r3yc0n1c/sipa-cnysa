const { Worker } = require("bullmq");
const axios = require("axios");

const config = require("../config/config.js");
const { connection } = require("../config/queue.js");
const logger = require("../config/logger.js");
const processImage = require("../services/image.service");
const { createSignature } = require("../utils/authUtil.js");

logger.info("Starting Image Processing Worker...");

const imageQWorker = new Worker(
	"image-queue",
	async (job) => {
		try {
			// Your job processing code here...
			console.log("processing", job.data);
			const { requestId, productId, inputImageURLs } = job.data;
			const outputImageURLs = [];

			for (let i = 0; i < inputImageURLs.length; i++) {
				const outFileName = `${i}-${productId}-${Date.now()}.jpg`;
				const processedImage = await processImage(
					inputImageURLs[i],
					outFileName,
				);
				console.log("pi", processedImage);
				outputImageURLs.push(processedImage);
			}

			return { requestId, productId, outputImageURLs };
		} catch (error) {
			console.error(`Job ${job.id} failed with error ${error.message}`);
			throw error;
		}
	},
	{ connection },
);

imageQWorker
	.on("completed", async (job, result) => {
		logger.info(`[${job.id}] is done`);
		logger.info(`webhook = ${job.data.webhookURL}`);

		try {
			const algorithm = "sha256";
			const secret = config.webhook.secret;
			const timestamp = Date.now();
			const data = JSON.stringify(result) + timestamp;

			const signature = createSignature(algorithm, secret, data);

			const response = await axios.post(job.data.webhookURL, result, {
				headers: {
					"x-webhook-secret": secret,
					"x-hmac-algorithm": algorithm,
					"x-hmac-signature": signature,
					"x-hmac-timestamp": timestamp,
				},
			});

			logger.info(response.message);

		} catch (err) {
			logger.error(err);
		}
	})
	.on("failed", (job, err) =>
		logger.error(`[${job.id}] has failed with ${err.message}`),
	)
	.on("error", (err) => logger.error(err));
