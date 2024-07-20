const express = require("express");
const multer = require("multer");
const path = require("node:path");

// csv parser upload start
const { createReadStream, unlinkSync } = require("node:fs");
const httpStatus = require("http-status");
const { parse } = require("fast-csv");

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
			console.error(error);
			return res
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.json({ error: error.message });
		})
		.on("headers", (headers) => {
			if (!headers.every((header) => CSV_HEADERS.includes(header))) {
				const HeadersMismatchError = new Error("Headers mismatch!");
                csvParser.emit("error", HeadersMismatchError);
                csvParser.destroy();
			}
		})
		.on("data", (row) => console.log("r->", row))
		.on("end", (rowCount) => {
			console.log(`Parsed ${rowCount} rows`);
			return res
				.status(httpStatus.OK)
				.json({ message: "File uploaded successfully!" });
		});
};
// csv parser upload end

// multer middleware
const csvStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(
			null,
			`${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
		);
	},
});

const csvFilter = (req, file, cb) => {
	if (path.extname(file.originalname) !== ".csv") {
		req.fileValidationError = "Only CSV files are allowed!";
		return cb(new Error("Only CSV files are allowed!"), false);
	}
	cb(null, true);
};

const upload = multer({
	storage: csvStorage,
	fileFilter: csvFilter,
});

const app = express().use(express.json());

// handle uploads
app.post("/", upload.single("file"), uploadController);

app.listen(7000, () => {
	console.log("http://localhost:7000");
});
