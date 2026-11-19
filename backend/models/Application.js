const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
  jobId:{type:String,required:false},
  jobTitle:{type:String,required:true},
  company:{type:String,required:true},
  applicantName:{type:String,required:true},
  applicantEmail:{type:String,required:true}
},{timestamps:true});
module.exports = mongoose.model("Application",applicationSchema);