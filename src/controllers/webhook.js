const httpStatus = require("http-status");

const Product = require("../models/Product");
const Request = require("../models/Request");
const logger = require("../config/logger");

const webhookController = async (req, res) => {
	console.log("webhook called");

	try {
		const { requestId, productId, outputImageURLs } = req.body;

		if (!requestId || !productId || !outputImageURLs) {
			return res.status(httpStatus.BAD_REQUEST).json({
				error:
					"Missing required fields: requestId, productId, or outputImageURLs.",
			});
		}

		await Product.updateOne({ _id: productId }, { outputImageURLs });

		const allProducts = await Product.find({ requestId });

		if (allProducts.every((product) => product.outputImageURLs.length)) {
			await Request.updateOne(
				{ _id: requestId },
				{
					status: "completed",
				},
			);

			return res.status(httpStatus.OK).json({
				message: "request completed successfully",
			});
		}
		return res.status(httpStatus.OK).json({
			message: "product updated, request is still pending",
		});
	} catch (err) {
		logger.error(err.message);
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.json({ error: err.message });
	}
};

module.exports = webhookController;
