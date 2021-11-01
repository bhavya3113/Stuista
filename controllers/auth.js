const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const dotenv = require("dotenv");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

dotenv.config();

const User = require("../models/users");
const Otp = require("../models/otp");
const mail = require("../utils/sendemail");

var emailregex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed ");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

const fullname = req.body.fullname;
const email = req.body.email;
const password = req.body.password;

if (!(email && password && fullname)) {
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
    fullname: fullname,
    email: email,
    password: hashedPassword,
    isVerified: "false"
  });
   user.save();
})
.then(results=>{
  
  res.status(201).json({message:'user created', email:email,fullname:fullname});
  let otp = otpGenerator.generate(6, {
    alphabets: false,
    specialChars: false,
    upperCase: false,
  });
  const onetimepwd = new Otp({
    email:email,
    otp:otp
  });
   onetimepwd.save();
  //  res.status(200).json({
  //   message: "otp sent",
  //   email: email,
  // });
  return mail.sendEmail(email,otp,fullname); 
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

exports.resendotp =(req,res,next)=>{
  const email = req.body.email;
  const fullname = req.body.fullname;
  let otp = otpGenerator.generate(6, {
    alphabets: false,
    specialChars: false,
    upperCase: false,
  });
  const onetimepwd = new Otp({
    email:email,
    otp:otp
  });
   onetimepwd.save();
  //  res.status(200).json({
  //   message: "otp sent",
  //   email: email,
  // });
  return mail.sendEmail(email,otp,fullname);
}
exports.verifybeforereset = (req,res,next)=>{
  const email = req.body.email;
  const fullname = req.body.fullname;
  User.findOne({ email: email })
  .then(user=>{
    if(!user)
    {
     return res.send("not registered");
    }
    let otp = otpGenerator.generate(6, {
      alphabets: false,
      specialChars: false,
      upperCase: false,
    });
    const onetimepwd = new Otp({
      email:email,
      otp:otp
    });
     onetimepwd.save();
    return mail.sendEmail(email,otp,fullname);
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    //res.json({message: "user is not registered"});
  });
 
}
exports.resetPassword=(req,res,next)=>{
  const email = req.body.email;
  const newPwd = req.body.newPwd;
  const confirmPwd = req.body.confirmPwd;
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
      if(newPwd != confirmPwd)
      {
        const error = new Error("Passwords do not match");
        error.statusCode = 422;
        throw error;
      }
      bcrypt.hash(newPwd, 12)
      .then(hashedPassword => {
      User.findOne({ email: email })
          .then((user) => {
            user.password = hashedPassword;
            user.save()
          .then((result) => {
            res.json({ messsage: "new password saved",result });
            })
          })
          .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 500;
              console.log(err);
            }
            res.json({message: "password not saved"});
          });
        })
       .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
      console.log(err);
    }
  });
});
})
};

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
      if (user.isVerified=="false") {
        // res.status(200).json({
        //     message: "user not verified. kindly check your mail for otp and verify your account"
        //   })

        let otp = otpGenerator.generate(6, {
          alphabets: false,
          specialChars: false,
          upperCase: false,
        });
        const onetimepwd = new Otp({
          email:user.email,
          otp:otp
        });
         onetimepwd.save();
        
        const sendingotp = mail.sendEmail(email,otp,user.fullname);
        const error = new Error('User not verified.Email has been sent for verification');
        error.statusCode = 401;
        throw error;

      }
      if(user.isVerified == "true"){
      registeredUser = user;
      return bcrypt.compare(password, user.password);}
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
        { expiresIn: '24h' }
      );
      res.status(200).json({accesstoken,userId: registeredUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}