const statisticalController = require('../controllers/statistical.controller');

module.exports = require('express').Router()
    .get("/daily-statistical", statisticalController.dailyStatistical)
    .get("/week-statistical", statisticalController.dailyStatistical)
    .get("/month-statistical", statisticalController.dailyStatistical)
    //
    .get("/chart/job-by-occupation", statisticalController.dailyStatistical)
    .get("/chart/new-job-create", statisticalController.dailyStatistical)
    .get("/apply-by-occupation", statisticalController.dailyStatistical)
    .get("/nothing", statisticalController.dailyStatistical)
