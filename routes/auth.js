const express = require("express");
const router = express.Router();
const {body} = require("express-validator");

const user = require("../models/users");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/isAuth");


router.post("/signup",[
  body("password").trim().isLength({ min: 6 })
], 
authController.signup);
router.post("/signup/verifyotp",authController.otpVerification);
router.post("/signup/resendotp",authController.resendotp);

router.post("/login",authController.login);
// router.post("/login",isAuth,authController.login);
module.exports=router;