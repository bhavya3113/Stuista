const express = require("express");
const router = express.Router();
const {body} = require("express-validator");

const user = require("../models/users");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/isAuth");

router.post("/signup",[
  body("email").normalizeEmail({"gmail_remove_dots": false}),
  body("password").trim().isLength({ min: 8 })
], authController.signup);

router.post("/verifyotp",[
  body("email").normalizeEmail({"gmail_remove_dots": false})
], authController.otpVerification);

router.post("/resendotp",[
  body("email").normalizeEmail({"gmail_remove_dots": false})
],authController.resendotp);

router.post("/verifybeforereset",[
  body("email").normalizeEmail({"gmail_remove_dots": false})
],authController.verifybeforereset);

router.post("/checkotpbeforereset",[
  body("email").normalizeEmail({"gmail_remove_dots": false})
],authController.checkotpbeforereset);

router.post("/resetpassword",[
  body("email").normalizeEmail({"gmail_remove_dots": false}),
  body("password").trim().isLength({ min: 8 })
],authController.resetPassword);

router.post("/login",[
  body("email").normalizeEmail({"gmail_remove_dots": false})
],authController.login);

module.exports=router;