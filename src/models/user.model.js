const UserSchema = require('../schemas/user.schema')
var jwt = require('jsonwebtoken');
const { genaralAccessToken, genaralRefreshToken } = require('../utils');
const { SendMailText } = require('../services/sendmail.service');
const companySchema = require('../schemas/company.schema');
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const saltRounds = 10;
module.exports = class User {
  #id
  #avatar
  #name
  #email
  #phone
  #username
  #password
  #role
  #refreshToken
  #confirmPasswordCode
  #jobFavourite
  #tokenDevice
  constructor(id, avatar, name, email, phone, username, password, role = "staff", refreshToken = null, confirmPasswordCode=null, jobFavourite=[], tokenDevice='') {
    this.#id = id
    this.#avatar = avatar
    this.#name = name
    this.#email = email
    this.#phone = phone
    this.#username = username
    this.#password = password
    this.#role = role
    this.#refreshToken = refreshToken
    this.#confirmPasswordCode = confirmPasswordCode
    this.#jobFavourite = jobFavourite
    this.#tokenDevice = tokenDevice
  }

  create = () => new Promise(async (resolve, reject) => {
    // check phone trung
    const phoneExist = await UserSchema.findOne({ phone: this.#phone })
    const emailExist = await UserSchema.findOne({ email: this.#email })
    const usernameExist = await UserSchema.findOne({username : this.#username})

    if (!this.#email || !this.#phone || !this.#password || !this.#username || !this.#name) {
      return reject({ message: "Không được để sót bất kỳ ô nào !", isSuccess: false })
    }
    if (phoneExist) {
      return reject({ message: "Số điện thoại này đã đăng ký trước đó, vui lòng đổi lại !", isSuccess: false })
    }
    // check trung email
    if (emailExist) {
      return reject({ message: "Email này đã đăng ký trước đó, vui lòng đổi lại !", isSuccess: false })
    }

    if (usernameExist) {
      return reject({ message: "Username này đã đăng ký trước đó, vui lòng đổi lại !", isSuccess: false })
    }

    // thoa man het thi them vo
    const user = new UserSchema()
    user.name = this.#name
    user.avatar = this.#avatar
    user.phone = this.#phone
    user.email = this.#email
    user.username = this.#username
    
    user.role = this.#role
    user.refreshToken = this.#refreshToken
    user.confirmPasswordCode = this.#confirmPasswordCode

    const hash = bcrypt.hashSync(this.#password, saltRounds);
    user.password = hash;

    user.save()
      .then(user => resolve(user))
      .catch(err => reject(err))
  })

  login = () => new Promise(async (resolve, reject) => {
    new Promise((resolve, reject) => {
      if (this.#username === '' || this.#password === '') {
        return reject({message : 'not empty username or password'})
      }
      UserSchema
        .findOne({ $or : [{username: this.#username}, {email : this.#email}] })
        .then(user => resolve(user))
        .catch(err => reject(err))
    }).then(async user => {
      if (user) {
        const isMatch = bcrypt.compareSync(this.#password, user.password);
        if (isMatch) {
          const newRefreshToken = jwt.sign({ _id : user._id, role : user.role }, process.env.REFRESH_TOKEN_KEY, {
            expiresIn: process.env.REFRESH_EXPIRESIN
          })

          let newAccessToken = jwt.sign({_id : user._id, role : user.role}, process.env.SECRET_TOKEN_KEY, {
            expiresIn : process.env.ACCESS_EXPIRESIN
          })
          
          resolve({accessToken : newAccessToken, refreshToken : newRefreshToken})
          await UserSchema.updateOne({_id : user._id}, {refreshToken : newAccessToken, tokenDevice : this.#tokenDevice})
        } else {
          reject({ message: "Tài khoản hoặc mật khẩu không chính xác", isSuccess: false })
        }
      } else {
        reject({ message: "Tài khoản không tồn tại", isSuccess: false })
      }
    })
      .catch(err => reject(err))
  })

  createRefreshToken = () => new Promise(async (resolve, reject) => {
    try {
      const user = await UserSchema.findById({_id : this.#id})
      console.log(user)

      let newRefreshToken, newAccessToken       
      const {_id, role} = user

      newRefreshToken = jwt.sign({_id, role}, process.env.REFRESH_TOKEN_KEY, {
        expiresIn : process.env.REFRESH_EXPIRESIN
      })

      newAccessToken = jwt.sign({_id, role}, process.env.SECRET_TOKEN_KEY, {
        expiresIn : process.env.ACCESS_EXPIRESIN
      })

      await UserSchema.updateOne({_id}, {refreshToken : newRefreshToken})
      resolve({accessToken : newAccessToken, refreshToken : newRefreshToken, isSuccess : true})
    } catch (error) {
      console.log(error)
      return reject({message : "Error in server !", isSuccess : false})
    }
  })

  getAll = () => {
    return new Promise(async (resolve, reject) => {
      UserSchema.find({})
        .then((user) => resolve(user))
        .catch((err) => { reject(err) })
    })
  }
  
  update = (user) => {
    return new Promise((resolve, reject) => {
      UserSchema.findByIdAndUpdate(user._id, user)
        .then(rel => resolve(user))
        .catch(err => reject(err))
    })
  }
  updatePassword = (user) => {
    return new Promise((resolve, reject) => {
      UserSchema.findByIdAndUpdate(user._id, { password: user.password })
        .then(rel => resolve(user))
        .catch(err => reject(err))
    })
  }
  delete = (id) => {
    return new Promise((resolve, reject) => {

    })
  }


  changePassword = (newPassword) => new Promise(async (resolve, reject) => {
    try {
      const user = await UserSchema.findOne({_id : this.#id})
      if (user) { 
        const isMatch = bcrypt.compareSync(this.#password, user.password);
        const hashPassword = bcrypt.hashSync(newPassword, saltRounds);

        !isMatch ? reject({message : "Mật khẩu không đúng !", isSuccess: false})
        : UserSchema.updateOne({_id : this.#id}, {
          password : hashPassword
        }).then(res => resolve({message : "Đổi mật khẩu thành công !", isSuccess : true, res}))
          .catch(err => {
            return reject({message : "Lỗi server", err : err})
          })
      } else {
        reject({message : "Không có người này, token bị sai !", isSuccess: false})
      }
    } catch (error) {
      console.log(error)
      return reject({message : "Lỗi server", err : err})
    }
  })

  forgotPassword = () => new Promise(async (resolve, reject) => {
    try {
      const user = await UserSchema.findOne(
        {email : this.#email}
      )
      
      if (user) {
        const confirmPasswordCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000; 
      
        await UserSchema.updateOne({email : this.#email}, {confirmPasswordCode : confirmPasswordCode})
        .then( async () => {
          await SendMailText(this.#email, "Mã xác nhận gmail", `Mã xác nhận là : ${confirmPasswordCode}`)
          .then(() => {
              return resolve({message : "Chúng tôi đã gửi mã về cho bạn, vui lòng kiểm tra !", isSuccess : true})
          })
        })
        .catch(err => reject({message : "Có lỗi từ server !", isSuccess : false, err : err}))
      } else {
        return reject({message : "Không tìm thấy tài khoản này, vui lòng thử lại !", isSuccess : false})
      }
    } catch (error) {
      return reject({error : error, message : "Có lỗi từ server", isSuccess : false})
    }
  })

  confirmPassword = (newPassword) => new Promise(async (resolve, reject) => {
    console.log(this.#email, newPassword, this.#confirmPasswordCode)

    try {
      const user = await UserSchema.findOne({confirmPasswordCode : this.#confirmPasswordCode, email : this.#email})
      if (user) {
        const passwordHash = bcrypt.hashSync(newPassword, saltRounds);
        const userUpdate = await UserSchema.updateOne({email : this.#email}, {password : passwordHash})
        if (userUpdate) {
          return resolve({message : "Đặt lại mật khẩu thành công !", isSuccess : true})
        }
      }  else {
        return reject({message : "Mã xác nhận không đúng, thử lại !", isSuccess : false})
      }    
    } catch (error) {
      console.log(error)
      return reject({message : "Lỗi từ server ! vui lòng thử lại !", error : error, isSuccess : false})
    }
  })

  logOut = () => new Promise(async (resolve, reject) => {
    try {
      console.log(this.#id);
      const data = await UserSchema.updateOne({_id : this.#id},{refreshToken : null, confirmPasswordCode : null})
      resolve({data, message : "Logout success", isSuccess : true})
    } catch (error) {
      console.log(error)
      reject({error, message : "Error", isSuccess : false})
    }
  })

  getUser = () => new Promise(async(resolve, reject) => {
    try {
      const res = await UserSchema.findOne({_id : this.#id}).populate({
        path: 'jobFavourite',
        populate: { path: 'jobId', populate : {
          path : 'idCompany'
        }}
      })
      let company = []
      if (res) {
        company = await companySchema.find({idUser : this.#id}).populate({
          path : 'idUser',
        })
      }
      let result = {...res._doc, company : company ? company[0] : {}}
      console.log(result)
      resolve(result)
    } catch (error) {
      console.log(err)
      reject(err)
    }
  })

  putUser = () => new Promise(async(resolve, reject) => {
    try {
      if (this.#email) {
        const checkEmail = await UserSchema.findOne({$and : [{email : this.#email}, {_id : {$ne : this.#id}}]})
        
        if (checkEmail) {
          return reject({message : "Cập nhật thất bại, email này đã tồn tại trong hệ thống !", isSuccess : false})
        }
      }

      console.log(this);
      if (this.#phone) {
        const checkPhone = await UserSchema.findOne({$and : [{phone : this.#phone}, {_id : {$ne : this.#id}}]})
      
        if (checkPhone) {
          return reject({message : "Cập nhật thất bại, số điện thoại này đã tồn tại trong hệ thống !", isSuccess : false})
        }
      }
      // check email vs phone is exist
      const newUser = {
        phone : this.#phone,
        email : this.#email,
        name : this.#name,
        avatar : this.#avatar
      }
      
      await UserSchema.updateOne({_id : this.#id}, {...newUser})
      resolve({message : "Cập nhật thông tin thành công !", isSuccess : true})
    } catch (error) {
      console.log(error)
      reject({message : "Lỗi từ server", isSuccess : false})
    }
  })

  patchAvatarUser = () => new Promise(async (resolve, reject) => {
    try {
      await UserSchema.updateOne({_id : this.#id}, {avatar : this.#avatar})
      resolve({message : "Cập nhật avatar thành công !", isSuccess : true})
    } catch (error) {
      console.log(error);
      reject({message : "Lỗi từ server", isSuccess : false})
    }
  })

  // add list job favourite
  patchAddJobFavourite = (jobId) => new Promise(async(resolve, reject) => {
    try {
      const user = await UserSchema.findOne({_id : this.#id})
      const isExistInListFavourite = user.jobFavourite.filter(item => {
        console.log("item jobs " +item);
        console.log(item.jobId , mongoose.Types.ObjectId(jobId))
        return JSON.stringify(item.jobId) === JSON.stringify(mongoose.Types.ObjectId(jobId))
      })
      if (isExistInListFavourite.length === 0) {
        // chua luu job nay vao list yeu thich -> them vao list
        await user.addJobFavourite(jobId);
        return resolve({message : "Đã thêm công việc này vào danh sách yêu thích", isSuccess : true})
      } else {
        // da luu roi -> loai bo ra khoi list
        await user.removeJobFavourite(jobId);
        return resolve({message : "Đã bỏ công việc này ra khỏi danh sách yêu thích", isSuccess : true})
      }
    } catch (error) {
      console.log(error)
      reject({message : "Lỗi từ server", isSuccess : false})
    }
  })
}