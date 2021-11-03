const mongoose = require("mongoose");
const schema = mongoose.Schema;

const courseSchema = new schema({
  title:{
    type: String,
    require: true
  },
  duration:{
    type: String,
    require: true
  },
  preRequisites:{
    type: String,
    require:true
  },
  instructorName:{
    type: String,
    require:true 
  },
  introduction:{
    type: String,
    require: true
  },
  description:{
    type: String,
    require: true
  },
  price:{
    type: String,
    require:true
  },
  rating:{
    type: Number,
    require: false
  },
  language:{
    type: String,
    require: true
  },
  skillsLearned:{
    type: String,
    require: true
  },
  imageUrl:{
    type:string,
    require:true
  },
  instructorDetails:{
    type: schema.Types.ObjectId,
    require:true,
    ref:'user',
  }
},
{ timestamps: true }
)

module.exports = mongoose.model("course",courseSchema);