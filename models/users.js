const mongoose = require("mongoose");
const schema = mongoose.Schema;
const path = require("path");

const userSchema = new schema({
  fullname:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true
  },
  password:{
    type: String,
    require:true
  },
  isVerified:{
    type: String,
    require: true
  },
  verifiedasInstructor:{
    type: String,
    require: true,
    default:"false"
  },
  mycourses:[{
    type:schema.Types.ObjectId,
    ref:"course"
  }],
  cart:[{
    type:schema.Types.ObjectId,
    ref:"course"
  }],
  favourites:[{
    type:schema.Types.ObjectId,
    ref:"course"
  }],
  imageUrl:{
    type: String,
    default:  path.join('images','image-noprofile.png')
  }
})

module.exports = mongoose.model("users",userSchema);