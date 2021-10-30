const express = require("express");
const router = express.Router();
const {body} = require("express-validator");

const user = require("../models/users");
const authController = require("../controllers/auth");

router.post("/signup",[
  body("password").trim().isLength({ min: 6 })
], 
authController.signup);
router.post("/signup/verifyotp",authController.otpVerification);
module.exports=router;