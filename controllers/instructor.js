const User = require("../models/users");
const Course = require("../models/course");

const { validationResult } = require('express-validator');


exports.instructorProfile=(req,res,next)=>{
  const userId = req.userId;
  const experience = req.body.experience;
  const areaofexpertise = req.body.areaofexpertise;
  
  User.findById(userId)
  .then(user=>{
    user.experience = experience,
    user.areaofexpertise = areaofexpertise

    user.save();
  })
  .then(result=>{
    res.status(200).json("instructor profile created");
  })
  .catch(err=>{
    if (!err.statusCode) {
      err.statusCode = 500;
      console.log(err);
    }
  })
}


exports.addCourse=(req,res,next)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
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
  const instructorDetails = req.userId;
  const image = req.files.image[0];
  const imageUrl = image.path;
  // console.log(req.files);
  // console.log(instructorDetails);

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
    //res.status(200)//.json({message:'course created', course });
    return User.findById(instructorDetails)
  })
  .then(user=>{
      user.course.push(course);
      user.save();
      res.status(201).json({message:'course created and added to teachers dashboard', course});
    })
  .catch(err=>{
    console.log("error in adding course to teacher's dashboard", err);
     res.status(400).json({ 'Error in adding course to teachers dashboard': err });
  })
  .catch(err=>{
    res.status(400).json({'Error in adding Course': err})
  })
}

exports.addVideo=(req,res,next)=>{
  const videos = req.files.video;
  const courseid = req.params.courseid;
  Course.findById(courseid)
  .then(course=>{
    videos.forEach(video=>{
      course.videosArray.push(video.path);
    })
    course.save();
  })
  .then(result=>{
    res.status(200).json("successfully saved the video")
  })
  .catch(err=>{
    res.status(400).json({'Error in saving video': err})
  })
}

exports.editCourse=(req,res,next)=>{
  const courseId = req.params.courseid;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
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
  const instructorDetails = req.userId;
  const image = req.files.image[0];
  const imageUrl = image.path;

  Course.findById(courseId)
  .then(course=>{
    if(!course)
    {
      return res.status(400).json("course not found");
    }
    if (course.instructorDetails.toString() !== instructorDetails)
    {
      return res.status(403).json("Not Authorized");
    }
    course.title= title,
    course.category= category,
    course.duration= duration,
    course.preRequisites= preRequisites,
    course.introduction= introduction,
    course.description= description,
    course.instructorName= instructorName,
    course.price= price,
    course.language= language,
    course.skillsLearned= skillsLearned,
    course.instructorDetails= instructorDetails,
    course.imageUrl= imageUrl
    
    course.save();
  })
  .then(result=>{
    res.status(201).json("course editted successfully");
  })
  .catch(err=>{
    if (!err.statusCode) {
      err.statusCode = 500;
      console.log(err);
    }
  })
}


exports.deleteCourse=(req,res,next)=>{
  const courseId = req.params.courseid;
  Course.findById(courseId)
  .then(course=>{
    if(!course)
    {
      res.status(400).json("course not found");
    }
    if (course.instructorDetails.toString() !== req.userId)
    {
      res.status(403).json("Not Authorized");
    }
    return Course.findByIdAndRemove(courseId)
  })
  .then(result=>{
    return User.findById(req.userId)
  })
  .then(user=>{
      user.course.pull(courseId);
      user.save();
      res.status(200).json('course deleted');
    })
  .catch(err=>{
     res.status(400).json({ 'Error in deleting course': err });
  })
}