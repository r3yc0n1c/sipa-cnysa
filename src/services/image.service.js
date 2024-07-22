const axios = require("axios");
const sharp = require("sharp");
const { uploadFile } = require("./s3.service");

// delay simulate
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processImage = async (url, outFileName) => {
	const image = await axios({ url, responseType: "arraybuffer" });

	const newImage = await sharp(image.data).jpeg({ quality: 50 }).toBuffer();

	await delay(10000);

	const savedImage = await uploadFile(outFileName, newImage);

	return savedImage;
};

module.exports = processImage;
