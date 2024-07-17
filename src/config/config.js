const path = require("node:path");
const joi = require("joi");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const envSchemma = joi
	.object()
	.keys({
		NODE_ENV: joi.string().valid("prod", "dev", "test").required(),
		PORT: joi.number().default(5000),
		MONGODB_URL: joi.string().required().description("MongoDB URL"),
		UPSTASH_REDIS_REST_URL: joi.string().required().description("Redis URL"),
		UPSTASH_REDIS_REST_TOKEN: joi
			.string()
			.required()
			.description("Redis Token"),
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
		url: envVars.UPSTASH_REDIS_REST_URL,
		token: envVars.UPSTASH_REDIS_REST_TOKEN,
	},
};
