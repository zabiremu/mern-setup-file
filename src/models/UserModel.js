const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    otp: { type: Number },
    otpVerified: {
      type: String,
      enum: ["verified", "unverified"],
      default: "unverified",
    },
    img: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = mongoose.model("users", DataSchema);

module.exports = UserModel;
