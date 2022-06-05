const bcrypt = require('bcryptjs');


/**
 * It takes a password, hashes it, and returns the hashed password.
 * @param password - The password to be hashed.
 * @returns a hashed password.
 */
const generatePasswordHash = async (password) => {
    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 8);
    } catch (e) {
        throw e;
    }

    return hashedPassword;

}

/**
 * This function takes a password and a hashed password, and returns true if the password matches the
 * hashed password, and throws error if it doesn't. 
 * @param password - The password that the user entered
 * @param hashedPassword - The hashed password from the database
 */

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