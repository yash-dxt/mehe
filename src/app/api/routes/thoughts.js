const express = require('express');
const mongo = require('../../db/mongo/index');
const auth = require('../../middleware/auth')
const BadRequestError = require('../../errors/BadRequestError');
const DatabaseError = require('../../errors/DatabaseError');
const validateCreateThoughtSchema = require('../../utils/joi/createThought');
const validateUsername = require('../../utils/joi/listThoughtsForUser');
const listThoughtsForUser = require('../../utils/joi/listThoughtsForUser');

module.exports = function thoughtRouter() {

    return new express.Router()
        .post('/', auth(true), createThought)
        .get('/', auth(), getThoughtsForUsername)
        .get('/self', auth(true), getAllPersonalThoughts);

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

    async function getAllPersonalThoughts(req, res) {
        const routeName = 'GET /thoughts/self'

        const userId = req.user._id.toString();

        try {
            var thoughts = await mongo.thought.getAllSelfThoughts(userId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        return res.status(200).send({
            thoughts
        });
    }

    async function getThoughtsForUsername(req, res) {
        const routeName = 'GET /thoughts/self'

        try {
            listThoughtsForUser(req.query);
        } catch (e) {
            throw new BadRequestError(e, routeName)
        }

        const {
            username
        } = req.query

        try {
            var thoughts = await mongo.thought.getThoughtsForUser(username);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        return res.status(200).send({
            thoughts
        });
    }
}