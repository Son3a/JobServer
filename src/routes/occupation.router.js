const occupationController = require('../controllers/occupation.controller')
const { verifyTokenIsAdmin, verifyToken } = require('../middlewares')

module.exports = require('express').Router()
  .get("/list", occupationController.getAll)
  .get("/detail/:id", occupationController.getOne)
  .post("/create", verifyTokenIsAdmin, occupationController.create)
  .put("/update", verifyTokenIsAdmin, occupationController.updateOne)
  .delete("/delete", verifyTokenIsAdmin, occupationController.delete)
