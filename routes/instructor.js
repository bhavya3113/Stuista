const express = require("express");
const router = express.Router();

const user = require("../models/users");
const course = require("../models/course");
const instructorController = require("../controllers/instructor");
const isAuth = require("../middleware/isAuth");


router.post("/create-profile",isAuth,instructorController.instructorProfile);
router.post("/addcourse",isAuth,instructorController.addCourse);
router.post("/:courseid/addvideo",isAuth,instructorController.addVideo);
router.post("/editcourse/:courseid",isAuth,instructorController.editCourse);
router.post("/deletecourse/:courseid",isAuth,instructorController.deleteCourse);

module.exports=router;

