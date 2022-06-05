const DatabaseError = require('../errors/DatabaseError');
const NotAuthenticatedError = require('../errors/NotAuthenticatedError');
const NotFoundError = require('../errors/NotFoundError')
const ServiceError = require('../errors/ServiceError');
const BadRequestError = require('../errors/BadRequestError')

/**
 * Sends a uniform error response.
 * This takes in a known error and sends a response accordingly. 
 */


module.exports = () => {
    return (err, req, res, next) => {
        if (err instanceof DatabaseError || err instanceof NotAuthenticatedError || err instanceof NotFoundError || err instanceof ServiceError || err instanceof BadRequestError) {
            let route = err.route ? err.route : 'Unknown route.';
            let error = err.error ? err.error.toString() : 'No specific info related to error.';
            let statusCode = err.statusCode ? err.statusCode : 400;
            let message = err.message ? err.message : 'Some error occurred.';
            let name = err.name ? err.name : 'SomeError'

            console.log(`Some error occurred at Route: ${route} with status code: ${statusCode} - message: ${message} - More Info: ${error}`);

            return res.status(statusCode).send({
                route: route,
                message: message,
                statusCode: statusCode,
                error: error,
                type: name
            })


        } else {

            /**
             * trigger alarm here. this was an uncaught error. 
             */

            return res.status(500).send({
                message: 'Something went really wrong, please inform yashdixitsq@gmail.com',
                statusCode: 500,
                error: err,
                type: 'FATAL ERROR'
            })

        }
    }
}