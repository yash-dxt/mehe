module.exports = class BadRequestError extends Error {
    statusCode;
    route;
    constructor(message, route) {
        super(message);
        this.statusCode = 400;
        this.route = route;
        this.error = 'Bad Request';
        this.name = 'BadRequestError'
    }
}