const express = require("express");
const router = express.Router();

const user = require("../models/users");
const course = require("../models/course");
const userController = require("../controllers/user");
const isAuth = require("../middleware/isAuth");


router.get("/profile",isAuth,userController.viewUserProfile);
router.post("/edit-profile",isAuth,userController.editUserProfile);
router.post("/delete",isAuth,userController.deleteProfile);
router.post("/changepassword",isAuth,userController.changepassword)

module.exports=router;

