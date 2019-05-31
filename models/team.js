const mongoose = require('mongoose');

const Team = mongoose.model('Team', {
    teamID: {
        type: String,
        required: true,
        trim: true
    },
    domain: {
        type: String,
        required: true,
        trim: true
    },

});

module.exports = Team;