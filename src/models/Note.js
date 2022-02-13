const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let noteSchema = new Schema({
    userId: {
        type: String
    },
    content:{
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now()
    }
}, {
    collection: "notes"
});

module.exports = mongoose.model('note', noteSchema);
