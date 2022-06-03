const Joi = require('joi');
const validate = require('./index');


const schema = Joi.object({
    username: Joi.string().min(3).max(25).alphanum().required()
})

const listThoughtsForUser = (toBeValidatedSchema) => {
    validate(schema, toBeValidatedSchema);
}

module.exports = listThoughtsForUser;