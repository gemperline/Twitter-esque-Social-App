const admin = require('firebase-admin');

//~~~~~~~~~~ DO NOT PUBLISH admin.json in public repository ~~~~~~~~~~
const serviceAccount = require('../key/admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gather-app-af8a4.firebaseio.com"
  });
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// a concise way to store Firestore and Firebase admin
const db = admin.firestore();

module.exports = { admin, db };
