const Joi = require('joi');
const validate = require('./index');


const schema = Joi.object({
    username: Joi.string().min(3).max(25).alphanum().required(),
    password: Joi.string().min(8).max(100).required()
})

const validateLoginSchema = (toBeValidatedSchema) => {
    validate(schema, toBeValidatedSchema);
}

module.exports = validateLoginSchema;