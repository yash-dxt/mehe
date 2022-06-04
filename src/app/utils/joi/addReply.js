const Joi = require('joi');
const validate = require('./index');


const schema = Joi.object({
    thoughtId: Joi.string().required(),
    anonymous: Joi.boolean().required(),
    reply: Joi.string().min(5).max(350).required()
})

const addReplySchema = (toBeValidatedSchema) => {
    validate(schema, toBeValidatedSchema);
}

module.exports = addReplySchema;