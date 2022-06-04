const {
    ObjectID
} = require('bson');
const {
    ObjectId
} = require('mongodb');
var config = require('../../../../config');
const {
    MDB_COLLECTION_THOUGHTS
} = require('../../../../constants');
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_THOUGHTS;

/**
 * It takes in a thought, username, userId, and an optional anonymous flag, and returns the insertedId
 * of the thought.
 * @param thought - the thought to be inserted
 * @param username - String
 * @param userId - The userId of the user who created the thought
 * @param [anonymous=false] - boolean
 * @returns The insertedId
 */

const createThought = async (thought, username, userId, anonymous = false) => {
    const objToBeInserted = {
        thought,
        userId: ObjectID(userId),
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

const getThoughtByThoughtId = async (thoughtId) => {

    try {

        const client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        const thought = await db.findOne({
            _id: ObjectID(thoughtId)
        })

        return thought;

    } catch (e) {
        throw e;
    }

}

const getAllSelfThoughts = async (userId) => {

    try {

        const client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        const thoughts = [];

        await db.find({
            userId: ObjectId(userId)
        }).forEach((thought) => {
            thoughts.push(thought)
        });

        return thoughts;

    } catch (e) {
        throw e;
    }

}

const getThoughtsForUser = async (username) => {
    try {

        const client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        const thoughts = [];

        await db.find({
            username
        }).forEach((thought) => {
            thoughts.push(thought)
        });

        return thoughts;


    } catch (e) {
        throw e;
    }
}

module.exports = {
    createThought,
    getAllSelfThoughts,
    getThoughtsForUser,
    getThoughtByThoughtId
}