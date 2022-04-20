"use strict";

const jwtService = require("../services/jwt.service");

/**
 * Middleware for all requests to /api/*.
 * Checks if a request is on one of the "allowed" paths where authentication is not necessary,
 * otherwise, it checks if the user can be authenticated.
 */
module.exports = (req, res, next) => {
    /*
     * NOTE: The instructions tell that login should happen on /api/login,
     * however in reality the test site acctually tries to access /api/login/
     * (you might want to fix this, since /api/login is not a directory)
     */
    const allowedRoutes = ["/login", "/login/"];

    const requestedRoute = req.path;
    for (let i = 0; i < allowedRoutes.length; ++i) {
        if (allowedRoutes[i] === requestedRoute) {
            return next();
        }
    }

    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    try {
        let valid = jwtService.verifyJwt(token);
        return next();
    } catch (err) {
        return res.status(401).send(err.message);
    }
};
