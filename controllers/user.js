const User = require("../models/users");
const Course = require("../models/course");
const Instructor = require("../models/instructor");
const { validationResult } = require('express-validator');


exports.viewUserProfile=(req,res,next)=>{
  const userId = req.params.userid;
  User.findById(userId, 'fullname email')
  .select('-_id')
  .populate('mycourses favourites',{'_id':0,'imageUrl':1,'title':1,'duration':1,'price':1})
    .then(user => {
      if (!user) {
        return res.status(400).json({Error:"user not found"});
      }
      res.status(200).json(user);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
    });
}

exports.editUserProfile=(req,res,next)=>{
  const userId = req.params.userid;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  
const fullname = req.body.fullname;

  User.findById(userId)
  .then(user=>{
    if(!user)
    {
      return res.status(400).json({message:"user not found"});
    }
    user.fullname = fullname;
    user.save();
  })
  .then(result=>{
    res.status(201).json({message:"user profile  editted successfully"});
  })
  .catch(err=>{
    if (!err.statusCode) {
      err.statusCode = 500;
      console.log(err);
    }
  })
}

exports.deleteProfile=(req,res,next)=>{
  const userId = req.params.userid;

  User.findById(userId)
  .then(user=>{
    if(!user)
      return res.status(400).json({Error:"user not found"});
    if (userId !== req.userId)
     return res.status(403).json({Error:"Not Authorized"});
    return User.findByIdAndRemove(userId);
  })
  .then(result=>{
    return Instructor.findOne({"details": userId});
  })
  .then(instructor=>{
    if(instructor){
    const length = instructor.course.length;
    for(var i=0;i<length;i++)
    {
      Course.findByIdAndRemove(instructor.course[i],(err)=>{
        if(err)
        throw err;
      });
    }
    return Instructor.findOneAndRemove({"details": userId});}
  })
  .then(result=>{
    return res.status(200).json({message:'user deleted'})
  })
  .catch(err=>{
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  })
}