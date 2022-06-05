const {
    AUTH_MIDDLEWARE_NAMING
} = require("../../constants");
const mongo = require('../db/mongo/index')
const NotAuthenticatedError = require("../errors/NotAuthenticatedError");
const {
    verifyAccessToken
} = require("../utils/tokens/jwt");


module.exports = (getUser) => {
    return async (req, res, next) => {

        /**
         * Checks if token is present & valid - then extracts username from accessToken. 
         * If it isn't throws a 401. 
         */

        const token = req.headers.authorization;

        if (!token) {
            next(new NotAuthenticatedError('Token not present', AUTH_MIDDLEWARE_NAMING));
            return;
        }


        try {
            var username = verifyAccessToken(token);
        } catch (e) {
            next(new NotAuthenticatedError('Could not authenticate', AUTH_MIDDLEWARE_NAMING));
            return;
        }

        /**
         * If getUser is true - we fetch user from database. And set req.user as the user's obj. 
         * Also, if false we set req.username as the user's username.
         */
        if (getUser) {
            const user = await mongo.user.getUserByUsername(username);
            req.user = user;
        } else {
            req.username = username;
        }

        next();

    }

}