const { Schema, model } = require("mongoose");

const userSchema = new Schema(
	{
		_id: { type: String },
		name: { type: String, required: true },
		email: { type: String, required: true },
		userPhone: { type: String, required: true },
		password: { type: String, required: true },
		regNumber: { type: String, required: true },
		balance: { type: Number, required: true },
		activity: { type: Array, required: true },
	},
	{ timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
