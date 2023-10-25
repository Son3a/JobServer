const { default: mongoose } = require('mongoose')
const companySchema = require('../schemas/company.schema')
const jobSchema = require('../schemas/job.schema')
const { chuanhoadaucau } = require('../services/standardVietNamWork')

module.exports = class Job {
  id
  #name
  #totalEmployee
  #type
  #about
  #phone
  #location
  #idUser
  #isDelete
  constructor(id, name, totalEmployee, type, about, phone, isDelete, location, idUser) {
    this.id = id
    this.#name = name
    this.#totalEmployee = totalEmployee
    this.#type = type
    this.#about = about
    this.#phone = phone
    this.#location = location
    this.#isDelete = isDelete
    this.#idUser = idUser
  }
  create = (idUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        const isCreate = await companySchema.findOne({ idUser: mongoose.Types.ObjectId(idUser) })
        if (isCreate !== null) return reject({ message: "User already create company before!" })
        else {
          const com = new companySchema()
          com.name = this.#name
          com.totalEmployee = this.#totalEmployee
          com.type = this.#type
          com.about = this.#about
          com.phone = this.#phone
          com.location = this.#location
          com.isDelete = this.#isDelete
          com.createDate = new Date()
          com.idUser = this.#idUser
          com.save()
            .then((rel) => resolve(rel))
            .catch((err) => reject(err))
        }
      }
      catch (e) {
        reject({ message: 'an exception occur when execute the request' })
      }
    })
  }
  delete = (id) => {
    return new Promise(async (resolve, reject) => {
      const company = await companySchema.findById(id);
      if (company == null)
        return reject({ mesasge: "company not exist" })
      if (company.isDelete) {
        reject({ message: "This company has been deleted!" })
      }
      companySchema.findByIdAndUpdate(id, { isDelete: true })
        .then(rel => resolve(rel))
        .catch(err => reject(err))
    })
  }
  readAll = (page) => {
    //need paging
    return new Promise(async (resolve, reject) => {
      const page_limit = process.env.PAGE_LIMIT
      const total_company = await companySchema.countDocuments();
      const page_total = Math.ceil(total_company / page_limit)
      if (page == undefined) {
        return companySchema.find({ isDelete: false }).limit(page_limit)
          .then(async (rel) => {
            for (let i = 0; i < rel.length; i++) {
              rel[i] = rel[i].toObject();
              var numJob = await jobSchema.find({ idCompany: mongoose.Types.ObjectId(rel[i]._id) })
              var hiringJob = await jobSchema.find({ status: true, deadline: { $gte: new Date() }, idCompany: mongoose.Types.ObjectId(rel[i]._id) })
              rel[i]['numJob'] = numJob.length
              rel[i]['hiringJob'] = hiringJob.length
            }
            resolve({ data: rel, page_total: page_total, current_page: 0, page_limit: Number.parseInt(page_limit) })
          })
          .catch((err) => { reject(err) })
      }
      page = Number.parseInt(page);
      if (page >= 0 && page <= page_total) {
        return companySchema.find({ isDelete: false })
          .skip(page * page_limit)
          .limit(page_limit)
          .then(async (rel) => {
            for (let i = 0; i < rel.length; i++) {
              rel[i] = rel[i].toObject();
              var numJob = await jobSchema.find({ idCompany: mongoose.Types.ObjectId(rel[i]._id) })
              var hiringJob = await jobSchema.find({ status: true, deadline: { $gte: new Date() }, idCompany: mongoose.Types.ObjectId(rel[i]._id) })
              rel[i]['numJob'] = numJob.length
              rel[i]['hiringJob'] = hiringJob.length
            }
            resolve({ data: rel, page_total: page_total, current_page: page, page_limit: Number.parseInt(page_limit) })
          })
          .catch((err) => { reject(err) })
      }
      else reject({ message: "can't not get list company" })
    })
  }
  getPaging = (name, page) => {
    return new Promise(async (resolve, reject) => {
      try {
        var limit = process.env.PAGE_LIMIT
        var resultTotal = await companySchema.find({ isDelete: false })
        resultTotal = resultTotal.filter(cpn => chuanhoadaucau(cpn.name).toLowerCase().includes(chuanhoadaucau(name).toLowerCase()))
        var total = resultTotal.length
        var page_total = Math.ceil(total / limit)
        if (page == undefined) {
          let results = resultTotal.slice(0, limit);
          for (let i = 0; i < results.length; i++) {
            results[i] = results[i].toObject();
            var numJob = await jobSchema.find({ idCompany: mongoose.Types.ObjectId(results[i]._id) })
            var hiringJob = await jobSchema.find({ status: true, deadline: { $gte: new Date() }, idCompany: mongoose.Types.ObjectId(results[i]._id) })
            results[i]['numJob'] = numJob.length
            results[i]['hiringJob'] = hiringJob.length
          }
          return resolve({
            data: results,
            current_page: page,
            page_limit: limit,
            page_total: page_total
          })
        }
        page = Number.parseInt(page)
        if (page >= 0 && page < page_total) {
          let results = resultTotal.slice(limit * page, limit * (page + 1));
          for (let i = 0; i < results.length; i++) {
            results[i] = results[i].toObject();
            var numJob = await jobSchema.find({ idCompany: mongoose.Types.ObjectId(results[i]._id) })
            var hiringJob = await jobSchema.find({ status: true, deadline: { $gte: new Date() }, idCompany: mongoose.Types.ObjectId(results[i]._id) })
            results[i]['numJob'] = numJob.length
            results[i]['hiringJob'] = hiringJob.length
          }
          resolve({
            data: results,
            current_page: page,
            page_limit: limit,
            page_total: page_total
          })
        }
        return reject({ message: `can't not find result` })
      }
      catch (e) {
        return reject(e)
      }
    })
  }
  readOne = (id) => {
    return new Promise((resolve, reject) => {
      return companySchema.findById(id).populate({
        path: 'idUser'
      })
        .then((rel) => {
          if (rel.isDelete) reject({ message: "this company is deleted" })
          else resolve(rel);
        })
        .catch((err) => { reject(err) })
    })
  }
  update = (company) => {
    return new Promise((resolve, reject) => {
      companySchema.findByIdAndUpdate(company._id, company)
        .then(rel => resolve(company))
        .catch(err => reject(err))
    })
  }
}