const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");

const User = require("../models/users");

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
    password: hashedPassword
  });
 return  user.save();
})
.then(results=>{
  res.status(201).json({message:'user created', email:email,firstname:firstname});
  console.log(results);
})
.catch(err => {
  if (!err.statusCode) {
    err.statusCode = 500;
    console.log(err);
  }
});
}