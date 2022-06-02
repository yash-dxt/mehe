module.exports = class DatabaseError extends Error {
    statusCode;
    route;
    error;
    constructor(route, error) {
        super(`Something went wrong with db: ${route} error: ${error}`);
        this.statusCode = 500;
        this.route = route;
        this.error = error;
        this.name = 'Database Error';
    }
}