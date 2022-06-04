var config = require('../../../../config');
const {
    MDB_COLLECTION_REPLIES
} = require('../../../../constants');
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_REPLIES;

const addReply = async (thoughtId, reply, userId, anonymous = false, username) => {
    const objToBeInserted = {
        thoughtId,
        reply,
        userId,
        anonymous,
        status: "PUBLISHED"
    }

    if (username) objToBeInserted.username = username;

    try {

        const client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        const res = await db.insertOne(objToBeInserted)

        return res.insertedId;

    } catch (e) {
        throw e;
    }

}

module.exports = {
    addReply
}