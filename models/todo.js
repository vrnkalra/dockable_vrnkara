const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    channelId: {
        type: Schema.ObjectId,
        ref: 'Channel',
        required: true
    },
    teamId: {
        type: Schema.ObjectId,
        ref: 'Team',
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    // userId: {
    //     type: String,
    //     required: true,
    //     trim: true
    // }
}, {
    timestamps: true
})

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;