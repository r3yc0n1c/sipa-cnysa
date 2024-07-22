const { S3Client } = require("@aws-sdk/client-s3");
const config = require("./config");

const minioS3Client = new S3Client(config.minio.clientConfig);
const bucketName = config.minio.bucketName;
const bucketBaseURL = `${config.minio.clientConfig.endpoint}/${bucketName}`

module.exports = {
	minioS3Client,
	bucketName,
    bucketBaseURL
};
