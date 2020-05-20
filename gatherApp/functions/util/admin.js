const admin = require('firebase-admin');

//~~~~~~~~~~ DO NOT PUBLISH admin.json in public repository ~~~~~~~~~~
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// a concise way to store Firestore and Firebase admin
const db = admin.firestore();

module.exports = { admin, db };
