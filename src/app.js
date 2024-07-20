const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const httpStatus = require("http-status");
const expressRateLimit = require("express-rate-limit");

const config = require("./config/config");
const morgan = require("./config/morgan");
const routes = require("./routes/v1");

// Express app init
const app = express();

/* Middlewares */

// Set logs middleware
if (config.env !== "test") {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}

// HTTP response headers
app.use(helmet());

// JSON req body parser
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// enable CORS
app.use(cors({ origin: "*" }));

// rate limiter
if (config.env === "prod") {
	app.use(
		expressRateLimit({
			windowMs: 15 * 60 * 1000,
			max: 20,
			skipSuccessfulRequests: true,
		}),
	);
}

// v1 api routes
app.use("/api/v1", routes);

// send a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new Error(httpStatus.NOT_FOUND, "Not found"));
});

module.exports = app;
