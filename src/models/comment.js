const { Schema, model, default: mongoose } = require('mongoose');

const CommentSchema = new Schema({
    publication_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Publication' },
    email: { type: String },
    name: { type: String },
    gravatar: { type: String },
    comment: { type: String },
    timestamp: { type: Date, default: Date.now() }

}
);

module.exports = model('Comment', CommentSchema);


