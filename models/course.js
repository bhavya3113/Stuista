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
  instructorEmail:{
    type: String,
    require:true 
  },
  instructorExperience:{
    type: String,
    require:true 
  },
  instructorId:{
    type: schema.Types.ObjectId,
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
    type: Number,
    require:true
  },
  rating:{
    eachrating:[{
    user:{ 
      type: schema.Types.ObjectId,
      ref:'users'
    },
    rate:{
    type: Number,
    require: false,
    min:1,
    max:5,
    },
  }],
},
avgrating:{ 
  type: Number,
require: false,
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