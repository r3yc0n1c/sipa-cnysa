const config = require("./config/config");
const logger = require("./config/logger");

const connectDB = require("./config/mongoose");
const app = require("./app");

let server;

// connect to mongoDB
connectDB().on("open", () => {
	// start server
	server = app.listen(config.port, () =>
		logger.info(`Express Server started on port ${config.port}`),
	);
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	logger.info("SIGTERM received");
	if (server) {
		server.close();
	}
});
