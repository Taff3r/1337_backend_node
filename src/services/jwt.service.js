"use strict";

const jwt = require("jsonwebtoken");
const privateKey = "TOTALLY-SUPER-SECRET-KEY";

/**
 * Returns time stamp for two hours in the future.
 */
const TwoHourExpiration = () => Math.floor(Date.now() / 1000) + 2 * 60 * 60;

/**
 * Signs the data inside a JWT using the private key with an expiration time of two hours.
 * @param data, the data that should be signed.
 * @returns the signed token.
 */
module.exports.signJwt = (data) => {
    const token = jwt.sign(
        {
            data: data,
            exp: TwoHourExpiration(),
        },
        privateKey
    );
    return token;
};

/**
 * Verify a JWT token using the private key.
 * @returns the verified token, or an error if it occurred.
 */
module.exports.verifyJwt = (token) => {
    return jwt.verify(token, privateKey, (err, data) => {
        if (err) {
            throw err;
        }
        return data;
    });
};
