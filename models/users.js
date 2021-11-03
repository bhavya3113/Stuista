const mongoose = require("mongoose");
const schema = mongoose.Schema;

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
  cart:[{
    type:schema.Types.ObjectId,
    ref:"course"
  }],
  favourites:[{
    type:schema.Types.ObjectId,
    ref:"course"
  }]
})

module.exports = mongoose.model("users",userSchema);