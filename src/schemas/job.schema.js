const mongoose = require("mongoose");
const companySchema = require("./company.schema");
const occupationSchema = require("./occupation.schema");

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  requirement: {
    type: String,
    require: true
  },
  postingDate: {
    type: Date,
    require: true,
    default: new Date()
  },
  updateDate: {
    type: Date,
    require: true,
    default: new Date()
  },
  deadline: {
    type: Date,
    require: true,
    default: new Date()
  },
  salary: {
    type: String,
    require: true
  },
  locationWorking:
  {
    type: String,
    require: true
  }
  ,
  idCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    require: true
  },
  idOccupation:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Occupation",
    require: true
  }
  ,
  status: {
    type: Boolean,
    require: true,
    default: true
  },
  workingForm: {
    type: String,
    require: true
  },
  experience: {
    type: String,
    require: true
  },
  amount: {
    type: Number,
    require: true
  },
  gender: {
    type: String,
    require: true
  },
})

module.exports = mongoose.model("Job", jobSchema)