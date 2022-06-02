const config = require('../../../config');
const secret = config.jwt.tokenSecret;

const jwt = require('jsonwebtoken');


const signAccessToken = (username) => {

    const accessToken = jwt.sign({
        username
    }, secret);

    return accessToken;
}

module.exports = {
    signAccessToken
}