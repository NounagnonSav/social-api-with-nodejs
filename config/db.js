const mongoose = require('mongoose');

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER_PASS}@cluster0.srkfw.mongodb.net/social-project`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => console.log('conneted to database'))
    .catch((err) => console.log('Failed to conneted to database : ', err));