const jobSchema = require('../schemas/job.schema')
const companySchema = require('../schemas/company.schema')
const applicationSchema = require('../schemas/application.schema')
module.exports = {
    dailyStatistical: async (req, res, next) => {
        const applies = await applicationSchema.find({ submitDate: new Date() })
        const companies = await companySchema.find({ isDelete: false })
        const jobs = await jobSchema.find({ postingDate: new Date(), status: true })
        res.json({ applies: applies, companies: companies, jobs: jobs })
    }
}