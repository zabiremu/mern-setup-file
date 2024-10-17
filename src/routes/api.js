const express = require("express");
const router = express.Router();
const AuthVerification = require("../middlewares/AuthVerification");
const UserController = require("../controllers/UserController");
const { optVerification } = require("../middlewares/OtpVerification");
const upload = require("../utility/FileSave");
//! User
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get(
  "/profile-read",
  AuthVerification,
  optVerification,
  UserController.profile_read
);
router.post(
  "/profile-update",
  AuthVerification,
  optVerification,
  upload.upload.single("file"),
  UserController.ProfileUpdate
);

module.exports = router;
