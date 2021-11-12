const express = require("express");
const router = express.Router();

const course = require("../models/course");
const courseController = require("../controllers/course");
const instructorController = require("../controllers/instructor");
const isAuth = require("../middleware/isAuth");

router.get("/allCourses",courseController.allCourses);
router.get("/show",courseController.filter);
router.get("/:category",courseController.categorywise);
router.post("/buynow/:courseid",isAuth,courseController.buynow);
router.post("/buyfromcart/:userid",isAuth,courseController.buyfromcart);
router.post("/:courseid/rating",isAuth,courseController.rating);
router.post("/:courseid/review",isAuth,courseController.addreviews);

router.get("/:userid/cart",isAuth,courseController.Cart);
router.post("/:coursename/:courseid",isAuth,courseController.addtocart);
router.post("/:courseid/cart/remove",isAuth,courseController.removefromcart);

router.post("/favourites/:coursename/:courseid",isAuth,courseController.addtofav);
router.post("/:courseid/favourites/remove",isAuth,courseController.removefromfav);
router.get("/:userid/favourites",isAuth,courseController.fav);
module.exports=router;