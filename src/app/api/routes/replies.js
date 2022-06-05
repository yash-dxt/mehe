const express = require('express');
const mongo = require('../../db/mongo/index');
const auth = require('../../middleware/auth')
const BadRequestError = require('../../errors/BadRequestError');
const DatabaseError = require('../../errors/DatabaseError');
const addReplySchema = require('../../utils/joi/addReply');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');


module.exports = function replyRouter() {

    return new express.Router()
        .post('/', auth(true), addReply)
        .delete('/', auth(true), deleteReply)


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


        /**
         * Fetching thought from database. 
         * To see if it is valid or not. 
         */
        try {
            var thought = await mongo.thought.getThoughtByThoughtId(thoughtId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }



        if (!thought) {
            throw new BadRequestError('No thought with corresponding thoughtId found', routeName);
        }


        /**
         * Extract userId from req.user (coming from auth middleware) 
         * If the user is anonymous we only store the userId & if not we store 
         * both userId & username. 
         */

        const thoughtIdToString = thought._id.toString();
        const userId = req.user._id.toString();

        if (!anonymous) {
            var username = req.user.username;
        }

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

    async function deleteReply(req, res) {
        const routeName = 'DELETE /reply';

        const userId = req.user._id.toString();
        const {
            replyId
        } = req.query;

        /**
         * Checking if replyId exists and is valid. 
         */

        if (!replyId || typeof (replyId) != 'string') {
            throw new BadRequestError('Bad Params', routeName);
        }


        /**
         * Try to delete response and also simultaneously validate if 
         * reply belongs to user. 
         * If nothing is deleted, we throw an error. 
         */
        try {
            var delRes = await mongo.replies.deleteReply(replyId, userId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (delRes == 0) throw new BadRequestError("Could not delete the article", routeName)

        return res.status(200).send({
            message: 'deleted'
        })
    }
}