const fs = require("node:fs");
const httpStatus = require("http-status");
const fastCSV = require("fast-csv");
const logger = require("../config/logger");
const Product = require("../models/Product");
const Request = require("../models/Request");
const { redis, queue } = require("../config/bullmq");

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

				// save products
				for (const row of rowData) {
					const newProduct = await Product.create({
						requestId,
						serialNumber: row[CSV_HEADERS[0]],
						productName: row[CSV_HEADERS[1]],
						inputImageURLs: row[CSV_HEADERS[2]],
					});

					// add to processing queue
					const key = `prod:${newProduct._id}:req:${requestId}`;
					redis.set(key, input_img_urls.length);
					await  .add("image-proc", { requestId });
				}

				// del file
				fs.unlinkSync(req.file.path);

				return res.status(httpStatus.OK).json({
					requestId,
					message: "File uploaded successfully!",
				});
			} catch (err) {
				csvParser.destroy("mongodb err");
			}
		});
};

module.exports = uploadController;
