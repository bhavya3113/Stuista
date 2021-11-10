const User = require("../models/users");
const Course = require("../models/course");

const { validationResult } = require('express-validator');


exports.viewProfile=(req,res,next)=>{
  const userId = req.params.userid;
  User.findById(userId, 'fullname email ')
    .then(user => {
      if (!user) {
        return res.status(400).json("user not found");
      }
      res.status(200).json(user);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
    });
}

exports.editProfile=(req,res,next)=>{
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
      return res.status(402).json("user not found");
    }
    user.fullname = fullname;
    user.save();
  })
  .then(result=>{
    res.status(201).json("user profile  editted successfully");
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
    {
      return res.status(402).json("user not found");
    }
    if (userId !== req.userId)
    {
     return res.status(403).json("Not Authorized");
    }
    return User.findByIdAndRemove(userId)
  })
  .then(result=>{
    return Course.deleteMany({"instructorDetails": userId})
  })
  .then(result=>{
        res.status(200).json('user deleted')
    })
  .catch(err=>{
    console.log(err);
     res.status(400).json({ 'Error in deleting user': err });
  })
}