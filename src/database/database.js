const mongoose = require('mongoose');
const uri = process.env.DATABASE_URL;

mongoose.connect(uri, {

})
    .then(db => console.log('DB is connected'))
    .catch(err => console.error('Error: ', err))
