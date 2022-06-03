const config = require('../../../config');
const secret = config.jwt.tokenSecret;

const jwt = require('jsonwebtoken');


const signAccessToken = (username) => {
    const accessToken = jwt.sign({
        username
    }, secret);
    return accessToken;
}



const verifyAccessToken = (token) => {
    const res = jwt.verify(token, secret)
    return res.username;
}

module.exports = {
    signAccessToken,
    verifyAccessToken
}