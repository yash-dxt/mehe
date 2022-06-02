const express = require('express');
const mongo = require('../../db/mongo/index');

const BadRequestError = require('../../errors/BadRequestError');
const DatabaseError = require('../../errors/DatabaseError')

const validateSignupSchema = require('../../utils/joi/signup');
const generatePasswordHash = require('../../utils/password/bcrypt');


const {
    signAccessToken
} = require('../../utils/tokens/jwt');


module.exports = function authenticationRouter() {

    return new express.Router()
        .post('/signup', signup);

    async function signup(req, res) {
        const routeName = 'POST /auth/signup';

        /**
         * Schema validation for Signup API. 
         * Using a Joi Object which is present in utils. 
         */

        try {
            validateSignupSchema(req.body);
        } catch (e) {
            throw new BadRequestError(e, routeName);
        }

        /**
         * extracting all the required parameters. 
         */

        const {
            password,
            username,
            email
        } = req.body;


        /**
         * Generating hashed password to store in database. 
         * Also, generating accessToken, to store in db & return to client. 
         * We're having a one login at a time. 
         */
        const hashedPassword = await generatePasswordHash(password);

        const accessToken = signAccessToken(username);

        /**
         * Database query to create user in database. 
         */

        let id;
        try {
            id = await mongo.user.createNewUser(username, hashedPassword, email, accessToken);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(201).send({
            message: 'user created',
            id,
            accessToken
        })

    }

}