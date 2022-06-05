const config = require('../../../config');
const secret = config.jwt.tokenSecret;

const jwt = require('jsonwebtoken');


/**
 * The signAccessToken function takes a username as an argument and returns a signed access token.
 * @param username - The username of the user who is logging in.
 * @returns The accessToken is being returned.
 */
const signAccessToken = (username) => {
    const accessToken = jwt.sign({
        username
    }, secret);
    return accessToken;
}

/**
 * VerifyAccessToken takes a token and returns the username of the user who owns the token
 * @param token - The token to be verified
 * @returns The username of the user who is logged in.
 */
const verifyAccessToken = (token) => {
    const res = jwt.verify(token, secret)
    return res.username;
}

module.exports = {
    signAccessToken,
    verifyAccessToken
}