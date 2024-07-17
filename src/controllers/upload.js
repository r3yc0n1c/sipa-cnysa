const { createReadStream, unlinkSync } = require("node:fs");
const httpStatus = require("http-status");
const { parse } = require("fast-csv");
const logger = require("../config/logger");

const CSV_HEADERS = ["S. No.", "Product Name", "Input Image Urls"];

const csvParser = parse({
	headers: true,
	ignoreEmpty: true,
});

const uploadController = async (req, res) => {
	if (!req.file) {
		return res
			.status(httpStatus.BAD_REQUEST)
			.json({ message: "please attach a file" });
	}

	createReadStream(req.file.path)
		.pipe(csvParser)
		.on("error", (error) => {
			unlinkSync(req.file.path);
			logger.error(error);
			return res
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.json({ error: error.message });
		})
		.validate((headers) => {
			headers.map((item, idx) => {
				if(!CSV_HEADERS.includes(item)){
					return new Error("Headers mismatch!");
				}
			});
		})
		.on("data-invalid", )
		.on("data", (row) => console.log("r->", row))
		.on("end", (rowCount) => {
			console.log(`Parsed ${rowCount} rows`);
			return res
				.status(httpStatus.OK)
				.json({ message: "File uploaded successfully!" });
		});
};

module.exports = uploadController;
