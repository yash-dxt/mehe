module.exports = class ServiceError extends Error {
    statusCode;
    route;
    error;
    constructor(serviceName, route, error) {
        super(`Service error - name: ${serviceName} - route: ${route} - error: ${error}`);
        this.statusCode = 500;
        this.route = route;
        this.error = error;
        this.name = 'ServiceError'
    }
}