const User = require("../models/users");
const Course = require("../models/course");
const Instructor = require("../models/instructor");
const mail = require("../utils/bulkmail");

const { validationResult } = require('express-validator');
const fs = require("fs");
const path = require("path");

exports.createinstructorProfile=(req,res,next)=>{
  const userId = req.userId;
  const experience = req.body.experience;
  const areaofexpertise = req.body.areaofexpertise;
  
  User.findById(userId)
  .then(user=>{
    if(!user)
    {
      return res.status(401).json({Error:"Not registered"});
    }
    if(user.verifiedasInstructor == "true")
    {
      return res.status(400).json({Error:"Already registered as instructor"}); 
    }
      const instructor = new Instructor({
        details:userId,
        experience : experience,
        areaofexpertise : areaofexpertise,
      });
       instructor.save();
       user.verifiedasInstructor = "true";
       user.save();
       return res.status(200).json({message:"instructor profile created"});
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
  const price = req.body.price;
  const language = req.body.language;
  const skillsLearned = req.body.skillsLearned;
  const image = req.files.image;
  
  // console.log(image);
  let imageUrl;
  if(image){
    
  imageUrl = image[0].path;
  // console.log(imageUrl);
  }
  else{
    imageUrl = path.join('images','image-not-found.png');
  }
  const videos = req.files.video;
  const videosUrl =[];
  // console.log(req.files);
  videos.forEach(video=>{
    videosUrl.push(video.path);
  })

  Instructor.findOne({'details':req.userId})
  .populate('details')
  .then(instructor=>{
    if(!instructor)
    {
      return res.status(401).json({Error:"Not registered as an instructor"});
    }

    const course =new Course({
      title: title,
      category: category,
      duration: duration,
      preRequisites: preRequisites,
      introduction: introduction,
      description: description,
      instructorName: instructor.details.fullname,
      instructorEmail: instructor.details.email,
      instructorExperience: instructor.experience,
      instructorId: instructor._id,
      price: price,
      language: language,
      skillsLearned: skillsLearned,
      imageUrl: imageUrl,
      videosArray: videosUrl
    });

      course.save();
      instructor.course.push(course);
      instructor.save();
       User.find(function (err,userx){
        if (err){
            throw err;
        }
        else{
            var user_arr =Object.keys(userx).map(
                function(key){
                    return userx[key];
                }
            );
            user_arr.forEach(user=>{
                  for(var i=0;i<user.mycourses.length;i++)
                  {
                    if(user.mycourses[i].category == category)
                    {
                      const sendmail = mail.bulkmail(user.email,user.fullname);
                      break;
                    }
                  }
            })
    
        }
    }) 
    .clone()
    .populate('mycourses');
    return res.status(200).json({message:'course created and added to instructor dashboard'});
  })
  .catch(err=>{
    // console.log("error in adding course to teacher's dashboard", err);
     res.status(400).json({Error: 'Error in adding course to instructor dashboard'});
  })
  .catch(err=>{
    if (!err.statusCode) {
      err.statusCode = 500;
      console.log(err);
    }
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
  const price = req.body.price;
  const language = req.body.language;
  const skillsLearned = req.body.skillsLearned;
  const image = req.files.image;
  
  // console.log(image);
  let imageUrl;
  if(image){
    
  imageUrl = image[0].path;
  // console.log(imageUrl);
  }
  else{
    imageUrl = path.join('images','image-not-found.png');
  }
  
  const videos = req.files.video; 
  const videosUrl =[];
  if(videos){
  videos.forEach(video=>{
    videosUrl.push(video.path);
  })}

  Instructor.findOne({'details':req.userId})
  .populate('details')
  .then(instructor=>{
    
    if(!instructor)
    {
      return res.status(401).json({Error:"Not registered as an instructor"});
    }

    const index = instructor.course.findIndex(courseid => courseId==courseid)
    if(index==-1)
    {
      return res.status(403).json({Error:"Since, you have not created this course,you are not allowed to make changes in it"});
    }
    Course.findById(courseId)
   .then(course=>{
    if(!course)
    {
      return res.status(400).json({Error:"course not found"});
    }

    if(course.imageUrl && course.imageUrl !== imageUrl)
    {
      // console.log(path.resolve('./')+'\\'+course.imageUrl);
      fs.unlink((path.join(__dirname,'../','images',path.basename(imageUrl))), (err) => {
      if (err) throw err;
      // console.log('successfully deleted file');
      });
    }

    course.title = title;
    course.category = category;
    course.duration = duration;
    course.preRequisites = preRequisites;
    course.introduction = introduction;
    course.description = description;
    course.price = price;
    course.language = language;
    course.skillsLearned = skillsLearned;
    course.imageUrl = imageUrl;
    course.videosArray= videosUrl;
    course.save();

    res.status(201).json({message:"course editted successfully"});
  })
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
  let imgpath;
  let videopath =[];
  let length;
  Course.findById(courseId)
  .then(course=>{
    if(!course)
    {
       return res.status(400).json({Error:"course not found"});
    }
    imgpath = course.imageUrl;
    length = course.videosArray.length;
    for(var i=0;i<length;i++)
    {
      videopath.push(course.videosArray[i]);
    }
    // console.log(videopath);
    Instructor.findOne({'details':req.userId})
    .then(instructor=>{
    
    if(!instructor)
    {
      return res.status(401).json({Error:"Not registered as an instructor"});
    }
    if(instructor.course)
    {
      const index = instructor.course.findIndex(courseid => courseId==courseid)
    if(index==-1)
    {
        return res.status(403).json({Error:"Since, you have not created this course,you are not allowed to delete it"});
    }
    instructor.course.pull(courseId);
    instructor.save();
    // path.resolve('./')+'\\'+imgpath,
    fs.unlink((path.join(__dirname,'../','images',path.basename(imgpath))) ,(err) => {
      if (err) throw err;
      // console.log(imgpath,'successfully deleted file');
    });

    for(var i=0;i<length;i++)
    {
      // console.log(path.resolve('./')+'\\'+videopath[i]);
      fs.unlink((path.join(__dirname,'../','videos',path.basename(videopath[i]))), (err) => {
        if (err) throw err;
        // console.log('successfully deleted file');
      });
    }
    Course.findByIdAndRemove(courseId,err=>{
      if(err){
        return res.status(400).json({Error:"Error in deleting instructor"}); 
      };
    })
        return res.status(200).json({message:'course deleted'});
  }
  })
})
    //   .then(result=>{
  //     // User.updateMany({ 'cart': courseId },{$pull:{ 'cart':courseId}});
  //      res.status(200).json('course deleted');
  //   })
  .catch(err=>{
    if (!err.statusCode) {
      err.statusCode = 500;
      console.log(err);
    }
  })
}

exports.deleteinstructorprofile = (req,res,next)=>{
  const userId = req.userId;

  User.findById(userId)
  .then(user=>{
    if(!user)
      return res.status(400).json({Error:"user not found"});
      
    if(user.verifiedasInstructor == "false")
    return res.status(400).json({Error:"User is not an instructor"});

     user.verifiedasInstructor ="false";
     user.save();
    Instructor.findOne({"details": userId})
    .then(instructor=>{
    const length = instructor.course.length;
    for(var i=0;i<length;i++)
    {
      Course.findByIdAndRemove(instructor.course[i],(err)=>{
        if(err)
        throw err;
      });
    }Instructor.findOneAndRemove({"details": userId},err=>{
      if(err){
        return res.status(400).json({Error:"Error in deleting instructor"}); 
      }});
  })
  return res.status(200).json({message:"Instructor profile deleted"});
  })
  .catch(err=>{
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  })
}

exports.viewinstructorprofile = (req,res,next)=>{
  const userId = req.userId;
  Instructor.findOne({'details': userId})
  .select('-_id')
  .populate('details course',{"password":0,"isVerified":0,"verifiedasInstructor":0,})
    .then(instructor => {
      if (!instructor) {
        return res.status(400).json({Error:"instructor not found"});
      }
      res.status(200).json(instructor);
    })
    .catch(err => {
      if (!err.statusCode){
        err.statusCode = 500;
      }
    });
}

exports.editinstructorprofile = (req,res,next)=>{
  const userId = req.userId;
  
  const experience = req.body.experience;
  const areaofexpertise = req.body.areaofexpertise;

  Instructor.findOne({'details':userId})
  .then(instructor=>{
  if(!instructor)
  {
    return res.status(400).json({Error:"instructor not found"});
  }

  instructor.experience = experience;
  instructor.areaofexpertise = areaofexpertise;
  instructor.save();
  return res.status(201).json({message:"instructor profile  editted successfully"});
 })
 .catch(err=>{
  if (!err.statusCode) {
    err.statusCode = 500;
    console.log(err);
  }
})
}