const firebaseController = require('../controllers/firebase.controller')

module.exports = require('express').Router()
  .get("/", firebaseController.get)