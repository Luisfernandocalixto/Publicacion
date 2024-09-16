const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publicationSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    date: { type: Date, default: Date.now() },
    user: { type: String },
});

module.exports = mongoose.model('Publication', publicationSchema);