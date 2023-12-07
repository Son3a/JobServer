
const { getUserIdFromJWTToken } = require('../middlewares');
const Company = require('../models/company.model');
const companySchema = require('../schemas/company.schema');
const UserSchema = require('../schemas/user.schema')

module.exports.create = (req, res, next) => {
  const token = req.header('Authorization')
  const accesstoken = getUserIdFromJWTToken(token)
  const { name, totalEmployee, type, about, phone, location, link, address, image } = req.body;
  var imageData;
  if (image) {
    imageData = image
  } else {
    imageData = "https://i.pinimg.com/736x/94/e9/74/94e974368873b7e323e68b0af7028ec5.jpg"
  }
  if (accesstoken.success == false) res.status(501).json({ message: 'User is not defined', success: false })
  else {
    console.log(accesstoken.message);
    new Company(
      undefined, name, totalEmployee, null, about, null, false, null, address, imageData, link
    )
      .create(accesstoken.message)
      .then(async (company) => {
        //('thanh cong!')
        await UserSchema.updateOne({ _id: accesstoken.message }, { idCompany: company._id })

        res.status(200).json({ message: 'add new company success', success: true, data: company })
      })
      .catch(err => res.status(501).json({ message: err.message, success: err.isSuccess }))
  }
}

module.exports.getOne = (req, res, next) => {
  const { id } = req.query;
  new Company()
    .readOne(id)
    .then(rel =>
      res.status(200).json({ message: 'get company success', success: true, data: rel })
    )
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}
/**
 * @openapi
 * /company/list:
 *   get:
 *     summary: Returns all company.
 *     responses: 
 *       '200':
 *         description: OK
 */
module.exports.getAll = (req, res, next) => {
  var page = req.query.page
  new Company()
    .readAll(page)
    .then(rel => {
      res.status(200).json({ message: 'get all  company  success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}

module.exports.getPaging = (req, res, next) => {
  try {
    new Company(
      undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined
    )
      .getPaging(req.params.name, req.query.page)
      .then(rel => {
        res.status(200).json({ message: 'get all  company  success', success: true, data: rel })
      })
      .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
  }
  catch (e) {
    res.status(500).json({ message: 'get all  failed', success: false })
  }
}

module.exports.updateOne = (req, res, next) => {
  const { _id, name, totalEmployee, type, about, phone, location, image, address, link, idUser } = req.body;
  const company = new companySchema()
  company._id = _id
  company.name = name
  company.totalEmployee = totalEmployee
  company.type = type
  company.about = about
  company.phone = phone
  company.location = location
  company.address = address
  company.link = link
  company.image = image
  company.idUser = idUser
  new Company()
    .update(company)
    .then((rel) => { res.status(200).json({ message: 'update company success', success: true, relsult: rel }) })
    .catch(err => { res.status(500).json({ message: err.message, success: err.isSuccess }) })
}

module.exports.delete = (req, res, next) => {
  const { _id } = req.body
  new Company()
    .delete(_id)
    .then((rel) => { res.status(200).json({ message: 'delete company success', success: true, relsult: rel }) })
    .catch(err => { res.status(500).json({ message: err.message, success: err.isSuccess }) })
}









