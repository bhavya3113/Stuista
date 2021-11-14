const mongoose = require("mongoose");
const schema = mongoose.Schema;

const instructorSchema = new schema({

  details:{
    type: schema.Types.ObjectId,
    require:true,
    ref:'users',
  },
  verifiedasInstructor:{
    type: String,
    require: true,
    default:"false"
  },
  course:[{
    type:schema.Types.ObjectId,
    ref:"course"
  }],
  experience:{
    type: String,
    require:true
  },
  areaofexpertise:{
    type: String,
    require:true
  }
})

module.exports = mongoose.model("instructor",instructorSchema);