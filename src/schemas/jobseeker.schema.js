const mongoose = require("mongoose");
const userSchema = require("./user.schema");

const jobseekerSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  country: {
    type: String,
    require: true
  },
  education: {
    type: String,
    require: true
  },
  experience: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  }

})

module.exports = mongoose.model("JobSeeker", jobseekerSchema)