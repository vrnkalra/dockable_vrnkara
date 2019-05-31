const mongoose = require('mongoose')

mongoose.connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}, function (err) {
    if (err) {
        console.log("failed to connect to mongo because", err);
        process.exit(1);
    } else {
        console.log("connected to mongo")
    }
})