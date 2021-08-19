const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    boothName: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    history: { type: Array },
  },
  { timestamps: true }
);

const Admin = model("Admin", adminSchema);

module.exports = Admin;
