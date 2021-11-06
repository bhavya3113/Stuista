const express = require("express");
const router = express.Router();

const course = require("../models/course");
const courseController = require("../controllers/course");
const isAuth = require("../middleware/isAuth");

router.get("/allCourses",courseController.allCourses);
router.get("/:category",courseController.categorywise);
router.post("/addcourse",courseController.addCourse);

router.post("/:coursename/:courseid",isAuth,courseController.addtocart);
router.post("/:userid/cart/remove",isAuth,courseController.removefromcart);
router.get("/:userid/cart",isAuth,courseController.cart);

router.post("/:coursename/:courseid",isAuth,courseController.addtofav);
router.post("/:userid/favourites/remove",isAuth,courseController.removefromfav);
router.get("/:userid/favourites",isAuth,courseController.fav);
module.exports=router;