const express = require('express');
const mongo = require('../../db/mongo/index');
const auth = require('../../middleware/auth')
const BadRequestError = require('../../errors/BadRequestError');
const DatabaseError = require('../../errors/DatabaseError');
const validateCreateThoughtSchema = require('../../utils/joi/createThought');

module.exports = function thoughtRouter() {

    return new express.Router()
        .post('/', auth(true), createThought);

    async function createThought(req, res) {
        const routeName = 'POST /thought/';

        /**
         * Schema validation for Create Thought API. 
         * Using a Joi Object which is present in utils. 
         */

        try {
            validateCreateThoughtSchema(req.body);
        } catch (e) {
            throw new BadRequestError(e, routeName);
        }

        /**
         * extracting all the required parameters. 
         */

        const {
            thought,
            anonymous
        } = req.body;

        let username;

        if (!anonymous) {
            username = req.user.username;
        }

        const userId = req.user._id.toString();

        /**
         * Database query to create user in database. 
         */

        let id;
        try {
            id = await mongo.thought.createThought(thought, username, userId, anonymous);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }
        return res.status(201).send({
            message: 'thought created',
            id
        })

    }

}