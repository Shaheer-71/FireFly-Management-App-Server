const mongoose = require('mongoose');

const uri = 'mongodb+srv://Shaheer:Shaheer%40Islamabad@cluster0.digsrya.mongodb.net/FYP';

module.exports = MongoConnection = () => {
    mongoose.connect(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        connectTimeoutMS: 10000 
    })
    .then(() => {
        console.log('Connected to MongoDB');
        mongoose.connection.db.listCollections().toArray((err, collections) => {
            if (err) console.error(err);
            console.log("Collections:", collections.map(col => col.name));
        });
    })
    .catch(error => console.error('Error connecting to MongoDB:', error.message));
}
