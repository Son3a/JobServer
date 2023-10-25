const validate = require('express-validator')
const companySchema = require('../../schemas/company.schema')
const { default: mongoose } = require('mongoose')
const occupationSchema = require('../../schemas/occupation.schema')
const { job_validate, company_validate } = require('../../services/validate/job.class.validate')
const { getUserIdFromJWTToken } = require('..')

module.exports = {
    JobValidateMiddleware: async (req, res, next) => {
        const validate = new job_validate();
        const result = await validate.JobValidate(req.body)
        if (result == null) next()
        else res.send(result)
    },
    CompanyValidateMiddleware: async (req, res, next) => {
        const token = req.header('Authorization')
        var userId = getUserIdFromJWTToken(token)
        if (userId.success == false) res.sennd('user is undefined')
        else {
            const validate = new company_validate();
            var data = req.body
            data.idUser = userId.message;
            const result = await validate.CompanyValidate(data)
            if (result == null) next()
            else res.send(result)
        }
    }
}