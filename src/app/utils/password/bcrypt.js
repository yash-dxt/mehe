const bcrypt = require('bcryptjs');


const generatePasswordHash = async (password) => {
    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 8);
    } catch (e) {
        throw e;
    }

    return hashedPassword;

}

const checkPasswordHash = async (password, hashedPassword) => {
    try {
        const res = await bcrypt.compare(password, hashedPassword);

        if (!res) {
            throw "Bad Credentials";
        }

    } catch (e) {
        throw e;
    }
}


module.exports = {
    generatePasswordHash,
    checkPasswordHash
}