const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  title:{type:String,required:true,trim:true},
  company:{type:String,required:true,trim:true},
  location:{type:String,required:true},
  category:{type:String,required:true},
  salary:{type:String,default:"Not specified"},
  jobType:{type:String,default:"Full-time"},
  description:{type:String,required:true},
  skills:{type:[String],default:[]}
},{timestamps:true});
module.exports = mongoose.model("Job",jobSchema);