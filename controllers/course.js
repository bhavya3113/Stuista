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

exports.addCourse=(req,res,next)=>{
  const title = req.body.title;
  const category = req.body.category;
  const duration = req.body.duration;
  const preRequisites = req.body.preRequisites;
  const introduction = req.body.introduction;
  const description = req.body.description;
  const instructorName = req.body.instructorName;
  const price = req.body.price;
  const language = req.body.language;
  const skillsLearned = req.body.skillsLearned;
  const instructorDetails = req.body._id;
  const image = req.file;
  const imageUrl = image.path;
  // console.log(image);
  console.log(instructorDetails);

  const course =new Course({
   title: title,
   category: category,
   duration: duration,
   preRequisites: preRequisites,
   introduction: introduction,
   description: description,
   instructorName: instructorName,
   price: price,
   language: language,
   skillsLearned: skillsLearned,
   instructorDetails: instructorDetails,
   imageUrl: imageUrl
  });
  course.save()
  .then(course=>{
    res.status(201).json({message:'course created', course });
  })
  .catch(err=>{
    res.status(400).json({'Error in adding Course': err})
  })
}
