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
        .get('/', auth(), getAllThoughts)
        .get('/id', auth(), getThoughtByIdAlongWithReplies)
        .get('/self', auth(true), getAllPersonalThoughts)
        .get('/username', auth(), getThoughtsForUsername)
        .delete('/', auth(true), deleteThoughtWithReplies)


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
        const routeName = 'GET /thoughts/username'

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

    async function getAllThoughts(req, res) {

        const routeName = 'GET /thoughts/'

        let {
            limit,
            skip
        } = req.body;

        /**
         * Schema validation. 
         */

        if (!limit) {
            limit = 10;
        }

        if (!skip) {
            skip = 0;
        }

        if (typeof (limit) !== 'number' || typeof (skip) !== 'number' || limit <= 0 || skip < 0) {
            throw new BadRequestError('Bad parameters', routeName)
        }

        let thoughts;
        try {
            thoughts = await mongo.thought.getAllThoughts(limit, skip);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            thoughts
        })

    }

    async function getThoughtByIdAlongWithReplies(req, res) {
        const routeName = 'GET /thought/id';

        const {
            thoughtId
        } = req.query;

        if (!thoughtId || typeof (thoughtId) != 'string') {
            throw new BadRequestError('Bad parameters', routeName);
        }

        let thoughts;

        try {
            thoughts = await mongo.thought.getThoughtByIdAlongWithReplies(thoughtId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            thoughts
        })

    }

    async function deleteThoughtWithReplies(req, res) {
        const routeName = 'DELETE /thought';

        const userId = req.user._id.toString();

        const {
            thoughtId
        } = req.query;

        if (!thoughtId || typeof (thoughtId) != 'string') {
            throw new BadRequestError('Bad params', routeName);
        }

        try {
            await mongo.thought.deleteThought(thoughtId, userId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        return res.status(200).send({
            message: 'Success'
        })

    }
}