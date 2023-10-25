var jwt = require('jsonwebtoken');
var admin = require('./firebase.helper');

module.exports = {
  genaralAccessToken : (_id, role) => {
    return jwt.sign({ _id, role }, process.env.SECRET_TOKEN_KEY, {
      expiresIn: process.env.ACCESS_EXPIRESIN
    }, function (err, token) {
      if (err) {
        console.log(err)
      } else {
        console.log('token '+ token)
      }
    })
  },
 genaralRefreshToken : (_id, role, accessToken) => {
    return jwt.sign({ _id, role }, accessToken, {
      expiresIn: process.env.REFRESH_EXPIRESIN
    }, function (err, token) {
      if (err) {
        console.log(err)
      } else {
        console.log('token '+ token)
      }
    })
  },
  pushNotification : async (tokenDevice, body) => {
    try {
      const result = await admin.messaging().send({
        notification : {
          'title' : 'JobSeeker có thông báo',
          'body' : body
        },
        android : {
          'notification' : {
            'sound' : 'default' 
          }
        },
        data : {
          idAsset : 'dadasafsfdfdsfd31233',
          idSender : 'edad23dwdwer23423r2'
        },
        token : tokenDevice
      });
      console.log('result : ' + JSON.stringify(result));
    } catch (error) {
      console.log(error);
    }
  }
}