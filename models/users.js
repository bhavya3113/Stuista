const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  firstname:{
    type: String,
    require: true
  },
  lastname:{
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
    type: Boolean,
    default:false
    // type: String,
    // require: true,
  }
})

module.exports = mongoose.model("users",userSchema);