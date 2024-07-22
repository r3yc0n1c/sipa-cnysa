const httpStatus = require("http-status");
const config = require("../config/config");
const { verifySignature } = require("../utils/authUtil");

const verifyWebhook = (req, res, next) => {
	const token = req.headers["x-webhook-secret"];
	const algorithm = req.headers["x-hmac-algorithm"];
	const signature = req.headers["x-hmac-signature"];
	const timestamp = req.headers["x-hmac-timestamp"];
	const payload = req.body;
	const secret = config.webhook.secret;

	// validatoins checks
	if (!token || token !== secret) {
		return res.status(httpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
	}

	if (!signature || !timestamp) {
		return res
			.status(httpStatus.UNAUTHORIZED)
			.json({ error: "Signature or timestamp header is missing" });
	}

	if (!payload) {
		return res
			.status(httpStatus.BAD_REQUEST)
			.json({ error: "Invalid payload" });
	}

	// verify signature
	const data = JSON.stringify(payload) + timestamp;
	if (!verifySignature(algorithm, secret, data, signature)) {
		return res
			.status(httpStatus.FORBIDDEN)
			.json({ error: "Invalid signature" });
	}

	next();
};

module.exports = verifyWebhook;
