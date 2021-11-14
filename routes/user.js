const express = require("express");
const router = express.Router();

const user = require("../models/users");
const course = require("../models/course");
const userController = require("../controllers/user");
const isAuth = require("../middleware/isAuth");


router.get("/profile/:userid",isAuth,userController.viewUserProfile);
router.post("/edit-profile/:userid",isAuth,userController.editUserProfile);
router.post("/delete/:userid",isAuth,userController.deleteProfile);

module.exports=router;

