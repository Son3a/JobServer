const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require : true
  },
  avatar :{
    type: String
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    require: true
  },
  role : {
    type : String,
    require : true
  },
  refreshToken : {
    type: String
  },
  confirmPasswordCode : {
    type : Number
  },
  jobFavourite : [
    {
      jobId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Job'
      },
      createdAt : {
        type : Date,
        default : new Date()
      },
    }
  ],
  tokenDevice : {
    type : String
  }
})

userSchema.methods.addJobFavourite = function (job) {
  const listJobFavouriteNew = [...this.jobFavourite, {
    jobId : job,
    createdAt : new Date()
  }]
  this.jobFavourite = listJobFavouriteNew;
  return this.save();
}

userSchema.methods.removeJobFavourite = function (job) {
  const listJobFavouriteNew = [...this.jobFavourite].filter(item => JSON.stringify(item.jobId) !== JSON.stringify(mongoose.Types.ObjectId(job)))
  this.jobFavourite = listJobFavouriteNew;

  return this.save();
}



module.exports = mongoose.model("User", userSchema)