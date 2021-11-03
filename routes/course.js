const express = require("express");
const router = express.Router();

const course = require("../models/course");
const courseController = require("../controllers/course");
const isAuth = require("../middleware/isAuth");

router.get("/allCourses",courseController.allCourses);
router.get("/:category",courseController.categorywise);


module.exports=router;