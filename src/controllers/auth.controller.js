"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const privateKey = "TOTALLY-SUPER-SECRET-KEY";

const TwoHourExpiration = () => Math.floor(Date.now() / 1000) + 2 * 60 * 60;

module.exports.authenticate = (req, res) => {
    console.log("trying to authenticate user");
    const payload = req.body;

    if (!payload || !payload.username) {
        res.status(400).send("missing username");
        return;
    }

    const token = jwt.sign(
        {
            data: {
                name: payload.username,
            },
            exp: TwoHourExpiration()
        },
        privateKey
    );
    console.log(token);
    res.status(200).contentType("plain/text").send(token);
};
