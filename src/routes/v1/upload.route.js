const express = require("express");
const multer = require("multer");
const path = require("node:path");

const uploadController = require("../../controllers/upload");

const router = express.Router();

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

// handle uploads
router.post("/", upload.single("file"), uploadController);

module.exports = router;
