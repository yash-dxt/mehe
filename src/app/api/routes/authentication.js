const express = require('express');
const mongo = require('../../db/mongo/index');

const BadRequestError = require('../../errors/BadRequestError');
const DatabaseError = require('../../errors/DatabaseError');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');

const validateLoginSchema = require('../../utils/joi/login');
const validateSignupSchema = require('../../utils/joi/signup');
const {
    generatePasswordHash,
    checkPasswordHash
} = require('../../utils/password/bcrypt');


const {
    signAccessToken
} = require('../../utils/tokens/jwt');


module.exports = function authenticationRouter() {

    return new express.Router()
        .post('/signup', signup)
        .post('/login', login);

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



    async function login(req, res) {
        const routeName = 'POST /auth/login';

        /**
         * Schema validation using joi.
         */

        try {
            validateLoginSchema(req.body);
        } catch (e) {
            throw new BadRequestError(e, routeName);
        }

        const {
            username,
            password
        } = req.body;


        /**
         * Fetching user from database. 
         */
        let user;

        try {
            user = await mongo.user.getUserByUsername(username);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!user) {
            throw new NotAuthenticatedError('Not a valid user', routeName);
        }


        /**
         * Comparing hashed password with request's password. 
         * If it fails, we send 401.
         */
        try {
            await checkPasswordHash(password, user.password);
        } catch (e) {
            throw new NotAuthenticatedError('Bad Credentials', routeName);
        }

        /***
         * Signing access token, setting in database as newAccessToken 
         * and then deleting hashed password & sending it to client. 
         */

        const accessToken = signAccessToken(username);


        try {
            await mongo.user.setNewAccessToken(username, accessToken);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        delete user.password;

        res.status(200).send({
            user,
            accessToken
        });

    }
}