const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const RequestSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: () => nanoid(),
		},
		status: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending",
		},
	},
	{
		_id: false,
		id: false,
		timestamps: true,
	},
);

RequestSchema.virtual("requestId").get(function () {
	return this._id;
});

// check virtual fields are serialised
RequestSchema.set("toJSON", { virtuals: true });
// virtual fields are seen in objs
RequestSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Request", RequestSchema);
