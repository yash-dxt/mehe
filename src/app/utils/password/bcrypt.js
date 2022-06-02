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

module.exports = generatePasswordHash;