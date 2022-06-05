var config = require('../../../../config');
const {
    MDB_COLLECTION_USERS
} = require('../../../../constants');
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_USERS;


/***
 * This function does the following: 
 * Creates unique index on username & email fields. 
 */

const createUniquenessIndex = async () => {

    try {

        const client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        await db.createIndexes([{
            'username': 1
        }, {
            'email': 1
        }], {
            unique: true
        });

    } catch (e) {
        throw e;
    }
}

/**
 * It creates a new user in the database.
 * @param username - string
 * @param hashedPassword - the password that has been hashed
 * @param email - email
 * @param accessToken - a random string
 * @param [ban=false] - boolean
 * @param [verified=false] - boolean
 */

const createNewUser = async (username, hashedPassword, email, accessToken, ban = false, verified = false) => {

    try {

        const client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        const res = await db.insertOne({
            username,
            password: hashedPassword,
            email,
            accessToken,
            ban,
            verified
        })


        return res.insertedId;

    } catch (e) {
        throw e;
    }

}


/**
 * This function will return a user object from the database if the username exists, otherwise it will
 * return null.
 * @param username - the username of the user you want to get
 * @returns The user object.
 */

const getUserByUsername = async (username) => {

    try {

        const client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        const res = await db.findOne({
            username
        })
        return res;

    } catch (e) {
        throw e;
    }

}

/**
 * This function takes a username and a new access token and updates the access token in the database
 * for the user with the given username.
 * @param username - the username of the user
 * @param newAccessToken - the new access token that you want to set
 * @returns The result of the updateOne() method.
 */
const setNewAccessToken = async (username, newAccessToken) => {

    try {

        const client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        const res = await db.updateOne({
            username
        }, {
            $set: {
                accessToken: newAccessToken
            }
        })
        return res;

    } catch (e) {
        throw e;
    }

}


module.exports = {
    createUniquenessIndex,
    createNewUser,
    getUserByUsername,
    setNewAccessToken
}