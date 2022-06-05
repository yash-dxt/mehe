const {
    ObjectId
} = require('mongodb');
var config = require('../../../../config');
const {
    MDB_COLLECTION_REPLIES
} = require('../../../../constants');
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_REPLIES;

/**
 * It takes in a thoughtId, reply, userId, anonymous, and username and inserts a new reply into the
 * database.
 * @param thoughtId - the id of the thought that the reply is being added to
 * @param reply - the reply text
 * @param userId - ObjectId(userId),
 * @param [anonymous=false] - boolean
 * @param username - String
 * @returns The insertedId
 */

const addReply = async (thoughtId, reply, userId, anonymous = false, username) => {
    const objToBeInserted = {
        thoughtId: ObjectId(thoughtId),
        reply,
        userId: ObjectId(userId),
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

/**
 * It deletes a reply to a thought from the database.
 * @param replyId - the id of the reply to be deleted
 * @param userId - ObjectId(userId)
 * @returns The number of documents deleted.
 */
const deleteReply = async (replyId, userId) => {

    try {

        const client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        const res = await db.deleteOne({
            userId: ObjectId(userId),
            _id: ObjectId(replyId)
        })

        return res.deletedCount;

    } catch (e) {
        throw e;
    }

}

module.exports = {
    addReply,
    deleteReply
}