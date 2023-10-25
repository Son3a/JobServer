const mongoose = require("mongoose");

const occupationSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  isDelete: {
    type: Boolean,
    require: true
  }
})

module.exports = mongoose.model("Occupation", occupationSchema)