require('dotenv').config();

module.exports = {
    environment: process.env.ENVIRONMENT,
    hosting: {
        port: process.env.PORT
    },
    mongo: {
        uri: process.env.MONGODB_URI,
        db: process.env.MONGO_DB_NAME
    },
    jwt: {
        tokenSecret: process.env.JWT_TOKEN_SECRET
    }
}