var config = require('../../../config');
const MongoClient = require('mongodb').MongoClient;
const mongodbUri = config.mongo.uri;

/**
 * A singleton class which is using the uri of mongodb 
 * and then caches it and returns the client
 * instead of connecting it repeatedly. 
 */


class MDB {

    static async getClient() {
        if (this.client) {
            return this.client
        }

        console.log("Cache miss - Connecting to MongoDB client now.")

        let startTime = Date.now();

        this.client = await MongoClient.connect(this.url);

        console.log("Mongo Client time taken: " + (Date.now() - startTime).toString() + "ms");

        return this.client
    }

}

MDB.url = mongodbUri;

module.exports = {
    MDB
}