
const Occupation = require('../models/occupation.model');
const occupationSchema = require('../schemas/occupation.schema');

module.exports.create = (req, res, next) => {
  const { name } = req.body;
  new Occupation(undefined,
    name
  )
    .create()
    .then(user => {
      res.status(200).json({ message: 'add new occupation success', success: true, data: user })
    })
    .catch(err => res.status(501).json({ message: err.message, success: err.isSuccess }))
}

module.exports.getOne = (req, res, next) => {
  console.log(req.params)
  const { id } = req.params;
  new Occupation()
    .readOne(id)
    .then(rel => {
      res.status(200).json({ message: 'get occupation success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}
module.exports.getAll = (req, res, next) => {
  const page = req.query.page
  new Occupation()
    .readAll(page)
    .then(rel => {
      res.status(200).json({ message: 'get all occupation success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}
module.exports.updateOne = (req, res, next) => {
  const { _id, name } = req.body;
  const occup = new occupationSchema()
  occup._id = _id
  occup.name = name
  new Occupation()
    .update(occup)
    .then((rel) => { res.status(200).json({ message: 'update job success', success: true, job: rel }) })
    .catch(err => { res.status(500).json({ message: err.message, success: err.isSuccess }) })
}
module.exports.delete = (req, res, next) => {
  const { _id } = req.body;
  const occup = new occupationSchema()
  occup._id = _id
  new Occupation()
    .delete(_id)
    .then((rel) => { res.status(200).json({ message: 'delete occupation success', success: true }) })
    .catch(err => { res.status(500).json({ message: err.message, success: err.isSuccess }) })
}










