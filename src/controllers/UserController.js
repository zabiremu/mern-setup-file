let md5 = require("md5");
const UserModel = require("../models/UserModel");
const { EncodeToken } = require("../utility/TokenHelper");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
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
//! User Profile Update
exports.ProfileUpdate = async (req, res) => {
  try {
    const email = req.headers.email;
    req.image = req.file.filename;
    // Delete the file like normal
    const user = await UserModel.findOne({ email: email });
    unlinkAsync("./src/public/uploads/" + user.img);
    const userProfile = await UserModel.updateOne(
      { email: email },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          img: req.image,
        },
      }
    );
    return res.json({
      status: "success",
      message: "user update successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error });
  }
};
