const fs = require("node:fs");
const httpStatus = require("http-status");
const fastCSV = require("fast-csv");
const logger = require("../config/logger");
const Product = require("../models/Product");
const Request = require("../models/Request");
const queue = require("../config/queue");

const CSV_HEADERS = ["S. No.", "Product Name", "Input Image Urls"];

const uploadController = async (req, res) => {
	if (!req.file) {
		return res
			.status(httpStatus.BAD_REQUEST)
			.json({ error: "please attach a file" });
	}

	let rowIndex = 0;
	const rowData = [];

	const csvParser = fastCSV.parse({
		headers: true,
		ignoreEmpty: true,
	});

	// connect stream to parser
	fs.createReadStream(req.file.path)
		.pipe(csvParser)
		.on("error", (error) => {
			fs.unlinkSync(req.file.path);
			logger.error(error);
			return res
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.json({ error: error.message });
		})
		.on("headers", (headers) => {
			if (!headers.every((header) => CSV_HEADERS.includes(header))) {
				const HeadersMismatchError = new Error("headers mismatch");
				csvParser.destroy(HeadersMismatchError);
			}
		})
		.on("data", async (row) => {
			rowIndex++;
			if (!CSV_HEADERS.every((item) => row[item])) {
				const NoContentError = new Error(
					`content is missing at row ${rowIndex}`,
				);
				csvParser.destroy(NoContentError);
			}

			rowData.push(row);
		})
		.on("end", async () => {
			// save data
			try {
				// create request and generate requestId
				const newRequest = await Request.create({});
				const requestId = newRequest.requestId;
				const { webhookURL } = req.body;

				// save products
				for (const row of rowData) {
					const inputImageURLs = row[CSV_HEADERS[2]]
						.split(", ")
						.map((url) => url.trim());

					const newProduct = await Product.create({
						requestId,
						inputImageURLs,
						serialNumber: row[CSV_HEADERS[0]],
						productName: row[CSV_HEADERS[1]],
					});

					const productId = newProduct._id;

					// for (const url of urls) {
					// 	const jobData = { requestId, productId, url };

					// 	await queue.imagegQueue.add(
					// 		queue.jobName,
					// 		jobData,
					// 		queue.jobOptions,
					// 	);
					// }

					const jobData = { requestId, productId, inputImageURLs, webhookURL };
					await queue.imagegQueue.add(queue.jobName, jobData, queue.jobOptions);
				}

				// del file
				fs.unlinkSync(req.file.path);

				return res.status(httpStatus.OK).json({
					requestId,
					message: "File uploaded successfully!",
				});
			} catch (err) {
				csvParser.destroy(err.message);
			}
		});
};

module.exports = uploadController;
