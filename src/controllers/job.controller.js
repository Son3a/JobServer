
const Job = require('../models/job.model');
const jobSchema = require('../schemas/job.schema');
const jwt = require('jsonwebtoken');
const { uploadImage } = require('../services/uploadImage.service');
module.exports.create = (req, res, next) => {
  const { name, description, requirement, postingDate, deadline, salary, locationWorking, idOccupation, idCompany, gender, experience, workingForm, amount } = req.body;
  new Job(undefined,
    name,
    description,
    requirement,
    postingDate,
    deadline,
    salary,
    locationWorking,
    idOccupation,
    idCompany,
    amount,
    experience,
    workingForm,
    gender)
    .create()
    .then(user => {
      res.status(200).json({ message: 'create job success', success: true, data: user })
    })
    .catch(err => res.status(501).json({ message: err.message, success: err.isSuccess }))
}

module.exports.readOne = (req, res, next) => {
  const { id } = req.query;
  const token = req.header('Authorization')
  new Job()
    .readOne(id, token)
    .then(rel => {
      res.status(200).json({ message: 'get job success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}
module.exports.readAll = (req, res, next) => {
  var page = req.query.page
  new Job()
    .getAll(page)
    .then(rel => {
      res.status(200).json({ message: 'get all job success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: false }))
}
module.exports.delete = (req, res, next) => {
  const { _id } = req.body
  console.log(req.body);
  new Job(
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined
  )
    .delete(_id)
    .then(rel => {
      res.status(200).json({ message: 'delete success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: false }))
}

module.exports.updateOne = (req, res, next) => {
  const { _id, name, description, requirement, hourWorking, postingDate, deadline, salary, locationWorking, idOccupation, idCompany, amount, gender, experience, workingForm } = req.body;
  const job = new jobSchema()
  job._id = _id
  job.name = name
  job.description = description
  job.requirement = requirement
  job.hourWorking = hourWorking
  job.postingDate = postingDate
  job.updateDate = new Date()
  job.deadline = deadline
  job.salary = salary
  job.status = true;
  job.locationWorking = locationWorking
  job.idOccupation = idOccupation
  job.idCompany = idCompany
  job.amount = amount
  job.experience = experience
  job.workingForm = workingForm
  job.gender = gender
  new Job()
    .update(job)
    .then((rel) => { res.status(200).json({ message: 'update job success', success: true, job: rel }) })
    .catch(err => { res.status(500).json({ message: err.message, success: err.isSuccess }) })
}

module.exports.getAllSortByDate = (req, res, next) => {
  new Job()
    .getSortByDate()
    .then(rel => {
      res.status(200).json({ message: 'get all job success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}


// loc job  NGUOI TIM VIEC
// get suggest job name by keyword search
module.exports.getSearchByKey = (req, res, next) => {
  //console.log(req.query.keyword)
  new Job()
    .searchByKey(req.query.keyword)
    .then((rel) => { return res.status(200).json({ success: true, message: "filter job success", data: rel }) })
    .catch(err => res.status(404).json({ message: "filter job fail", success: false, error: err.message }))
}
// Tim kiem viec lam
// filter anh seach job by keyword
module.exports.getSearchJob = (req, res, next) => {
  const condition = req.body
  new Job()
    .findJob(condition)
    .then((rel) => { return res.status(200).json({ count: rel.length, success: true, message: "search job success", data: rel }) })
    .catch(err => res.status(404).json({ message: "search job fail", success: false, error: err.message }))
}
//xem tat ca cac job da dang doi' voi NHA TUYEN DUNG
module.exports.getAllJobModerator = (req, res, next) => {
  const token = req.header('Authorization')
  if (token) {
    const accessToken = token.split(" ")[1]
    try {
      var decode = jwt.verify(accessToken, process.env.SECRET_TOKEN_KEY)
      if (decode) {
        //console.log(decode)
        new Job()
          .getAllJobModerator(decode._id)
          .then((rel) => res.status(200).json({ success: true, message: "get job success", data: rel }))
          .catch(err => res.status(404).json({ message: "get job fail", success: false, error: err }))
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Server is error", isSuccess: false })
    }
  }

}
module.exports.uploadImage = (req, res, next) => {
  console.log(req.file.filename);
}

// hien thị danh sách các job theo company.
// List all job of a specific company.
// url: http://localhost:8000/job/list/company/:id
// id: companyId
module.exports.listJobByCompany = (req, res, next) => {
  try {
    var companyId = req.params.id
    var companyName = req.query.name
    new Job()
      .listJobByCompany(companyId, companyName)
      .then((data) => { res.status(200).json({ message: "get success", data: data, isSuccess: true }) })
      .catch((err) => { res.status(500).json({ message: err.message, isSuccess: false }) })

  }
  catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false })
  }
}
module.exports.listJobByCompanyAdmin = (req, res, next) => {
  try {
    var companyId = req.params.id
    var companyName = req.query.name
    new Job()
      .listJobByCompanyAdmin(companyId, companyName)
      .then((data) => { res.status(200).json({ message: "get success", data: data, isSuccess: true }) })
      .catch((err) => { res.status(500).json({ message: err.message, isSuccess: false }) })

  }
  catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false })
  }
}
//thong ke, bieu do
module.exports.listJobByOccupatiton = (req, res, next) => {
  new Job().statisticalJobByOccupation(5)
    .then((data) => { res.status(200).json({ message: "get success", data: data, isSuccess: true }) })
    .catch((err) => { res.status(500).json({ message: err.message, isSuccess: false }) })

}

module.exports.listNewJob = (req, res, next) => {
  new Job().statisticalNewCreateJob('month')
    .then((data) => { res.status(200).json({ message: "get success", data: data, isSuccess: true }) })
    .catch((err) => { res.status(500).json({ message: err.message, isSuccess: false }) })
}
module.exports.customStatistical = (req, res, next) => {
  var option = req.query.option
  option = Number.parseInt(option)
  if (option == NaN) option = 0;
  new Job().dailyStatiistical(option)
    .then((data) => { res.status(200).json({ message: "get success", data: data, isSuccess: true }) })
    .catch((err) => { res.status(500).json({ message: err.message, isSuccess: false }) })
}
module.exports.applicationByOccupation = (req, res, next) => {
  new Job().statisticalApplicationByOccupation('month')
    .then((data) => { res.status(200).json({ message: "get success", data: data, isSuccess: true }) })
    .catch((err) => { res.status(500).json({ message: err.message, isSuccess: false }) })
}
module.exports.mostApplicationJob = (req, res, next) => {
  new Job().mostApplicationJob('month')
    .then((data) => { res.status(200).json({ message: "get success", data: data, isSuccess: true }) })
    .catch((err) => { res.status(500).json({ message: err.message, isSuccess: false }) })
}
