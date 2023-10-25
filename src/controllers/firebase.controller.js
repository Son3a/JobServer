var admin = require('../utils/firebase.helper');

module.exports.get = async (req, res, next) => 
{
  //push notification: To do
  try {
    const result = await admin.messaging().send({
      notification : {
        'title' : 'SGOD',
        'body' : 'abcxyz !'
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
      token : 'cFoB8aQkSouNWPRAOdnZVh:APA91bE_qofqWt-jltCupYX6xF5WSK-qzH-fuO2KpC-CyxMonbQ_Recirs1cSdgpQ6lSoVJXjjdwo7aRpdPVX-BK6JPjrP1pObQsouvlPKPVpLRmU6J_LNmB-o4ck5GKMLogWyQJdhUr'
    });
    console.log('result : ' + JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }

  return res.status(200).send('This is notification !');
}