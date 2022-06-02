module.exports = (schema, requestSchema) => {

    var res = schema.validate(requestSchema);

    if (res.error) {
        throw res.error.details[0].message
    }

}