const mongoose = require("mongoose");

const occupationSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model("Tag", TagSchema)