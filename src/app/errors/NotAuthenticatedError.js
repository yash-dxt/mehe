module.exports = class NotAuthenticatedError extends Error {
    statusCode;
    route;
    constructor(message, route) {
        super(message);
        this.statusCode = 401;
        this.route = route;
        this.error = 'Could Not Authenticate';
        this.name = 'NotAuthenticatedError'
    }
}