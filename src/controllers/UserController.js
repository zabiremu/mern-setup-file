let md5 = require("md5");
const UserModel = require("../models/UserModel");
const { EncodeToken } = require("../utility/TokenHelper");
const EmailSend = require("../utility/EmailSend");

//! Create user
exports.register = async (req, res) => {
  try {
    let reqBody = req.body;
    reqBody.password = md5(req.body.password); // 1234
    let user = await UserModel.find({ reqBody });
    if (user.length > 0) {
      res.status(200).json({ status: "error", msg: "have account" });
    } else {
      let data = await UserModel.create(reqBody);
      res.status(200).json({ status: "success", data: data });
    }
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

//! User Login
exports.login = async (req, res) => {
  try {
    let reqBody = req.body;
    reqBody.password = md5(req.body.password); // 1234
    let data = await UserModel.aggregate([
      { $match: reqBody },
      { $project: { _id: 1, email: 1 } },
    ]);

    if (data.length > 0) {
      let token = EncodeToken(data[0]["email"]);

      // Set cookie
      let options = {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        sameSite: "none",
        secure: true,
      };

      res.cookie("Token", token, options);
      res.status(200).json({ status: "success", token: token, data: data[0] });
    } else {
      res.status(200).json({ status: "unauthorized", data: data });
    }
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

//! get User
exports.profile_read = async (req, res) => {
  let email = req.headers.email;

  try {
    let MatchStage = {
      $match: {
        email,
      },
    };

    let project = {
      $project: {
        email: 1,
        firstName: 1,
        lastName: 1,
        img: 1,
        phone: 1,
      },
    };

    let data = await UserModel.aggregate([MatchStage, project]);

    res.status(200).json({ status: "success", data: data[0] });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

//! user Logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("Token");
    res.status(200).json({ status: "success" });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

//! Send Email
exports.send_Email = async (req, res) => {
  let reqBody = req.body;

  let emailTo = reqBody.email;
  let emailText = reqBody.emailText;
  let emailSubject = reqBody.emailSubject;
  try {
    let data = await EmailSend(emailTo, emailText, emailSubject);
    res.status(200).json({ status: "success", data: data });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

//! User Profile Update
exports.ProfileUpdate = async (req, res) => {
  try {
    const user = req.headers.email;
    const userProfile = await UserModel.findByIdAndUpdate(user, req.body);
    return res.json({ status: "success", message: "user profile updated" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error });
  }
};

//! Email Verify
exports.EmailVerify = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (user === null) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid credentials. Please check your user name try again.",
    });
  }
  const generateCode = Math.floor(100000 + Math.random() * 900000);
  const mailOptions = {
    from: EMAIL_USER,
    to: "zabirraihan570@gmailcom",
    subject: "Email Verification",
    text: `Your verification code is ${generateCode}`,
  };

  transporter.sendMail(mailOptions);
  const userProfileUpdate = await USER_MODEL.findByIdAndUpdate(user._id, {
    otp: generateCode,
  });
  return res.json({
    status: "success",
    message: "Your verification code is sent",
  });
};
//! Code Verify
exports.CodeVerify = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (user === null) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid credentials. Please check your user name try again.",
    });
  }

  if (user.otp !== req.body.otp) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid credentials. Please check your otp try again.",
    });
  }

  const userProfileUpdate = await USER_MODEL.findByIdAndUpdate(user._id, {
    otpVerified: 1,
  });
  return res.json({
    status: "success",
    message: "Your account verified successfully",
  });
};
//! Reset Password
exports.ResetPassword = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (user === null) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid credentials. Please check your user name try again.",
    });
  }

  const userProfileUpdate = await UserModel.findByIdAndUpdate(user._id, {
    password: req.body.password,
  });
  return res.json({
    status: "success",
    message: "password reset successfully",
  });

  return res.json({ status: "success" });
};
