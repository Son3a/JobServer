const authController = require('../controllers/authentication.controller')

const { SendMail, SendMailText } = require('../services/sendmail.service')

const { verifyToken, verifyTokenRefresh } = require('../middlewares')
const { upload } = require('../services/uploadImage.service')


module.exports = require('express').Router()
  .post("/login", authController.login)
  .post("/register",authController.create)
  .post("/forgot-password", authController.forgotPassword)
  .get("/all", authController.getAll)
  .get("/mail", (req, res) => {
    SendMailText("factyel.bttn@gmail.com", "test mail from job", "xin chao")
      .then((rel) => res.send(rel))
      .catch(err => res.send(err))

  })
  .get("/all", authController.getAll)
  .get('/info-user', verifyToken, authController.getUser)
  .put('/logout', verifyToken ,authController.logOut)
  .put("/change-password",verifyToken ,authController.changePasswordController)
  .put("/confirm-password", authController.confirmPassword)
  .put("/edit-profile", [verifyToken, upload.Image.single("avatar")], authController.editProfile)
  .post("/refresh-token", verifyTokenRefresh, authController.createRefreshToken)
  .patch("/logout", verifyToken, authController.logOut)
  .patch("/update-avatar",[verifyToken,upload.Image.single("avatar")],authController.updateAvatar);