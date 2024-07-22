const httpStatus = require("http-status");
const logger = require("../config/logger");
const Request = require("../models/Request");

const statusController = async (req, res) => {
	try {
		const { requestId } = req.query;

		if (!requestId) {
			return res.status(httpStatus.BAD_REQUEST).json({
				message: "missing required param: requestId",
			});
		}

		console.log(requestId);

		const request = await Request.findById(requestId);

		if (!request) {
			return res.status(httpStatus.NOT_FOUND).json({
				message: `Request with requestId=${requestId} not found`,
			});
		}

		res.status(httpStatus.OK).json({ status: request.status });
	} catch (err) {
		logger.error(err.message);
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			error: err.message,
		});
	}
};

module.exports = statusController;
