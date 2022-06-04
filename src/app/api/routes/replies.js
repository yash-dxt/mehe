const express = require('express');
const mongo = require('../../db/mongo/index');
const auth = require('../../middleware/auth')
const BadRequestError = require('../../errors/BadRequestError');
const DatabaseError = require('../../errors/DatabaseError');
const addReplySchema = require('../../utils/joi/addReply');


module.exports = function replyRouter() {

    return new express.Router()
        .post('/', auth(true), addReply)


    async function addReply(req, res) {
        const routeName = 'POST /reply/'

        try {
            addReplySchema(req.body);
        } catch (e) {
            throw new BadRequestError(e, routeName)
        }

        const {
            thoughtId,
            anonymous,
            reply
        } = req.body;


        try {
            var thought = await mongo.thought.getThoughtByThoughtId(thoughtId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        if (!thought) {
            throw new BadRequestError('No thought with corresponding thoughtId found', routeName);
        }

        const thoughtIdToString = thought._id.toString();
        const userId = req.user._id.toString();
        const username = req.user.username;

        try {
            var id = await mongo.replies.addReply(thoughtIdToString, reply, userId, anonymous, username);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(201).send({
            message: 'success',
            id
        })
    }
}