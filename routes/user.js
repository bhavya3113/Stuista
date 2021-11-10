const express = require("express");
const router = express.Router();

const user = require("../models/users");
const course = require("../models/course");
const userController = require("../controllers/user");
const isAuth = require("../middleware/isAuth");


router.get("/profile/:userid",isAuth,userController.viewProfile);
router.post("/edit-profile/:userid",isAuth,userController.editProfile);
router.post("/delete/:userid",isAuth,userController.deleteProfile);
// router.post("/editcourse/:courseid",isAuth,userController.editCourse);
// router.post("/deletecourse/:courseid",isAuth,userController.deleteCourse);

module.exports=router;

