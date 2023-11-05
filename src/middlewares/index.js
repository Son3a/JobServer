const jwt = require("jsonwebtoken")

module.exports = {
  verifyToken: async (req, res, next) => {
    const token = req.header('Authorization')
    if (token) {
      const accessToken = token.split(" ")[1]
      try {
        jwt.verify(accessToken, process.env.SECRET_TOKEN_KEY, (err, data) => {
          if (err) {
            //(err)
            req.data = data
            res.status(401).json({ message: "Not authozation", isSuccess: false })
          }
          else {
            req.data = data
            next()
          }
        })
      } catch (error) {
        //(error)
        return res.status(500).json({ message: "Server is error", isSuccess: false })
      }
    } else {
      return res.status(400).json({ message: "No token", isSuccess: false })
    }
  },
  verifyTokenIsAdmin: async (req, res, next) => {
    const token = req.header('Authorization')
    //(token)
    if (token) {
      const accessToken = token.split(" ")[1]
      try {
        jwt.verify(accessToken, process.env.SECRET_TOKEN_KEY, (err, data) => {
          //(data)
          if (err) {
            //(err)
            return res.status(401).json({ message: "Not authozation", isSuccess: false })
          }
          if (data.role === 'admin') {
            req.data = data
            next()
          } else {
            return res.status(403).json({ message: "You are not admin", isSuccess: false })
          }
        })
      } catch (error) {
        //(error)
        return res.status(500).json({ message: "Server is error", isSuccess: false })
      }
    } else {
      return res.status(400).json({ message: "No token", isSuccess: false })
    }
  },
  getUserIdFromJWTToken: (token) => {
    if (token) {
      const accessToken = token.split(" ")[1]
      try {
        const decode = jwt.verify(accessToken, process.env.SECRET_TOKEN_KEY)
        return { success: true, message: decode._id }
      } catch (error) {
        return { success: false, message: error }
      }
    }
  },
  verifyTokenRefresh: async (req, res, next) => {
    const token = req.header('Authorization')
    if (token) {
      const refreshToken = token.split(" ")[1]
      //(refreshToken)
      try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, data) => {
          if (err) {
            //(err)
            return res.status(401).json({ message: "Not authozation", isSuccess: false })
          }
          //("data : " + data)
          req.data = data
        })
        next()
      } catch (error) {
        //(error)
        return res.status(500).json({ message: "Server is error", isSuccess: false })
      }
    } else {
      return res.status(400).json({ message: "No token", isSuccess: false })
    }
  },
}
