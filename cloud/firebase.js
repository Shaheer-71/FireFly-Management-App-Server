const admin = require('firebase-admin')
const serviceAccount = require('../../FYP_PK.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
