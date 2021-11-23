const express = require("express");
const router = express.Router();

const course = require("../models/course");
const courseController = require("../controllers/course");
const instructorController = require("../controllers/instructor");
const isAuth = require("../middleware/isAuth");

router.get("/allCourses",courseController.allCourses);
router.get("/show",courseController.filter);
router.get("/viewcourse/:courseid",courseController.viewCourse);
router.get("/search",courseController.search);
router.get("/cart",isAuth,courseController.Cart);
router.get("/favourites",isAuth,courseController.fav);
router.get("/:category",courseController.categorywise);
router.post("/buynow/:courseid",isAuth,courseController.buynow);
router.post("/buyfromcart",isAuth,courseController.buyfromcart);
router.post("/rating/:courseid",isAuth,courseController.rateandreview);

router.post("/addtocart/:courseid",isAuth,courseController.addtocart);
router.post("/removefromcart/:courseid",isAuth,courseController.removefromcart);

router.post("/addtofavourites/:courseid",isAuth,courseController.addtofav);
router.post("/removefromfavourites/:courseid",isAuth,courseController.removefromfav);

router.get("/syllabus/:courseid/download",courseController.syllabus);

module.exports=router;