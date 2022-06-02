module.exports = class NotFoundError extends Error {
    statusCode;
    route;
    constructor(message, route) {
        super(message);
        this.statusCode = 404;
        this.route = route;
        this.error = 'Could Not Find Corresponding Entity';
        this.name = 'NotFoundError'
    }
}