const User = require("../models/users");
const Course = require("../models/course");

exports.allCourses=(req,res,next)=>{
  Course.find({})
  .then(course=>{
    res.status(200).json(course);
  })
  .catch(error=>{
    res.status(500).json("error in fetching allcourses", error);
  })
}

exports.categorywise=(req,res,next)=>{
  const categorywiseCourses = req.params.category;
  Course.find({category:categorywiseCourses})
  .then(course=>{
    // console.log(categorywiseCourses);
    res.status(200).json(course);
  })
  .catch(error=>{
    res.status(500).json("error in fetching category-wise courses", error);
  })
}

