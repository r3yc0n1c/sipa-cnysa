const path = require("node:path");
const joi = require("joi");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const envSchemma = joi
	.object()
	.keys({
		NODE_ENV: joi.string().valid("prod", "dev", "test").required(),
		PORT: joi.number().default(5000).description("server port"),
		MONGODB_URL: joi.string().required().description("MongoDB URL"),
		REDIS_HOST: joi.string().required().description("Redis host"),
		REDIS_PORT: joi.number().default(6379).description("Redis port"),
		MINIO_S3_ENDPOINT: joi
			.string()
			.required()
			.description("S3 endpoint for local minio deployment"),
		MINIO_BUCKET_NAME: joi
			.string()
			.required()
			.description("S3 Bucket Name for local minio deployment"),
		MINIO_BUCKET_REGION: joi
			.string()
			.required()
			.description("S3 Bucket Region for local minio deployment"),
		MINIO_ACCESS_KEY: joi
			.string()
			.required()
			.description("S3 access key for local minio deployment"),
		MINIO_SECRET_KEY: joi
			.string()
			.required()
			.description("S3 secret key for local minio deployment"),
		WEBHOOK_SECRET: joi.string().required().description("Webhook Secret"),
	})
	.unknown();

const { value: envVars, error } = envSchemma
	.prefs({ errors: { label: "key" } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	mongoose: {
		url: envVars.MONGODB_URL,
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},
	redis: {
		host: envVars.REDIS_HOST,
		port: envVars.REDIS_PORT,
		maxRetriesPerRequest: null,
	},
	minio: {
		clientConfig: {
			endpoint: envVars.MINIO_S3_ENDPOINT,
			region: envVars.MINIO_BUCKET_REGION,
			credentials: {
				accessKeyId: envVars.MINIO_ACCESS_KEY,
				secretAccessKey: envVars.MINIO_SECRET_KEY,
			},
			forcePathStyle: true,
		},
		bucketName: envVars.MINIO_BUCKET_NAME,
	},
	webhook: {
		secret: envVars.WEBHOOK_SECRET,
	},
};
