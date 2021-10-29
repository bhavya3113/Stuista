const express = require("express");
const router = express.Router();

const user = require("../models/users");
const authController = require("../controllers/auth");

router.post("/signup", authController.signup);

module.exports=router;