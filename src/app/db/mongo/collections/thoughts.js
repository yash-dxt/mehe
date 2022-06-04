const {
    ObjectID
} = require('bson');
const {
    ObjectId
} = require('mongodb');
var config = require('../../../../config');
const {
    MDB_COLLECTION_THOUGHTS,
    MDB_COLLECTION_REPLIES
} = require('../../../../constants');
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_THOUGHTS;
const repliesCollection = MDB_COLLECTION_REPLIES


const transactionOptions = {
    readPreference: 'primary',
    readConcern: {
        level: 'local'
    },
    writeConcern: {
        w: 'majority'
    }
}

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

const getAllThoughts = async (limit, skip) => {
    try {

        const client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        const thoughts = [];

        await db.find({}, {
            limit: limit,
            skip: skip
        }).forEach((thought) => {
            thoughts.push(thought)
        });

        return thoughts;


    } catch (e) {
        throw e;
    }
}

const getThoughtByIdAlongWithReplies = async (thoughtId) => {
    try {

        const client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);


        const thoughts = [];
        await db.aggregate([{
                $match: {
                    _id: ObjectId(thoughtId)
                }
            },
            {
                $lookup: {
                    from: repliesCollection,
                    localField: '_id',
                    foreignField: 'thoughtId',
                    as: 'replies'
                }
            }
        ]).forEach((thought) => {
            thoughts.push(thought);
        })

        return thoughts[0];

    } catch (e) {
        throw e;
    }
}

const deleteThought = async (thoughtId, userId) => {

    try {

        client = await MDB.getClient();

        const thoughtsCollection = client.db(dbName).collection(collection);
        const repliesCollection = client.db(dbName).collection(MDB_COLLECTION_REPLIES);

        const session = client.startSession();

        var res = await session.withTransaction(async () => {

            try {

                var deleteThoughtResponse = await thoughtsCollection.deleteOne({
                    _id: ObjectId(thoughtId),
                    userId: ObjectId(userId)
                })

            } catch (e) {
                await session.abortTransaction();
                throw e;
            }


            if (deleteThoughtResponse.deletedCount == 0) {
                await session.abortTransaction();
                throw "Transaction error";
            }

            try {
                await repliesCollection.deleteMany({
                    thoughtId: ObjectId(thoughtId)
                })
            } catch (e) {
                await session.abortTransaction();
                throw e;
            }

        }, transactionOptions);

        return res;

    } catch (e) {
        throw e;
    }
}


module.exports = {
    createThought,
    getAllSelfThoughts,
    getThoughtsForUser,
    getThoughtByThoughtId,
    getAllThoughts,
    getThoughtByIdAlongWithReplies,
    deleteThought
}