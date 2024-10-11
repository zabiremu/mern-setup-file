const express = require("express");
const router = express.Router();
const AuthVerification = require("../middlewares/AuthVerification");
const UserController = require("../controllers/UserController");
const { optVerification } = require("../middlewares/OtpVerification");

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
  "/send-email",
  AuthVerification,
  optVerification,
  UserController.send_Email
);

router.post("/profile-update", AuthVerification, UserController.ProfileUpdate);
router.get("/email-verify/:email", UserController.EmailVerify);
router.post("/codeVerify", UserController.CodeVerify);
router.post("/reset-password", UserController.ResetPassword);

module.exports = router;
