const mongoose = require("mongoose");
const jobseekerSchema = require("./jobseeker.schema");
const companySchema = require("./company.schema");

const applicationSchema = new mongoose.Schema({
  idJobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  idJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    require: true
  },
  cv: {
    type: String,
    require: true
  },
  nameSeeker: {
    type: String,
    require: true
  },
  phoneSeeker: {
    type: String,
    require: true
  },
  emailSeeker: {
    type: String,
    require: true
  },
  letterRecommendation:{
    type: String,
    require: false
  },
  submitDate: {
    type: Date,
    require: true,
    default: new Date()
  }
})

module.exports = mongoose.model("Application", applicationSchema)