const mongoose = require("mongoose");
const userSchema = require("./user.schema");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  totalEmployee: {
    type: Number,
    require: true
  },
  type: {
    type: String,
    require: true
  },
  about: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  location: {
    type: String,
    require: true
  },
  isDelete: {
    type: Boolean,
    default: false
  }
  ,
  createDate: {
    type: Date,
    require: true
  }
  ,
  link: {
    type: String
  },
  image: {
    type: String
  },
  address: {
    type: String
  }
})

module.exports = mongoose.model("Company", companySchema)