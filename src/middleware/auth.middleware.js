"use strict";

const jwt = require("jsonwebtoken");
const privateKey = "TOTALLY-SUPER-SECRET-KEY";

const verifyJwt = (bearer) => {
    const token = bearer.split(" ")[1];
    if (!token) {
        return false;
    }
    return !!jwt.verify(token, privateKey);
};

module.exports = (req, res, next) => {
    const allowedRoutes = ["/api/login/"];

    const requestedRoute = req.path;

    for (let i = 0; i < allowedRoutes.length; ++i) {
        if (allowedRoutes[i] === requestedRoute) {
            return next();
        }
    }

    const hasAuthHeader = !!req.headers.authorization;
    const valid = hasAuthHeader && verifyJwt(req.headers.authorization);
    if (!valid) {
        return res.sendStatus(403);
    }
    return next();
};
