const User = require("../models/users");
const Course = require("../models/course");


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
  const instructorDetails = req.userId;
  const image = req.file;
  const imageUrl = image.path;
  // console.log(image, imageUrl);
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
    res.status(200)//.json({message:'course created', course });
  })
   User.findById(instructorDetails)
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
  const videos = req.files;
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


