const UserModel = require("../models/UserModel");

exports.optVerification = (req, res, next) => {
  const email = req.headers.email;
  const userModel = UserModel.findOne({ email: email });
  if (!email && !userModel) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized",
    });
  }

  const checkOtp = userModel.otp;
  if (checkOtp === "unverified") {
    return res.status(401).json({
      status: "fail",
      message: "Please verify your email first",
    });
  }
  next();
};
