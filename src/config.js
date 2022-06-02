require('dotenv').config();

module.exports = {
    environment: process.env.ENVIRONMENT,
    hosting: {
        port: process.env.PORT
    }
}