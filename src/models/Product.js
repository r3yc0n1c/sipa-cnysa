const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const ProductSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: () => nanoid(),
		},
		requestId: {
			type: String,
			ref: "Request",
		},
		serialNumber: {
			type: Number,
			required: true,
		},
		productName: {
			type: String,
			required: true,
		},
		inputImageURLs: {
			type: [String],
			required: true,
			validate: {
				validator: (urls) => urls.length > 0,
				message: "at least one input image URL is required",
			},
		},
		outputImageURLs: [String],
	},
	{
		_id: false,
		timestamps: true,
	},
);

module.exports = mongoose.model("Product", ProductSchema);
