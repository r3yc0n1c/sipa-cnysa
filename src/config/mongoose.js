const mongoose = require("mongoose");
const logger = require("./logger");
const config = require("./config");

// print logs in dev env
if (config.env === "dev") {
	mongoose.set("debug", true);
}

// Connect to mongo db
const connectDB = () => {
	mongoose
		.connect(config.mongoose.url, config.mongoose.options)
		.then(() => logger.info("MongoDB is connected!"));
	return mongoose.connection;
};

module.exports = connectDB;