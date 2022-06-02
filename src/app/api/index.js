const config = require('../../config');
const app = require('./app');


/**
 * Checking the environment & setting the host & port. 
 * If port is null - it is set at 3000.  
 */

const env = config.environment;
const port = config.hosting.port || 3000;


app.listen(port, () => {
    console.log(`App is running on port ${port} and environment: ${env}`);
})