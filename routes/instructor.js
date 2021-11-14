const express = require("express");
const router = express.Router();

const user = require("../models/users");
const course = require("../models/course");
const instructor = require("../models/instructor");
const instructorController = require("../controllers/instructor");
const isAuth = require("../middleware/isAuth");


router.post("/create-profile",isAuth,instructorController.createinstructorProfile);
router.post("/addcourse",isAuth,instructorController.addCourse);
router.post("/editcourse/:courseid",isAuth,instructorController.editCourse);
router.post("/deletecourse/:courseid",isAuth,instructorController.deleteCourse);
router.post("/deleteprofile/:userid",isAuth,instructorController.deleteinstructorprofile);
router.get("/viewprofile/:userid",isAuth,instructorController.viewinstructorprofile);
router.post("/editprofile/:userid",isAuth,instructorController.editinstructorprofile);
module.exports=router;

