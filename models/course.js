const mongoose = require("mongoose");
const schema = mongoose.Schema;

const courseSchema = new schema({
  title:{
    type: String,
    require: true
  },
  category:{
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
    avgrating:{ 
      type: Number,
    require: false,
    },
    totalrating:[{
    type: Number,
    require: false,
    min:1,
    max:5,
    }],
    
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
    type: String,
    require:true
  },
  instructorDetails:{
    type: schema.Types.ObjectId,
    require:true,
    ref:'users',
  },
  videosArray:[{
    type: String,
    require: true
  }],
  reviews: [{
    userreview:{
      type: String,
      require: false,
      },
      user:{ 
        type: schema.Types.ObjectId,
        ref:'users',
        require: false,
      },
      createdAt: { type: Date, default: Date.now },
  }],
},
{ timestamps: true }
)

module.exports = mongoose.model("course",courseSchema);