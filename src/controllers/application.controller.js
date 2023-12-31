const applicationModel = require('../models/application.model')
const { getUserIdFromJWTToken } = require('../middlewares/index')
const companySchema = require('../schemas/company.schema')
const applicationSchema = require('../schemas/application.schema')
const { upload } = require('../services/uploadImage.service')
module.exports = {
    create: (req, res, next) => {
        //(req.file)
        const rel = getUserIdFromJWTToken(req.header('Authorization'))
        if (rel.success) {
            const idJobSeeker = rel.message
            const { idJob, cv, nameSeeker, emailSeeker, phoneSeeker, letterRecommendation } = req.body
            new applicationModel(
                undefined,
                idJobSeeker,
                idJob,
                req.file.fileUrl,
                nameSeeker,
                phoneSeeker,
                emailSeeker,
                letterRecommendation,
                new Date()
            )
                .create()
                .then((rel) => res.status(200).json({ message: 'application job success', success: true, data: rel }))
                .catch((err) => res.status(500).json({ message: 'failed', success: err.isSuccess }))
        } else {
            return res.status(500).json({ message: 'failed', success: false, detail: rel.message })
        }
    },
    getAll: (req, res, next) => {
        const { idCompany } = req.query
        new applicationModel()
            .getAll(idCompany)
            .then((rel) => res.status(200).json({ message: 'get all application success', success: true, data: rel }))
            .catch((err) => res.status(500).json({ message: 'failed', success: err.isSuccess }))
    }
    , getOne: (req, res, next) => {
        const { id } = req.body
        new applicationModel()
            .getOne(id)
            .then((rel) => res.status(200).json({ message: 'get one application success', success: true, data: rel }))
            .catch((err) => res.status(500).json({ message: 'failed', success: err.isSuccess }))
    }
    ,
    //lấy tất cả những application của job cụ thể
    getAllByJobId: (req, res, next) => {
        const jobId = req.query.jobid
        const page = req.query.page
        ////(jobId)
        new applicationModel()
            .getAllByJobId(jobId, page)
            .then((rel) => res.status(200).json({ success: true, message: "get application success", data: rel }))
            .catch((err) => res.status(500).json({ success: false, message: "get application failed", error: err }))
    },
    getAllByUserrId: (req, res, next) => {
        const token = req.header('Authorization')
        const decode = getUserIdFromJWTToken(token)
        if (decode.success) {
            const page = req.query.page
            const userId = decode.message
            ////(jobId)
            new applicationModel()
                .getAllByUserId(userId, page)
                .then((data) => res.status(200).json({ success: true, message: "get application success", data: data }))
                .catch((err) => res.status(500).json({ success: false, message: "get application failed", error: err }))
        } else {
            return res.status(500).json({ success: false, message: "get application failed" })
        }
    },
    getAllApplicationByCompanyId: (req, res, next) => {
        const token = req.header('Authorization')
        const decode = getUserIdFromJWTToken(token)
        ////(jobId)
        if (decode.message === false) { res.status(500).json({ success: false, message: "get application failed", error: 'user is not correct!' }) }
        new applicationModel()
            .getAllApplicationByCompanyId(decode.message)
            .then((rel) => res.status(200).json({ success: true, message: "get application by company success", data: rel }))
            .catch((err) => res.status(500).json({ success: false, message: "get application by company failed", error: err }))
    }
}