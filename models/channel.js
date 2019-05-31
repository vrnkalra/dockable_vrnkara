const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelSchema = new Schema({
    channelID: {
        type: String,
        required: true,
        trim: true
    },
    channelName: {
        type: String,
        required: true,
        trim: true
    },
    teamId: {
        type: Schema.ObjectId,
        ref: 'Team',
        required: true
    }
}, {
    timestamps: true
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;