const {
    AUTH_MIDDLEWARE_NAMING
} = require("../../constants");
const NotAuthenticatedError = require("../errors/NotAuthenticatedError");
const {
    verifyAccessToken
} = require("../utils/tokens/jwt");


module.exports = () => {
    return async (req, res, next) => {

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

        req.username = username;

        next();

    }

}