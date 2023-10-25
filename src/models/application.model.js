const { default: mongoose } = require("mongoose")
const applicationSchema = require("../schemas/application.schema")
const companySchema = require("../schemas/company.schema")
const jobSchema = require("../schemas/job.schema")
const jobseekerSchema = require("../schemas/jobseeker.schema")
const userSchema = require("../schemas/user.schema")
const { pushNotification } = require("../utils")

module.exports = class ApplicationModel {
    #id
    #idJobSeeker
    #idJob
    #cv
    #submitDate

    constructor(id, idJobSeeker, idJob, cv, submitDate) {
        this.#id = id
        this.#idJobSeeker = idJobSeeker
        this.#idJob = idJob
        this.#cv = cv
        this.#submitDate = submitDate
    }
    create = () => {
        return new Promise(async (resolve, reject) => {
            const app = new applicationSchema()
            app.idJobSeeker = this.#idJobSeeker
            app.idJob = this.#idJob
            app.cv = this.#cv
            app.submitDate = new Date()

            const tokenDeviceSeeker = await userSchema.findById(this.#idJobSeeker).then(result => {
                return result?.tokenDevice;
            });
            const tokenDeviceAdmin = await jobSchema.findById(this.#idJob).populate({
                path : 'idCompany',                
                populate : {
                    path : 'idUser',
                }    
            }).then(result => result?.idCompany?.idUser?.tokenDevice);
            app.save()
                .then((rel) => 
                {
                    if (tokenDeviceSeeker && tokenDeviceAdmin)  {
                        pushNotification(tokenDeviceSeeker , "Chúc mừng bạn đã nộp CV thành công !");
                        pushNotification(tokenDeviceAdmin , "Vừa có người mới nộp hồ sơ !");
                    }
                    return resolve(rel)
                })
                .catch(err => reject(err))
        })
    }
    confirm = () => {
        return new Promise((resolve, reject) => {

        })
    }
    reject = () => {
        return new Promise((resolve, reject) => {

        })
    }
    getAll = (idJob) => {
        return new Promise((resolve, reject) => {
            applicationSchema.find({})
                .then((rel) => resolve(rel))
                .catch(err => reject(err))
        })
    }
    getOne = (id) => {
        return new Promise((resolve, reject) => {
            applicationSchema.findById(id)
                .then((rel) => resolve(rel))
                .catch(err => reject(err))
        })
    }
    getAllByJobId = (jobId, page) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await applicationSchema.find({ idJob: jobId }).populate('idJobSeeker');
                const page_limit = process.env.PAGE_LIMIT
                const applies_total = result.length
                const page_total = Math.ceil(applies_total / page_limit)
                if (page == undefined) {
                    resolve({ data: result.slice(0, page_limit), page_total: page_total, current_page: 0, page_limit: page_limit })
                }
                page = Number.parseInt(page)
                if (page >= 0 && page <= page_total) {
                    resolve({ data: result.slice(page_limit * page + 1, page_limit * (page + 1)), page_total: page_total, current_page: page, page_limit: page_limit })
                }
                else reject({ message: "can't get list application" })
            } catch (error) {
                reject(error)
            }
            //check xem user da~ apply chua, neu roi` thi tra ve false
            // const apply = await applicationSchema.find({ idJob: jobId}).exec()
            // if (apply) {
            //     return reject("You already apply this job")
            // }
        })
    }
    // danh sach cong viec da apply
    getAllByUserId = (userId, page) => {

        //console.log(userId)
        return new Promise(async (resolve, reject) => {
            try {
                const result = await applicationSchema.find({ idJobSeeker: mongoose.Types.ObjectId(userId) })
                    .populate({ path: 'idJob', populate: { path: 'idCompany' } });
                const page_limit = process.env.PAGE_LIMIT
                const applies_total = result.length
                const page_total = Math.ceil(applies_total / page_limit)
                if (page == undefined) {
                    resolve({ data: result.slice(0, page_limit), page_total: page_total, current_page: 0, page_limit: page_limit })
                }
                page = Number.parseInt(page)
                if (page >= 0 && page <= page_total) {
                    resolve({ data: result.slice(page_limit * page, page_limit * (page + 1) - 1), page_total: page_total, current_page: 0, page_limit: page_limit })
                }
                else reject({ message: "can't get list application" })
            } catch (error) {
                reject(error)
            }
        })
    }
    getAllApplicationByCompanyId = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var company = await companySchema.findOne({ idUser: mongoose.Types.ObjectId(userId) })
                if (company !== null) {
                    var result = await applicationSchema.find()
                        .populate('idJob');
                    result = result.filter(a => (a.idJob.idCompany.toString() == company._id.toString()))
                    if (result.length >= 0) {
                        return resolve(result)
                    }
                    else return reject({ message: "can't get list application" })
                }
                else {
                    return reject({ message: 'company is not exists' })
                }
            } catch (error) {
                console.log(error)
                return reject({ message: error })
            }
        })
    }
}