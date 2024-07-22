const crypto = require("node:crypto");

const createSignature = (algorithm, secret, data) => {
	const hmac = crypto.createHmac(algorithm, secret);
	const signature = hmac.update(data).digest("hex");
	return signature;
};

const verifySignature = (algorithm, secret, data, signature) => {
	if (!algorithm || !secret || !data || !signature) return false;
	const hmac = crypto.createHmac(algorithm, secret);
	const digest = hmac.update(data).digest("hex");
	return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
};

module.exports = {
	createSignature,
	verifySignature,
};
