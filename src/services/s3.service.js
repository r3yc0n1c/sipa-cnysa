const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { minioS3Client, bucketName, bucketBaseURL } = require("../config/s3");

const uploadFile = async (fileName, fileData) => {
	await minioS3Client.send(
		new PutObjectCommand({
			Bucket: bucketName,
			Key: fileName,
			Body: fileData,
		}),
	);
	return `${bucketBaseURL}/${fileName}`;
};

module.exports = {
    uploadFile
}