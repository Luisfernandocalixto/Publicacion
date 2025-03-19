const mongoose = require('mongoose');
const { DATABASE_URL } = require('../config/config');
const uri = DATABASE_URL;

mongoose.connect(uri, {

})
    .then(db => console.log('DB is connected'))
    .catch(err => console.error('Error: ', err))
