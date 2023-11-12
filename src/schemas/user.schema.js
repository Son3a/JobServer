const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  avatar: {
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
  password: {
    type: String,
    require: true
  },
  role: {
    type: String,
    require: true
  },
  refreshToken: {
    type: String
  },
  confirmPasswordCode: {
    type: Number
  },
  jobFavourite: [
    {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      },
      createdAt: {
        type: Date,
        default: new Date()
      },
    }
  ],
  tokenDevice: {
    type: String
  },
   idCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    require: true
  }
})

userSchema.methods.addJobFavourite = function (job) {
  //('job save: ', job)
  const listJobFavouriteNew = [...this.jobFavourite, {
    jobId: job,
    createdAt: new Date()
  }]
  this.jobFavourite = listJobFavouriteNew;
  return this.save();
}

userSchema.methods.removeJobFavourite = function (job) {
  //('job remove: ', job)
  const listJobFavouriteNew = [...this.jobFavourite].filter(item => JSON.stringify(item.jobId) !== JSON.stringify(mongoose.Types.ObjectId(job)))
  this.jobFavourite = listJobFavouriteNew;

  return this.save();
}



module.exports = mongoose.model("User", userSchema)