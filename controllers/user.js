const User = require("../models/users");
const Course = require("../models/course");
const Instructor = require("../models/instructor");
const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const path = require("path");

exports.viewUserProfile=(req,res,next)=>{
  const userId = req.userId;
  User.findById(userId, 'fullname email imageUrl')
  .populate('mycourses favourites')
    .then(user => {
      if (!user) {
        return res.status(400).json({Error:"user not found"});
      }
      return res.status(200).json(user);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
    });
}

exports.editUserProfile=(req,res,next)=>{
  const userId = req.userId;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  
  const fullname = req.body.fullname;
  const image = req.files.image;
  let imageUrl;
  if(image){
  imageUrl = image[0].path;
  // console.log(imageUrl);
  }
  else{
  imageUrl = path.join('images','image-noprofile.png');
  }

  User.findById(userId)
  .then(user=>{
    if(!user)
    {
      return res.status(400).json({message:"user not found"});
    }
    user.fullname = fullname;
    user.imageUrl = imageUrl;
    user.save();
    return res.status(201).json({message:"user profile  editted successfully"});
  })
  .catch(err=>{
    if (!err.statusCode) {
      err.statusCode = 500;
      console.log(err);
    }
  })
}

exports.deleteProfile=(req,res,next)=>{
  const userId = req.userId;

  User.findById(userId)
  .then(user=>{
    if(!user)
      return res.status(400).json({Error:"user not found"});
    
    User.findByIdAndRemove(userId, err=>{
      if(err)
      {
        return res.status(400).json({Error:"Error in deleting user"}); 
      }
    });
     Instructor.findOne({"details": userId})
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
      Instructor.findOneAndRemove({"details": userId}, err=>{
        if(err){
          return res.status(400).json({Error:"Error in deleting instructor"}); 
        }
      });
    }})
  return res.status(200).json({message:'user deleted'})
  })
  .catch(err=>{
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  })
}

exports.changepassword=(req,res,next)=>{
  const userid = req.userId;
  const oldpassword = req.body.oldpassword;
  const newpwd = req.body.newpwd;
  const confirmnewpwd = req.body.confirmnewpwd;

  User.findById(userid)
  .then(user=>{
    if(!user)
     return res.status(400).json({Error:"user not found"});
     else{
      bcrypt.compare(oldpassword, user.password)
      .then(isMatch=>{
        if(!isMatch)
        {
          return res.status(400).json({Error:"Incorrect Password!"});
        }
        else{
          if(newpwd != confirmnewpwd)
            return res.status(422).json({Error:"Passwords do not match"});
    
          bcrypt.hash(newpwd, 12)
          .then(hashedPassword => {
              user.password = hashedPassword;
              user.save();
              res.status(200).json({message:"new password saved"});
            })
            .catch((err) => {
              res.status(400).json({Error: "password not saved"});
            });
          }
      })}
    })
    .catch(err=>{
      if (!err.statusCode) {
      err.statusCode = 500;
      console.log(err);
    }
  })
}