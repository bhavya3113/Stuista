const mongoose = require("mongoose");
const schema = mongoose.Schema;

const instructorSchema = new schema({

  details:{
    type: schema.Types.ObjectId,
    require:true,
    ref:'users',
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