const jobController = require('../controllers/job.controller')
const authController = require('../controllers/authentication.controller')
const { verifyToken, verifyTokenIsAdmin } = require('../middlewares')
const { upload } = require('../services/uploadImage.service')

module.exports = require('express').Router()
  //lấy ra tất cả job hiện có
  //lấy ra tất cả job hiện có
  .get("/list", jobController.readAll)
  //
  .get("/list/sort-by-date", jobController.getAllSortByDate)
  //thông tin chi tiết của job
  .get("/detail", jobController.readOne)
  //tạo job mới
  .post("/create", verifyTokenIsAdmin, jobController.create)
  //xóa job
  .patch("/delete", verifyTokenIsAdmin, jobController.delete)
  //update job
  .put("/update", verifyTokenIsAdmin, jobController.updateOne)
  // lọc job theo idOccupation, idCompany, Sắp xếp, ...
  .get("/search-by-key", jobController.getSearchByKey)
  //Lấy danh sách tất cả công việc đã đăng của 1 công ty
  .get("/list/all-moderator-job", verifyTokenIsAdmin, jobController.getAllJobModerator)
  .post("/list/search", jobController.getSearchJob)
  .get("/list/company/:id", jobController.listJobByCompany)
  .get("/list/company/admin/:id", jobController.listJobByCompanyAdmin)

  .post("/upload/image", upload.Image.single('fileUpload'), jobController.uploadImage)
  .post("/test-post-api", (req, res) => {
    res.send(`test post methos success, body: ${JSON.stringify(req.body)}.
            header : ${JSON.stringify(req.headers)}`)
  })
  .get("/statistical/job-by-occupation", jobController.listJobByOccupatiton)
  .get("/statistical/list-new-job", jobController.listNewJob)
  .get("/statistical/custom-statistical", jobController.customStatistical)
  .get("/statistical/application-by-occupation", jobController.applicationByOccupation)
  .get("/statistical/most-application-job", jobController.mostApplicationJob)
  .patch("/list-job-favourite", verifyToken, authController.addJobFavourite)