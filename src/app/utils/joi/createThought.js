const Joi = require('joi');
const validate = require('./index');


const schema = Joi.object({
    thought: Joi.string().min(5).max(350).required(),
    anonymous: Joi.boolean().required()
})

const validateCreateThoughtSchema = (toBeValidatedSchema) => {
    validate(schema, toBeValidatedSchema);
}

module.exports = validateCreateThoughtSchema;