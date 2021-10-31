const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const dotenv = require("dotenv");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

dotenv.config();

const User = require("../models/users");
const Otp = require("../models/otp");

var emailregex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

const transporter = nodemailer.createTransport(sendGridTransport({
  auth:{
    api_key: process.env.API_KEY
  }
}))
exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed ");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

const firstname = req.body.firstname;
const lastname = req.body.lastname;
const email = req.body.email;
const password = req.body.password;

if (!(email && password && firstname && lastname)) {
  res.status(400).send("All fields are required");
}
var validemail = emailregex.test(email);

if (!validemail) {
    return res.status(422).json({ error: "please enter a valid email" });
}
User.findOne({email:email})
.then(user=>{
  if(user)
  {
    // const error = new Error("User already exists !!");
    // error.statusCode = 400;
    // throw error;
    
    return res.status(422).json({ Error: "User is already registered" })
  }
});
bcrypt.hash(password, 12)
.then(hashedPassword => {
  const user = new User({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: hashedPassword,
    isVerified: "false"
  });
   user.save();
})
.then(results=>{
  
  // res.status(201).json({message:'user created', email:email,firstname:firstname});
  let otp = otpGenerator.generate(6, {
    alphabets: false,
    specialChars: false,
    upperCase: false,
  });
  const onetimepwd = new Otp({
    email:email,
    firstname:firstname,
    otp:otp
  });
   onetimepwd.save();
  //  res.status(200).json({
  //   message: "otp sent",
  //   email: email,
  // });
  return transporter.sendMail({
    to:email,
    from:'learnatstuista@gmail.com',
    subject:'Verification OTP',
    html:`<h4>Hello ${firstname},</h4>
    <br>Please use this One time password to verify your account.<br>
    OTP:${otp}<br>
    Do not share it with anyone.<br>
    <h5>Thanks ,<br>Team Stuista</h5>`
  })
})
.catch(err => {
  if (!err.statusCode) {
    err.statusCode = 500;
    console.log(err);
  }
});
}

exports.otpVerification =(req,res,next)=>{
  const email = req.body.email;
  const otp = req.body.otp;
  Otp.findOne({email:email}).sort({createdAt : -1})
  .then(user=>{
    if(!user)
    {
      return res.status(422).json({ Error: "Otp is expired" });
    }
    if (user.otp !== otp) 
    {
        return res.status(422).json({ Error: "Wrong Otp" });
    }
    User.findOne({email:email})
    .then(user=>{
      user.isVerified = "true";
      user.save();
    })
      res.status(200).json({
      status: "success",
      data: user
  })
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
      console.log(err);
    }
  });
}
exports.login=(req,res,next)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed ");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  
  const email = req.body.email;
  const password = req.body.password;
  let registeredUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('User is not registered.');
        error.statusCode = 401;
        throw error;
      }
      registeredUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Incorrect password!');
        error.statusCode = 401;
        throw error;
      }
      const accesstoken = jwt.sign(
        {
          email: registeredUser.email,
          userId: registeredUser._id.toString()
        },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: '1h' }
      );

      const refreshtoken = jwt.sign(
        {
          email: registeredUser.email,
          userId: registeredUser._id.toString()
        },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: '1y' }
      );
      res.status(200).json({ accesstoken: accesstoken, refreshtoken: refreshtoken, userId: registeredUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}