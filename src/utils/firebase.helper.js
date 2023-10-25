
var admin = require('firebase-admin');

var serviceAccount = require('./jobseeker-76157-firebase-adminsdk-g6j9v-95ff3aab02.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;