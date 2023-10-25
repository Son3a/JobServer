const jobSchema = require('../schemas/job.schema')
const companySchema = require('../schemas/company.schema')
const applicationSchema = require('../schemas/application.schema')
const { default: mongoose } = require('mongoose')
const { verifyToken, getUserIdFromJWTToken } = require('../middlewares')
const { chuanhoadaucau } = require('../services/standardVietNamWork')
const occupationSchema = require('../schemas/occupation.schema')
const { populate } = require('../schemas/user.schema')
const { Mongoose } = require('mongoose')
module.exports = class Job {
  id
  #name
  #description
  #requirement
  #hourWorking
  #postingDate
  #updateDate
  #deadline
  #salary
  #locationWorking
  #idOccupation
  #idCompany
  constructor(id, name, description, requirement, hourworking, postingdate, deadline, salary, locationworking, idoccupation, idcompany) {
    this.id = id
    this.#name = name
    this.#description = description
    this.#requirement = requirement
    this.#hourWorking = hourworking
    this.#postingDate = postingdate
    this.#updateDate = new Date()
    this.#deadline = deadline
    this.#salary = salary
    this.#locationWorking = locationworking
    this.#idOccupation = idoccupation
    this.#idCompany = idcompany
  }
  create = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const company = await companySchema.findById(this.#idCompany)
        const occupation = await occupationSchema.findById(this.#idOccupation)
        console.log(company, occupation)
        if (company == null || company.isDelete) reject({ message: "company is undefined" })
        if (occupation == null || occupation.isDelete) reject({ message: "Occupattion is undefined" })
        const job = new jobSchema()
        job.name = this.#name
        job.description = this.#description
        job.requirement = this.#requirement
        job.hourWorking = this.#hourWorking
        job.postingDate = this.#postingDate
        job.deadline = this.#deadline
        job.salary = this.#salary
        job.locationWorking = this.#locationWorking
        job.updateDate = new Date()
        job.idOccupation = this.#idOccupation
        job.idCompany = this.#idCompany
        job.status = true
        job.save()
          .then((rel) => resolve(rel))
          .catch((err) => { reject(err) })
      } catch (error) {
        reject({ message: "a undefined exception: " + error.message })
      }
    })
  }
  delete = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        var jobFind = await jobSchema.findOne({ _id: id });
        console.log(jobFind, id);
        if (!jobFind?.status) {
          reject({ message: "job already deleted" })
        } else {
          jobSchema.findByIdAndUpdate(id, { status: false })
            .then((res) => resolve(res))
            .catch(err => reject(err))
        }
      } catch (error) {
        reject(error)
      }
    })
  }
  getAll = (page) => {
    return new Promise(async (resolve, reject) => {
      const page_limit = process.env.PAGE_LIMIT
      const total_job = await jobSchema.countDocuments()
      const page_total = Math.ceil(total_job / page_limit)
      if (page === undefined) {
        return jobSchema.find({ status: true }).limit(page_limit)
          .populate('idCompany')
          .populate('idOccupation')
          .then((job) => { return resolve({ data: job, page_total: page_total, current_page: 0, job_per_page: Number.parseInt(page_limit) }) })
          .catch((err) => { reject(err) })
      }
      page = Number.parseInt(page)
      if (page >= 0 && page < page_total) {
        return jobSchema.find({ status: true }).skip(page * page_limit).limit(page_limit)
          .populate('idCompany')
          .populate('idOccupation')
          .then((job) => { return resolve({ data: job, page_total: page_total, current_page: page, job_per_page: Number.parseInt(page_limit) }) })
          .catch((err) => { reject(err) })
      }
      else reject({ message: "can't get list job" })
    })
  }
  readOne = (id, token) => {
    return new Promise((resolve, reject) => {
      try {
        const userId = getUserIdFromJWTToken(token)
        //console.log(userId)
        if (userId.success) {
          jobSchema.findById(id)
            .populate('idCompany')
            .populate('idOccupation')
            //console.log('job ' + job);
            .then(async (job) => {
              job = job.toObject()
              var numApply = await applicationSchema.find({ idJob: mongoose.Types.ObjectId(job._id) })
              var isApply = await applicationSchema.find({ idJob: mongoose.Types.ObjectId(job._id), idJobSeeker: mongoose.Types.ObjectId(userId.message) })
              var relatedJob = await jobSchema.find({
                deadline: { $gte: new Date() }, status: true, $or: [{ idCompany: job.idCompany._id }, { requirement: job.requirement }]
              })
                .limit(3)
                .populate('idCompany');
              relatedJob = relatedJob.filter(j => j._id.toString() != job._id.toString())
              if (isApply.length > 0) job.isApply = true;
              else job.isApply = false;
              job['numApply'] = numApply.length;
              job['relatedJob'] = relatedJob
              //console.log('job: ' + job)
              return resolve(job)
            })
            .catch((err) => reject(err))
        }
      }
      catch (e) {
        jobSchema.findById(id)
          .populate('idCompany')
          .populate('idOccupation')
          //console.log('job ' + job);
          .then(async (job) => {
            var numApply = await applicationSchema.find({ idJob: mongoose.Types.ObjectId(job._id) })
            var relatedJob = await jobSchema.find({
              deadline: { $gte: new Date() }, status: true, $or: [{ idCompany: job.idCompany._id }, { requirement: job.requirement }]
            })
              .limit(3)
              .populate('idCompany');
            relatedJob = relatedJob.filter(j => j._id.toString() != job._id.toString())
            job = job.toObject()
            job['numApply'] = numApply.length;
            job['isApply'] = false
            job['relatedJob'] = relatedJob
            //console.log('job: ' + job)
            return resolve(job)
          })
          .catch((err) => reject(err))
      }
    })
  }
  update = (job) => {
    return new Promise(async (resolve, reject) => {
      try {
        var jobFind = await jobSchema.findById(job._id);
        if (!jobFind.status) {
          reject({ message: "this job was deleted. Can't update." })
        } else {
          jobSchema.findByIdAndUpdate(job._id, job)
            .then(rel => resolve(job))
            .catch(err => reject(err))
        }
      } catch (error) {
        reject("exception when update company: " + error.message)
      }
    })
  }
  getSortByDate = () => {
    return new Promise((resolve, reject) => {
      jobSchema.find({ deadline: { $gte: new Date() }, status: true }).sort({ postingDate: -1 })
        .populate('idOccupation')
        .populate('idCompany')
        .then(rel => resolve(rel))
        .catch(err => reject(err))
    })
  }
  //lọc job theo các tiêu chí sắp xếp mới nhất, tìm theo locationWorking, idCompany, idOccupation
  searchByKey = (key) => {
    return new Promise((resolve, reject) => {
      jobSchema.find({ status: true, deadline: { $gt: new Date() } }).sort({ postingDate: -1 })
        .populate('idOccupation')
        .populate('idCompany')
        .then(
          rel => {
            rel = rel.filter(item =>
            (
              (
                item.idCompany != null && item.idOccupation != null
              ) &&
              (chuanhoadaucau(item.name).toLowerCase().includes(chuanhoadaucau(key).toLowerCase()) ||
                chuanhoadaucau(item.requirement).toLowerCase().includes(chuanhoadaucau(key).toLowerCase() ||
                  chuanhoadaucau(item.idCompany.name).toLowerCase().includes(chuanhoadaucau(key).toLowerCase()) ||
                  chuanhoadaucau(item.idOccupation.name).toLowerCase().includes(chuanhoadaucau(key).toLowerCase()))
              )
            )
            )
            rel = rel.map(function (item) {
              return item.name
            })
            rel = Array.from(new Set(rel));
            return resolve(rel)
          }
        )
        .catch(err => reject({ message: err }))
    })
  }
  //xem tất cả job đã đăng(dành cho ng tuyển dụng)
  getAllJobModerator = (userId) => {
    console.log(userId)
    return new Promise(async (resolve, reject) => {
      var company = await companySchema.findOne({ idUser: userId }).exec()
      //console.log(company._id.toString())
      jobSchema.find({ idCompany: company._id.toString() })
        .then((rel) => {
          //console.log(rel)
          return resolve(rel)
        })
        .catch((err) => reject(err))
    })
  }
  // vua tim kiem vua nhan theo id
  findJob = (condition) => {
    return new Promise(async (resolve, reject) => {
      jobSchema.find({ deadline: { $gt: new Date() }, status: true })
        .populate('idOccupation')
        .populate('idCompany')
        .then((rel) => {
          rel = rel.filter(i =>
            (
              i.idCompany != null && i.idOccupation != null
            )
            &&
            (
              chuanhoadaucau(i.name.toLowerCase()).includes(chuanhoadaucau(condition.key.toString().toLowerCase())) ||
              chuanhoadaucau(i.idCompany.name.toLowerCase()).includes(chuanhoadaucau(condition.key.toString().toLowerCase())) ||
              chuanhoadaucau(i.idOccupation.name.toLowerCase()).includes(chuanhoadaucau(condition.key.toString().toLowerCase())) ||
              chuanhoadaucau(i.locationWorking.toLowerCase()).includes(chuanhoadaucau(condition.key.toString().toLowerCase())) ||
              chuanhoadaucau(i.requirement.toLowerCase()).includes(chuanhoadaucau(condition.key.toString().toLowerCase()))
            )
          );
          for (let i in condition) {
            switch (i) {
              case 'locationWorking':
                if (condition[i].length > 0) {
                  var tmpArray = [];
                  for (let tmp = 0; tmp < condition[i].length; tmp++) {
                    condition[i][tmp] = chuanhoadaucau(condition[i][tmp]).toLowerCase();
                    for (let relTmp of rel) {
                      if (chuanhoadaucau(relTmp.locationWorking).toLowerCase().includes(condition[i][tmp])) {
                        tmpArray.push(relTmp);
                      }
                    }
                  }
                  rel = tmpArray;
                  //rel = rel.filter(item => condition[i].includes(chuanhoadaucau(item.locationWorking).toLowerCase()))
                }
                break;
              case 'idCompany':
                if (condition[i].length > 0) {
                  rel = rel.filter(item => condition[i].includes(item.idCompany._id.toString()))
                }
                break;
              case 'idOccupation':
                if (condition[i].length > 0) {
                  rel = rel.filter(item => condition[i].includes(item.idOccupation._id.toString()))
                }
                break;
              default:
                break;
            }
          }
          resolve(rel);
        })
        .catch((err) => reject(err))
    })
  }

  listJobByCompany(companyId, companyName) {
    if (companyName == undefined) {
      return new Promise((resolve, reject) => {
        jobSchema.find({ status: true, deadline: { $gte: new Date }, idCompany: companyId })
          .populate('idCompany')
          .populate('idOccupation')
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      });
    }
    return new Promise(async (resolve, reject) => {
      try {
        var listJob = await jobSchema.find({ status: true, deadline: { $gte: new Date }, idCompany: companyId })
          .populate('idCompany')
          .populate('idOccupation');
        listJob = listJob.filter(job => chuanhoadaucau(job.name).toLowerCase().includes(chuanhoadaucau(companyName).toLowerCase()))
        resolve(listJob)
      } catch (error) {
        reject({ message: error })
      }
    });
  }
  listJobByCompanyAdmin(companyId, companyName) {
    if (companyName == undefined) {
      return new Promise((resolve, reject) => {
        jobSchema.find({ idCompany: companyId })
          .populate('idCompany')
          .populate('idOccupation')
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      });
    }
    return new Promise(async (resolve, reject) => {
      try {
        var listJob = await jobSchema.find({ idCompany: companyId })
          .populate('idCompany')
          .populate('idOccupation');
        listJob = listJob.filter(job => chuanhoadaucau(job.name).toLowerCase().includes(chuanhoadaucau(companyName).toLowerCase()))
        resolve(listJob)
      } catch (error) {
        reject({ message: error })
      }
    });
  }
  //thông tin thống kê, biểu đồ
  statisticalJobByOccupation = (top) => {
    return new Promise(async (resolve, reject) => {
      try {
        await occupationSchema.updateMany({ isDelete: false })
        var availableCompanies = await companySchema.find({ isDelete: false })
        availableCompanies = availableCompanies.map(i => i._id.toString())
        var availableOccupation = await occupationSchema.find({ isDelete: false })
        var availableOccupationId = availableOccupation.map(i => i._id.toString())
        var sumJob = await jobSchema.find({ status: true, deadline: { $gt: new Date() }, idCompany: { $in: availableCompanies }, idOccupation: { $in: availableOccupationId } })
        var result = {}
        availableOccupation.forEach(item => {
          result[`${item.name}`] = sumJob.filter(i => i.idOccupation == item._id.toString()).length;
        })
        resolve(result);
      } catch (error) {
        reject(error)
      }
    })
    //count so luong cv moi nganh
    // group by
  }
  // thong ke ung tuyen theo nganh
  statisticalApplicationByOccupation = (top) => {
    return new Promise(async (resolve, reject) => {
      try {
        var applies = await applicationSchema.find({})
          .populate('idJob')
        applies = applies.filter(i => i.idJob != null)
        //console.log(applies)
        var availableCompanies = await companySchema.find({ isDelete: false })
        availableCompanies = availableCompanies.map(i => i._id.toString())
        var availableOccupation = await occupationSchema.find({ isDelete: false })
        var availableOccupationId = availableOccupation.map(i => i._id.toString())
        var result = []
        for (let i of availableOccupation) {
          result.push({
            name: i.name,
            count: applies.filter(item => item.idJob.idOccupation.toString() == i._id.toString()).length
          })
        }
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
  statisticalNewCreateJob = (type) => {
    return new Promise(async (resolve, reject) => {
      try {
        await companySchema.updateMany({ createDate: new Date })
        var result = [];
        var delCom = await companySchema.find({ isDelete: false })
        delCom = delCom.map(i => i._id)
        var delOcc = await occupationSchema.find({ isDelete: false })
        delOcc = delOcc.map(i => i._id)
        var totalJob = await jobSchema.find({ status: true, deadline: { $gt: new Date() }, idCompany: { $in: delCom }, idOccupation: { $in: delOcc } })
        console.log(totalJob)
        switch (type) {
          case 'month':
            for (let i = 0; i < 12; i++) {
              var tmp = totalJob.filter(item => new Date(item.postingDate).getMonth() == i).length
              result[i] = tmp
            }
            break;
          default:
            break;
        }
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  dailyStatiistical = (type) => {
    return new Promise(async (resolve, reject) => {
      var crtDay = new Date().getDate();
      var crtDate = new Date().getDate();
      var crtMonth = new Date().getMonth() + 1;
      var crtYear = new Date().getFullYear();
      var dueDate = new Date().toISOString();
      var fromDate = new Date(new Date() - 86400000)
      switch (type) {
        //day
        case 0:
          var dueDate = new Date().toISOString();
          var fromDate = new Date(new Date() - 86400000)
          break;
        //week
        case 1:
          var dueDate = new Date().toISOString();
          var fromDate = new Date(new Date() - 86400000 * (crtDay + 1))
          break;
        //month
        case 2:
          var dueDate = new Date().toISOString();
          var fromDate = new Date(`${crtYear}-${crtMonth}-1 00:00:00`)
          break;
        default:
          break;
      }
      try {
        var newApplies = await applicationSchema.find({ submitDate: { $lte: dueDate, $gte: fromDate } }).countDocuments();
        var newJobs = await jobSchema.find({ postingDate: { $lte: dueDate, $gte: fromDate } }).countDocuments()
        var newCompanies = await companySchema.find({ createDate: { $lte: dueDate, $gte: fromDate } }).countDocuments()
        var totalJob = await jobSchema.find({ status: true }).countDocuments()
        var result = {
          newApplies: newApplies,
          newJobs: newJobs,
          newCompanies: newCompanies,
          totalJob: totalJob
        }
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
  mostApplicationJob = (type) => {
    return new Promise(async (resolve, reject) => {
      try {
        await companySchema.updateMany({ createDate: new Date })
        var result = [];
        var delCom = await companySchema.find({ isDelete: false })
        delCom = delCom.map(i => i._id)
        var delOcc = await occupationSchema.find({ isDelete: false })
        delOcc = delOcc.map(i => i._id)
        var totalJob = await jobSchema.find({ status: true, idCompany: { $in: delCom }, idOccupation: { $in: delOcc } })
        var applies = await applicationSchema.find({}).populate('idJob')
        applies = applies.filter(i => i.idJob != null)
        for (let j of totalJob) {
          result.push({
            name: j.name,
            count: applies.filter(a => a.idJob._id.toString() == j._id.toString()).length
          })
        }
        result = result.sort((a, b) => b.count - a.count)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
}