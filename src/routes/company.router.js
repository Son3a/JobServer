const companyController = require('../controllers/company.controller')
const { verifyToken, verifyTokenIsAdmin } = require('../middlewares')

module.exports = require('express').Router()
  .get("/list", companyController.getAll)
  .get("/list/:name", companyController.getPaging)
  .get("/detail", companyController.getOne)
  .post("/create", verifyTokenIsAdmin, companyController.create)
  .patch("/update", verifyTokenIsAdmin, companyController.updateOne)
  .delete("/delete", verifyTokenIsAdmin, companyController.delete)