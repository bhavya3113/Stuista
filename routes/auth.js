const express = require("express");
const router = express.Router();
const {body} = require("express-validator");

const user = require("../models/users");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/isAuth");

// router.get("/",function(req,res,next){
//   res.send("hello");
// })

router.post("/signup",[
  body("password").trim().isLength({ min: 6 })
], 
authController.signup);
router.post("/verifyotp",authController.otpVerification);
router.post("/resendotp",authController.resendotp);
router.post("/verifybeforereset",authController.verifybeforereset);
router.post("/resetpassword",authController.resetPassword);
// router.post("/login",authController.login);
router.post("/login",isAuth,authController.login);
module.exports=router;