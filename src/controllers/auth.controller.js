"use strict";

const jwtService = require("../services/jwt.service");

/**
 * Handles an authentication request.
 * @param req, the request object, must contain the username in its body.
 * @param res, the response object.
 */
module.exports.authenticate = (req, res) => {
    const payload = req.body;

    if (!payload || !payload.username) {
        res.status(400).send("missing username");
        return;
    }

    const token = jwtService.signJwt({ username: payload.username });
    res.status(200).contentType("plain/text").send(token);
};
